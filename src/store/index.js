import Vue from 'vue'
import Vuex from 'vuex'
import project from './module/project'
import router from './module/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    collapse: false
  },
  mutations: {
    setCollapse(state, v) {
      state.collapse = v;
    }
  },
  actions: {
  },
  modules: {
    project,
    router
  }
})
