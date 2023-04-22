<template>
	<div class="pageArea">
		<div class="funcArea">
			<span style="font-size: 24px; font-weight: bold;">数据无价，谨慎操作</span>
			<div class="searchArea">
				<el-select v-model="searchType" placeholder="权限" style="flex: 3;" @change="search">
				  <el-option label="所有用户" :value="''"></el-option>
				  <el-option label="管理员" :value="'admin'"></el-option>
				  <el-option label="普通用户" :value="'user'"></el-option>
				</el-select>
				<el-select v-model="searchLabel" placeholder="搜索类型" style="flex: 4;">
				  <el-option label="根据用户名搜索" :value="'username'"></el-option>
				  <el-option label="根据学号搜索" :value="'studentid'"></el-option>
				  <el-option label="根据手机号搜索" :value="'phonenumber'"></el-option>
				  <el-option label="根据学院搜索" :value="'college'"></el-option>
				  <el-option label="根据班级搜索" :value="'classinfo'"></el-option>
				</el-select>
				<el-input placeholder="输入" v-model="searchInput" autocomplete="off" style="flex: 5;" @input="search"></el-input>
			</div>
			
		</div>
		<el-table
		:data="showList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
		height=58vh
		border
		style=""
		@selection-change="handleSelectionChange">
			<!-- <el-table-column
		      type="selection"
		      width="55"
			  style="border-color: black;">
		    </el-table-column> -->
			<el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
			<el-table-column align="center" prop="username" label="用户名" width="100"></el-table-column>
			<el-table-column align="center" prop="sex" label="性别" width="100"></el-table-column>
			<el-table-column align="center" prop="age" label="年龄" width="100"></el-table-column>
			<el-table-column align="center" prop="phonenumber" label="电话" width="160"></el-table-column>
			<el-table-column align="center" prop="studentid" label="学号" width="160"></el-table-column>
			<el-table-column align="center" prop="college" label="学院" width="220"></el-table-column>
			<el-table-column align="center" prop="classinfo" label="班级" width="120"></el-table-column>
			<el-table-column align="center" prop="authority" label="权限" width="100"></el-table-column>

			<el-table-column
			      align="center"
			      fixed="right"
			      label="操作"
			      width="180">
			      <template slot-scope="scope">
			        <el-button @click="handleClickEdit(scope.row)" type="primary">编辑</el-button>
			        <el-button @click="handleClickDelete(scope.row)" type="danger">删除</el-button>
			      </template>
			    </el-table-column>
				<user-edit-form @onSubmit="loadUsers()" ref="edit"></user-edit-form> 
				<question-add-auto @onSubmit="loadQuestions()" ref='autoAdd'></question-add-auto>
		</el-table>
		<div class="pageButtonArea">
			<div class="buttons">
				<el-button @click="handleClickAdd()">添加用户</el-button>
			</div>
			<div style="margin-right: 300px; margin-top: 20px;">
				<el-pagination
				      @current-change="handleCurrentChange"
				      :current-page="currentPage"
				      :page-size="pagesize"
					  background
				      layout="total, prev, pager, next, jumper"
				      :total="showList.length"
					  >
				    </el-pagination>
			</div>
		</div>
	</div>
	
	
</template>

<style>
	.pageArea{
		width: 80%;
		max-width: 1541.85px;
		margin-top: 7vh;
		margin-left: 10%;
		margin-bottom: 2vh;
		height: 73vh;
		background-color: #fff;
	}
	.funcArea{
		width: 100%;
		background-color: #fff;
		margin-bottom: 10px;
		text-align: left;
	}
	
	.pageButtonArea{
		width: 100%;
		height: 7vh;
		background-color: #fff;
		text-align: right;
		display: flex;
		flex-direction: row;
	}
	
	.buttons{
		flex: 3;
		text-align: left;
		margin-top: 16px;
		margin-left: 20px;
	}
	.searchArea{
		width: 45%;
		margin-left: 55%;
		display: flex;
		text-align: right;
	}

</style>

<script>
	import UserEditForm from './UserEditForm'
	import QuestionAddAuto from './QuestionAddAuto'
	export default {
		name: "UserManage",
		components: {
			UserEditForm,
			QuestionAddAuto
		},
		data() {
			return {
				users: [],
				showList: [],
				searchLabel: "username",
				searchType: "",
				searchInput: "",
				nowSelecting: [],
				currentPage: 1,
				pagesize: 20,
			}
		},

		mounted: function() {
			this.loadUsers()
			// console.log(window.location.pathname)
		},
		methods: {
			loadUsers() {
				var _this = this
				this.$axios.get('/users').then(resp => {
					if (resp && resp.status === 200) {
						_this.users = resp.data
						_this.showList = resp.data
					}
				})
			},
			handleSelectionChange(val){
				this.nowSelecting = val
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage
				// console.log(this.currentPage)
				let overflowY = this.$el.getElementsByClassName("el-table__body-wrapper")[0];
				 if (!overflowY) {
				     return;
				 }
				overflowY.scrollTop = 0;
			},
			search(){
				// console.log(this.searchLabel)
				// console.log(this.searchInput)
				this.showList = this.users.filter((a)=>{
					if(!(a[this.searchLabel] && a['authority'])){return false}
					return (a[this.searchLabel].indexOf(this.searchInput) != -1 && a['authority'].indexOf(this.searchType) != -1)
					})
			},
			handleClickDelete(obj) {
				let id = obj.id
				this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios
						.post('/userDelete', {
							id: id
						}).then(resp => {
							if (resp && resp.status === 200) {
								this.$message({
									type: 'success',
									message: '删除成功'
								})
								this.loadUsers()
							}
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
				// alert(id)
			},
			handleClickEdit(obj) {
				this.$refs.edit.dialogFormVisible = true
				this.$refs.edit.isEdit = true
				this.$refs.edit.form = {
					id: obj.id,
					username: obj.username,
					password: obj.password,
					sex: obj.sex,
					age: obj.age,
					phonenumber: obj.phonenumber,
					studentid: obj.studentid,
					college: obj.college,
					classinfo: obj.classinfo,
					authority: obj.authority,
					salt: obj.salt
				}
			},
			handleClickAdd() {
				this.$refs.edit.dialogFormVisible = true
				this.$refs.edit.isEdit = false
				this.$refs.edit.form = {
					id: "",
					username: "",
					password: "",
					sex: "",
					age: "",
					phonenumber: "",
					studentid: "",
					college: "",
					classinfo: "",
					authority: "user",
				}
			},
		}
	}
</script>
