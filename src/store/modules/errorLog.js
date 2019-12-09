import { saveErrorLog } from '@/api/system'

const state = {
  logs: []
}

const mutations = {
  ADD_ERROR_LOG: (state, log) => {
    state.logs.push(log)
  },
  CLEAR_ERROR_LOG: (state) => {
    state.logs.splice(0)
  }
}

const actions = {
  addErrorLog({ commit }, log) {
    commit('ADD_ERROR_LOG', log)
  },
  clearErrorLog({ commit }) {
    commit('CLEAR_ERROR_LOG')
  },
  saveErrorLog({ commit }, log) {
    const { err, vm, info, url } = log
    return new Promise((resolve, reject) => {
      saveErrorLog({ err, vm, info, url })
        .then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
