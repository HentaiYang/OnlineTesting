import Vue from 'vue'
import Router from 'vue-router'
// 导入组件
import AppIndex from '@/components/home/AppIndex'
import QuestionManage from '@/components/home/QuestionManage'
import PaperManage from '@/components/home/PaperManage'
import UserManage from '@/components/home/UserManage'
import TestPage from '@/components/home/TestPage'
import RecodePage from '@/components/home/RecodePage'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'firstPage'
		},
		{
			path: '/home',
			name: 'Home',
			component: Home,
			// home页面不需要被访问
			redirect: '/index',
			children: [
				{
				path: '/index',
				name: 'AppIndex',
				component: AppIndex,
				meta: {
					requireAuth: true
				}
				},{
					path: '/question',
					name: 'QuestionManage',
					component: QuestionManage,
					meta: {
						requireAuth: true,
						adminOnly: true
					}
				},{
					path: '/paper',
					name: 'PaperManage',
					component: PaperManage,
					meta: {
						requireAuth: true,
						adminOnly: true
					}
				},{
					path: '/user',
					name: 'UserManage',
					component: UserManage,
					meta: {
						requireAuth: true,
						adminOnly: true
					}
				},{
					path: '/test',
					name: 'TestPage',
					component: TestPage,
					props: route => ({paperId: route.query.paperId}),
					meta: {
						requireAuth: true
					}
				},{
					path: '/recode',
					name: 'RecodePage',
					component: RecodePage,
					props: route => ({paperId: route.query.paperId}),
					meta: {
						requireAuth: true
					}
				}
			]
		},
		
		{
			path: '/login',
			name: 'Login',
			component: Login
		},
		{
			path: '/register',
			name: 'Register',
			component: Register
		},
		

	]
})
