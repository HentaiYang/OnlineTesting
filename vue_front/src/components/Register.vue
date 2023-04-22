<template>
	<body id="poster">
		<el-form class="register-container" label-position="center">
			<h3 class="register_title">欢迎注册</h3>
			<div class="r_line"></div>
			<el-form-item :label-width="labelWidth">
				<span slot="label" style="font-size: 16px; font-weight: bold;">姓名</span>
				<el-input prefix-icon="el-icon-user" v-model="form.username" auto-complete="off" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item :label-width="labelWidth">
				<span slot="label" style="font-size: 16px; font-weight: bold;">密码</span>
				<el-input type="password" prefix-icon="el-icon-lock" v-model="form.password" auto-complete="off" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item :label-width="labelWidth">
				<span slot="label" style="font-size: 16px; font-weight: bold;">确认密码</span>
				<el-input type="password" prefix-icon="el-icon-lock" v-model="confirmPassword" auto-complete="off" placeholder="确认密码"></el-input>
			</el-form-item>
			<el-form-item :label-width="labelWidth">
				<span slot="label" style="font-size: 16px; font-weight: bold;">性别</span>
				<el-input v-model="form.sex" auto-complete="off" placeholder="性别"></el-input>
			</el-form-item>
			<el-form-item :label-width="labelWidth">
				<span slot="label" style="font-size: 16px; font-weight: bold;">年龄</span>
				<el-input v-model="form.age" auto-complete="off" placeholder="年龄"></el-input>
			</el-form-item>
			<el-form-item :label-width="labelWidth">
				<span slot="label" style="font-size: 16px; font-weight: bold;">电话号码</span>
				<el-input v-model="form.phonenumber" auto-complete="off" placeholder="手机号"></el-input>
			</el-form-item>
			<el-form-item :label-width="labelWidth">
				<span slot="label" style="font-size: 16px; font-weight: bold;">学号</span>
				<el-input v-model="form.studentid" auto-complete="off" placeholder="学号"></el-input>
			</el-form-item>
			<el-form-item :label-width="labelWidth">
				<span slot="label" style="font-size: 16px; font-weight: bold;">学院</span>
				<el-input v-model="form.college" auto-complete="off" placeholder="学院"></el-input>
			</el-form-item>
			<el-form-item :label-width="labelWidth">
				<span slot="label" style="font-size: 16px; font-weight: bold;">班级信息</span>
				<el-input v-model="form.classinfo" auto-complete="off" placeholder="班级信息"></el-input>
			</el-form-item>
			<el-form-item style="width: 100%;">
				<el-button type="primary" style="width: 100%;background: #505458;border: none;margin: 30px 0 0;" v-on:click="register">注册
				</el-button>
			</el-form-item>

		</el-form>
	</body>

</template>


<script>
	export default {
		name: 'Register',
		data() {
			return {
				form: {
					username: '',
					password: '',
					sex: "",
					age: "",
					phonenumber: "",
					studentid: "",
					college: "",
					classinfo: ""
				},
				confirmPassword: "",
				labelWidth: '80px'
			}
		},
		methods: {
			register() {
				var _this = this
				let form = this.form
				let cpassword = this.confirmPassword
				var digit = /[0-9]+/ //匹配数字
				if(form.username == ""){
					_this.$message({message:"用户名不能为空！",type:"error"})
					return
				}
				if(form.password == ""){
					_this.$message({message:"密码不能为空！",type:"error"})
					return
				}
				if(cpassword == ""){
					_this.$message({message:"确认密码不能为空！",type:"error"})
					return
				}
				if(form.sex == ""){
					_this.$message({message:"性别不能为空！",type:"error"})
					return
				}
				if(form.age == ""){
					_this.$message({message:"年龄不能为空！",type:"error"})
					return
				}
				if(form.phonenumber == ""){
					_this.$message({message:"手机号不能为空！",type:"error"})
					return
				}
				if(form.studentid == ""){
					_this.$message({message:"学号不能为空！",type:"error"})
					return
				}
				if(form.college == ""){
					_this.$message({message:"学院不能为空！",type:"error"})
					return
				}
				if(form.classinfo == ""){
					_this.$message({message:"班级信息不能为空！",type:"error"})
					return
				}
				if(!digit.test(form.age)){
					_this.$message({message:"年龄应为数字！",type:"error"})
					return
				}
				if(!digit.test(form.phonenumber)){
					_this.$message({message:"手机号应为数字！",type:"error"})
					return
				}
				if(!digit.test(form.studentid)){
					_this.$message({message:"学号应为数字！",type:"error"})
					return
				}
				if(form.phonenumber.length != 11){
					_this.$message({message:"手机号应为11位！",type:"error"})
					return
				}
				if(form.studentid.length != 11){
					_this.$message({message:"学号应为11位！",type:"error"})
					return
				}
				if(form.password != cpassword){
					_this.$message({message:"两次输入的密码不一致！",type:"error"})
					return
				}
				if(form.sex != '男' && form.sex != '女'){
					console.log(form.sex)
					_this.$message({message:"性别应为‘男’或‘女’！",type:"error"})
					return
				}
				form.authority = 'user'
				this.$axios
					.post('/register', form)
					.then(resp => {
						if (resp && resp.status === 200) {
						  _this.$message({
						  	message: "注册成功",
						  	type: "success"
						  })
						  _this.goLogin()
						}
					})
					.catch(failResponse => {
						_this.$message({
							message: "注册失败！学号或用户名已存在！",
							type: "error"
						})
					})
			},
			goLogin(){
				this.$router.push({path:'/login'})
			}
		}
	}
</script>


<style>
	.register-container {
		border-radius: 15px;
		background-clip: padding-box;
		margin: 100px auto 0;
		width: 430px;
		padding: 35px 35px 15px 35px;
		background-color: #fff;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
	}

	.register_title {
		margin: 0px auto 10px auto;
		text-align: center;
		font-size: 26px;
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

	body {
		margin: 0px;
	}
	
	.r_line{
		width: 100%;
		height: 1px;
		background-color: #e7e7e7;
		margin-bottom: 30px;
	}

</style>
