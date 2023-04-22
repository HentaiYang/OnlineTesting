<template>
	<body id="poster">
		<el-form class="login-container" label-position="left" label-width="0px">
			<h3 class="login_title">答题系统登录</h3>
			<el-form-item>
				<el-input type="text" prefix-icon="el-icon-user" v-model="loginForm.account" auto-complete="off" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input type="password" prefix-icon="el-icon-lock" v-model="loginForm.password" auto-complete="off" placeholder="密码" @keyup.enter.native="login"></el-input>
			</el-form-item>
			<el-form-item style="width: 100%">
				<el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="login">登录
				</el-button>
			</el-form-item>
			<div style="font-size: 16px;">
				如果没有账号请先 <router-link to="/register">注册</router-link>
			</div>
		</el-form>
	</body>

</template>


<script>
	import store from '../store'
	export default {
		name: 'Login',
		data() {
			return {
				loginForm: {
					account: '',
					password: ''
				},
				responseResult: []
			}
		},
		methods: {
			login() {
				if(!this.loginForm.account){
					this.$message({
						message: "请输入用户名！", 
						type: 'error', 
						customClass: 'msgErrorClass',
						center: true
						})
					return
				}
				if(!this.loginForm.password){
					this.$message({
						message: "请输入密码！", 
						type: 'error', 
						customClass: 'msgErrorClass',
						center: true
						})
					return
				}
				var _this = this
				// console.log(this.$store.state)
				this.$axios
					.post('/login', { //向后端传输登录数据
						username: this.loginForm.account,
						password: this.loginForm.password
					})
					.then(successResponse => { //获取后端结果
						console.log('code:', successResponse.data.code)
						if (successResponse.data.code === 200) {
							console.log(successResponse.data)
							_this.$store.commit('login', successResponse.data.user)
							var path = _this.$route.query.redirect
							_this.$router.replace({path: path === '/' || path === undefined ? '/index' : path})
						} else if (successResponse.data.code === 400) {
							_this.$message({
								message: "用户名或密码有误！", 
								type: 'error', 
								customClass: 'msgErrorClass',
								center: true
								})
							_this.loginForm.password = ''
						}
					})
					.catch(failResponse => {})
			}
		}
	}
</script>


<style>
	.login-container {
		border-radius: 15px;
		background-clip: padding-box;
		margin: 180px auto 0;
		width: 350px;
		padding: 35px 35px 15px 35px;
		background-color: #fff;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
	}

	.login_title {
		margin: 0px auto 40px auto;
		text-align: center;
		color: #505458;
	}

	#poster {
		background: url("../assets/login.jpg") no-repeat;
		background-position: center;
		height: 100%;
		width: 100%;
		background-size: cover;
		position: fixed;
	}
	
	.msgErrorClass{
		border-radius: 10px;
	}

	body {
		margin: 0px;
	}

</style>
