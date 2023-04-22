<template>
	<div class="pageArea">
		<div class="funcArea">
			<span style="font-size: 24px; font-weight: bold;">数据无价，谨慎操作</span>
			<div class="searchArea">
				<el-select v-model="searchType" placeholder="题目类型" style="flex: 3;" @change="search">
				  <el-option label="所有类型" :value="''"></el-option>
				  <el-option label="单选题" :value="'单选'"></el-option>
				  <el-option label="多选题" :value="'多选'"></el-option>
				  <el-option label="判断题" :value="'判断'"></el-option>
				</el-select>
				<el-select v-model="searchLabel" placeholder="搜索类型" style="flex: 4;">
				  <el-option label="根据学科搜索" :value="'subject'"></el-option>
				  <el-option label="根据题干搜索" :value="'content'"></el-option>
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
			<el-table-column align="center" prop="question_type" label="类型" width="80"></el-table-column>
			<el-table-column align="center" prop="subject" label="学科" width="120"></el-table-column>
			<el-table-column align="center" prop="content" label="题干" width="300"></el-table-column>
			<el-table-column align="center" prop="selection" label="选项" width="300">
				<template slot-scope="scope"><div v-for="(item,index) in scope.row.selection" :key="index">{{'ABCDEFGH'[index]+'、'}}{{item}}</div></template>
			</el-table-column>
			<el-table-column align="center" prop="answer" label="答案" width="100"></el-table-column>
			<el-table-column align="center" prop="point" label="分值" width="120"></el-table-column>

			<el-table-column
			 align="center"
			      fixed="right"
			      label="操作"
			      width="200">
			      <template slot-scope="scope">
			        <el-button @click="handleClickEdit(scope.row)" type="primary">编辑</el-button>
			        <el-button @click="handleClickDelete(scope.row)" type="danger">删除</el-button>
			      </template>
			    </el-table-column>
				<question-edit-form @onSubmit="loadQuestions()" ref="edit"></question-edit-form> 
		</el-table>
		<div class="pageButtonArea">
			<div class="buttons">
				<el-button @click="handleClickAdd()">添加新题</el-button>
				<el-button @click="handleClickAuto()">自动添加</el-button>
				<question-add-auto @onSubmit="loadQuestions()" ref='autoAdd'></question-add-auto>
			</div>
			<div style="margin-right: 300px; margin-top: 20px; flex: 6;">
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
	import QuestionEditForm from './QuestionEditForm'
	import QuestionAddAuto from './QuestionAddAuto'
	export default {
		name: "QuestionManage",
		components: {
			QuestionEditForm,
			QuestionAddAuto
		},
		data() {
			return {
				questions: [],
				showList: [],
				nowSelecting: [],
				currentPage: 1,
				pagesize: 20,
				searchLabel: "subject",
				searchType: "",
				searchInput: ""
			}
		},

		mounted: function() {
			this.loadQuestions()
			console.log(window.location.pathname)
		},
		methods: {
			loadQuestions() {
				var _this = this
				this.$axios.get('/questions').then(resp => {
					if (resp && resp.status === 200) {
						let temp = resp.data
						console.log(temp)
						let res = []
						for(let i = 0; i < temp.length; i++){
							let selection = temp[i].selection.split(" ")
							res.push({
								id: temp[i].id,
								question_type: temp[i].questionType,
								content: temp[i].content,
								subject: temp[i].subject,
								// selection: temp[i].selection,
								selection: selection,
								answer: temp[i].answer,
								point: temp[i].point,
							})
						}
						// console.log(res)
						_this.questions = res
						_this.showList = res
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
				this.showList = this.questions.filter((a)=>{
					if(!(a[this.searchLabel] && a['question_type'])){return false}
					return (a[this.searchLabel].indexOf(this.searchInput) != -1 && a['question_type'].indexOf(this.searchType) != -1)
					})
			},
			handleClickDelete(obj) {
				let id = obj.id
				this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios
						.post('/questionDelete', {
							id: id
						}).then(resp => {
							if (resp && resp.status === 200) {
								this.loadQuestions()
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
					question_type: obj.question_type,
					subject: obj.subject,
					content: obj.content,
					selection: obj.selection,
					answer: obj.answer,
					point: obj.point,
				}
			},
			handleClickAdd() {
				this.$refs.edit.dialogFormVisible = true
				this.$refs.edit.isEdit = false
				this.$refs.edit.form = {
					id: "" ,
					question_type: "",
					subject: "",
					content: "",
					selection: ["","","",""],
					answer: "",
					point: 5,
				}
			},
			handleClickAuto() {
				this.$refs.autoAdd.autoAddDialogFormVisible = true
			}
		}
	}
</script>
