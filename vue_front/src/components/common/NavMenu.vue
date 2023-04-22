<template>
		<el-header style="width: 100%; height: 78px; position: fixed; background-color: #3da181; z-index: 100; margin-top: -8px;">
		  <span style="line-height: 86px; float: left; font-size: 28px;font-weight: bold; margin-left: 20px;">HTY在线考试系统</span>
		  <span style="position: absolute; line-height: 86px; float: right; right: 120px; font-size: 16px;font-weight: bold">欢迎你，{{username}}!</span>
		  <el-button type="text" style="float: right; line-height: 48px; margin-top: 4px; margin-right: 15px;" v-on:click="logoff">退出登录</el-button>
		</el-header>
</template>

<script>
	import store from '../../store'
  export default {
    name: 'NavMenu',
    data () {
      return {
		username: store.state.user.username
      }
    },
		methods: {
			logoff() {
				// console.log('退出登录')
				// console.log(store.state.user.username)
				this.$store.commit('logoff')
				var path = this.$route.query.redirect
				this.$router.replace({path: '/login'})
				// console.log("aaa")
			}
		}
  }
</script>

<style scoped>
  a{
    text-decoration: none;
  }

  span {
    pointer-events: none;
  }
</style>

