import Vue from 'vue'
import Vuex from 'vuex'
import createVuexAlong from 'vuex-along'
Vue.use(Vuex)
export default new Vuex.Store({
  //用户信息
  state: {
    //用户id
    userId: '',
    joinRoom: {},
    leaveRoom: {}
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId
    },
    setJoinRoom(state, payload) {
      state.joinRoom.username = payload.username
    },
    setLeaveRoom(state, payload) {
      state.leaveRoom.username = payload.username
    }
  },
  actions: {
    setUserId(context, userId) {
      context.commit('setUserId', userId)
    }
  },
  //解决刷新后vuex数据重置问题
  plugins: [createVuexAlong()]
})
