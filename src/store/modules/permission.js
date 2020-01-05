import { asyncRoutes, constantRoutes } from '@/router'
import _import from '@/router/_import'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  console.log('hasPermission roles', roles, route)
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

export function filterAsyncRouters(routers) {
  const res = []
  routers.forEach(menu => {
    // 删除无用属性
    delete menu.menuId
    delete menu.sort
    delete menu.description
    delete menu.status
    delete menu.insertTime
    delete menu.insertBy
    delete menu.updateTime
    delete menu.updateBy
    if (menu.parentId === '0' && !menu.component) {
      menu.component = Layout
    } else {
      if (menu.component) {
        menu.component = _import(menu.component)
      } else {
        delete menu.component
      }
    }
    delete menu.parentId
    if (!menu.redirect) {
      delete menu.redirect
    }
    console.log('menu.children:', menu.children)
    let childrenLength = 0
    if (menu.children) {
      childrenLength = menu.children.length
    }
    if (childrenLength === 1) {
      delete menu.name
    }
    // if (item === 1) {
    // menu.path = ''
    // delete menu.name
    // }
    // if (!menu.name) {
    //   delete menu.name
    // }
    if (menu.hidden === 'false') {
      delete menu.hidden
    }
    menu.meta = {}
    if (menu.icon) {
      menu.meta.icon = menu.icon
      delete menu.icon
    }
    if (menu.title) {
      menu.meta.title = menu.title
      delete menu.title
    }
    if (childrenLength > 0) {
      filterAsyncRouters(menu.children)
    } else {
      menu.children = []
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
  generateRoutes({ commit }, { routers, role }) {
    return new Promise(resolve => {
      let accessedRoutes
      console.log('routers', routers)
      console.log('role-', role)
      if (role === 'visitor') {
        accessedRoutes = asyncRoutes || []
      } else {
        const router = routers[role]
        accessedRoutes = filterAsyncRouters(router)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      }
      console.log('accessedRoutes', accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
