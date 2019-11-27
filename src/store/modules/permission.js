import { asyncRoutes, constantRoutes } from '@/router'
import _import from '@/router/_import'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export function filterAsyncRouters(item, routers) {
  const res = []
  routers.forEach(menu => {
    // 删除无用属性
    delete menu.menuId
    delete menu.parentId
    delete menu.sort
    delete menu.description
    delete menu.status
    delete menu.insertTime
    delete menu.insertBy
    delete menu.updateTime
    delete menu.updateBy
    if (menu.component) {
      menu.component = _import(menu.component) // 动态匹配组件
    } else {
      menu.component = Layout
    }

    if (!menu.redirect) {
      delete menu.redirect
    }
    if (menu.children.length === 1) {
      delete menu.name
    }

    // if (menu.children.length > 1) {
    //   menu.path = '/'
    // }
    if (item === 1) {
      menu.path = ''
      delete menu.name
    }
    if (!menu.name) {
      delete menu.name
    }
    if (menu.hidden === 'false') {
      delete menu.hidden
    }
    if (menu.children.length !== 1) {
      if (menu.icon && menu.title) { // 配置 菜单标题 与 图标
        menu.meta = {
          title: menu.title,
          icon: menu.icon
        }
      }
    }
    delete menu.icon
    delete menu.title
    if (menu.children.length > 0) {
      filterAsyncRouters(menu.children.length, menu.children)
    } else {
      delete menu.children
    }
    res.push(menu)
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, { routers, roles }) {
    return new Promise(resolve => {
      let accessedRoutes
      console.log('routers', routers)
      console.log('roles', roles)
      const roleList = []
      roles.forEach(role => {
        roleList.push(role.ename)
      })
      if (roleList.size < 1) {
        accessedRoutes = asyncRoutes || []
      } else {
        const router = routers[roleList[0]]
        accessedRoutes = filterAsyncRouters(0, router)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      }
      console.log('accessedRoutes', accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
