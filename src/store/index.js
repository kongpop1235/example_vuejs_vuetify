import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    check: false,
    api: "http://localhost:3000/",
    username:'',
    accessToken:'',
  },
  getters: {
    api:state=>state.api,
    username:state=>state.username,
    accessToken:state=>state.accessToken,
    check:state=>state.check,
  },
  mutations: {
    setCheck(state,check) {
      state.check = check;
    },
    setUsername(state,username) {
      state.username = username;
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
  },
  actions: {
  },
  modules: {
  }
})
