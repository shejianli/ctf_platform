import { login, logout } from "@/api/user"
import { removeToken, setToken } from "@/utils/auth"

const getDefaultState = () => {
  return {
    token: 'token',
    name: '',
    avatar: '',
    role: null
  }
}

const state = getDefaultState()

const actions = {
  async login({ commit }, loginForm) {
    try {
      const res = await login(loginForm)
      commit('SET_TOKEN', res.data.token)
      setToken(res.data.token)
      return true
    } catch (e) {
      return false
    }
  },

  async logout({ commit }) {
    try {
      await logout()
    } catch (ignore) {
    }

    removeToken()
    commit('RESET_STATE')
  }
}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.name = userInfo.username
    state.avatar = userInfo.avatar
    state.role = userInfo.role
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
