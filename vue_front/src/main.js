import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

axios.defaults.baseURL = 'http://localhost:8443/api'
Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(ElementUI)

//钩子函数，访问每一个路由前都会调用
router.beforeEach((to, from, next) => {
	//如果是根页面则直接跳转
    if (to.name == 'firstPage') { 
		next({path: 'index'})
    }
	//登录拦截
	if(to.meta.requireAuth == true){
		// console.log('用户信息：',store.state.user.username)
		  if (!store.state.user.username) { //存在用户信息则不拦截
		    next({
		      path: 'login',
		      query: {redirect: to.fullPath}
		    })
		  }
	} else {
		if(store.state.user.username){
			//如果登录用户进入登录或注册页面
			next({
			  path: 'index',
			})
		}
	}
	//管理员功能拦截
	if (to.meta.adminOnly == true){ //如果是管理员功能
		if(store.state.user.authority != "admin"){
			next({
				path: "index"
			})
		}
	}
	
    next()

  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: { App },
  template: '<App/>'
})

