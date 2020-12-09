import Vue from 'vue'
import Vuex from 'vuex'
import project from './module/project'
import router from './module/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    project,
    router
  }
})
