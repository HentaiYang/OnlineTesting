import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//设置需要的状态变量和方法
export default new Vuex.Store({
  state: {
	//使用本地存储
	//扩展性，保存用户完整数据
    user: {
		id: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).id,
      username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username,
      authority: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).authority,
    }
  },
  mutations: {
    login (state, user) {
      state.user = user
      window.localStorage.setItem('user', JSON.stringify(user))
    },
	logoff(state){
		window.localStorage.removeItem('user')
		state.user = {}
	}
  }
})
