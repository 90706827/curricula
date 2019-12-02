import { login, logout, getInfo, verCode } from '@/api/index'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
const sha256 = require('js-sha256').sha256
import hand from '@/assets/default/headImg.gif'
import store from '@/store'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_ROUTERS: (state, routers) => {
    state.routers = routers
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password, key, verCode } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: sha256(password.trim()),
        key: key,
        verCode: verCode.trim()
      }).then(response => {
        if (response.code === 200) {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const {
          data
        } = response

        if (!data) {
          reject('验证失败，请重新登录.')
        }
        const {
          routers,
          roles,
          name,
          avatar,
          introduction
        } = data

        if (!roles || roles.length <= 0) {
          reject('暂无权限，禁止访问!')
        }
        let header = avatar
        if (!avatar) {
          header = hand + '?' + +new Date()
        }
        const roleList = []
        roles.forEach(item => {
          const role = {}
          role.name = item.name
          role.code = item.ename
          roleList.push(role)
        })
        data.roles = roleList
        const role = roleList[0].code
        data.role = role
        console.log('roleList', roleList)
        commit('SET_ROUTERS', routers)
        commit('SET_ROLES', roleList)
        commit('SET_ROLE', role)
        commit('SET_NAME', name)
        commit('SET_AVATAR', header)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取验证码
  verCode() {
    return new Promise((resolve, reject) => {
      verCode().then((response) => {
        const {
          data
        } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用户退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_ROLE', '')
        commit('SET_ROUTERS', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 清除缓存
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_ROLE', '')
      commit('SET_ROUTERS', [])
      removeToken()
      resolve()
    })
  },

  // 切换角色
  changeRoles({ commit, dispatch, state }, role) {
    return new Promise(async resolve => {
      const { routers } = await dispatch('getInfo')
      resetRouter()
      const accessRoutes = await store.dispatch('permission/generateRoutes', { routers, role })
      router.addRoutes(accessRoutes)
      commit('SET_ROLE', role)
      store.dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
