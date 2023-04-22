<template>
	<div class="pageArea">
		<div class="funcArea">
			<span style="font-size: 24px; font-weight: bold;">数据无价，谨慎操作</span>
			<div class="searchArea">
				<el-select v-model="searchLabel" placeholder="搜索类型" style="flex: 4;">
				  <el-option label="根据学科搜索" :value="'paper_type'"></el-option>
				  <el-option label="根据标题搜索" :value="'title'"></el-option>
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
			<el-table-column align="center" prop="paper_type" label="试卷类型" width="100"></el-table-column>
			<el-table-column align="center" prop="title" label="试卷标题" width="220"></el-table-column>
			<el-table-column align="center" prop="duration" label="时长(分钟)" width="100"></el-table-column>			
			<el-table-column align="center" prop="count" label="题目数量" width="80"></el-table-column>	
					<el-table-column align="center" prop="state" label="状态" width="100"></el-table-column>
			<el-table-column align="center" prop="startFormat" label="开始时间" width="100"></el-table-column>			
			<el-table-column align="center" prop="endFormat" label="结束时间" width="100"></el-table-column>			
			<el-table-column align="center" prop="summary" label="试卷说明" width="300"></el-table-column>
			

			<el-table-column
			 align="center"
			      fixed="right"
			      label="操作"
			      width="340">
			      <template slot-scope="scope">
					<el-button @click="handleClickStart(scope.row)" type="success" size="small">{{scope.row.state == '未开放' ? '开放考试' : '停止开放'}}</el-button>
			        <el-button @click="handleClickRecode(scope.row)" type="info" size="small">考试结果</el-button>
			        <el-button @click="handleClickEdit(scope.row)" type="primary" size="small">编辑</el-button>
			        <el-button @click="handleClickDelete(scope.row)" type="danger" size="small">删除</el-button>
			      </template>
			    </el-table-column>
				<paper-add-form @onSubmit="loadPapers()" ref="add"></paper-add-form> 
				<paper-edit-form @onSubmit="loadPapers()" ref="edit"></paper-edit-form>
				<paper-start-form @onSubmit="loadPapers()" ref="start"></paper-start-form>
				<paper-recode ref="recode"></paper-recode>
		</el-table>
		<div class="pageButtonArea">
			<div class="buttons">
				<el-button @click="handleClickAdd()">添加试卷</el-button>
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
	import PaperAddForm from './PaperAddForm'
	import PaperEditForm from './PaperEditForm'
	import PaperStartForm from './PaperStartForm'
	import PaperRecode from './PaperRecode'
	export default {
		name: "PaperManage",
		components: {
			PaperAddForm,
			PaperEditForm,
			PaperStartForm,
			PaperRecode
		},
		data() {
			return {
				papers: [],
				showList: [],
				nowSelecting: [],
				currentPage: 1,
				pagesize: 10,
				searchLabel: "paper_type",
				searchInput: ""
			}
		},

		mounted: function() {
			this.loadPapers()
			console.log(window.location.pathname)
		},
		methods: {
			loadPapers() {
				var _this = this
				this.$axios.get('/papers').then(resp => {
					if (resp && resp.status === 200) {
						for(let i = 0; i < resp.data.length; i++){
							if(resp.data[i].state == "已开放"){
								let start_time = new Date(resp.data[i].start_time)
								let now = new Date()
								let end_time = new Date(resp.data[i].end_time)
								
								if(now < start_time){
									resp.data[i].state = "考试未开始"
								} else if(now < end_time){
									resp.data[i].state = "允许考试"
								} else {
									resp.data[i].state = "考试已结束"
								}
								let startFormat = start_time.getFullYear()+"-"
								+((start_time.getMonth()+1)<10?'0'+(start_time.getMonth()+1):(start_time.getMonth()+1))+"-"
								+(start_time.getDate()<10?'0'+start_time.getDate():start_time.getDate())+' '
								+(start_time.getHours()<10?'0'+start_time.getHours():start_time.getHours())+":"
								+(start_time.getMinutes()<10?'0'+start_time.getMinutes():start_time.getMinutes())+":"
								+(start_time.getSeconds()<10?'0'+start_time.getSeconds():start_time.getSeconds())
								
								let endFormat = end_time.getFullYear()+"-"
								+((end_time.getMonth()+1)<10?'0'+(end_time.getMonth()+1):(end_time.getMonth()+1))+"-"
								+(end_time.getDate()<10?'0'+end_time.getDate():end_time.getDate())+' '
								+(end_time.getHours()<10?'0'+end_time.getHours():end_time.getHours())+":"
								+(end_time.getMinutes()<10?'0'+end_time.getMinutes():end_time.getMinutes())+":"
								+(end_time.getSeconds()<10?'0'+end_time.getSeconds():end_time.getSeconds())
								resp.data[i].startFormat = startFormat
								resp.data[i].endFormat = endFormat
							}
						}
						resp.data.sort((a,b)=>{return parseInt(b.id) - parseInt(a.id)})
						_this.papers = resp.data
						_this.showList = resp.data
						// console.log(_this.papers)
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
				this.showList = this.papers.filter((a)=>{
					if(!a[this.searchLabel]){return false}
					return a[this.searchLabel].indexOf(this.searchInput) != -1
					})
			},
			handleClickStart(obj) {
				if(obj.state == '未开放'){
					this.$refs.start.dialogFormVisible = true
					this.$refs.start.form = {
						id: obj.id,
						duration: obj.duration, 
						title: obj.title,
						paper_type: obj.paper_type,
						summary: obj.summary,
						count: obj.count,
						single_count: obj.single_count,
						multi_count: obj.multi_count,
						judge_count: obj.judge_count,
						state: obj.state,
						start_time: obj.start_time,
						end_time: obj.end_time,
						create_time: obj.create_time
					}
				} else {
					this.$confirm('确定停止开放考试吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						obj.state = '未开放'
						this.$axios
							.post('/papers', obj).then(resp => {
								if (resp && resp.status === 200) {
									this.loadPapers()
								}
							})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						})
					})
				}
				
			},
			handleClickDelete(obj) {
				let id = obj.id
				this.$confirm('此操作将永久删除该试卷, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios
						.post('/paperDelete', {
							id: id
						}).then(resp => {
							if (resp && resp.status === 200) {
								this.loadPapers()
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
				this.$refs.edit.form = {
					id: obj.id,
					duration: obj.duration, 
					title: obj.title,
					paper_type: obj.paper_type,
					summary: obj.summary,
					count: obj.count,
					single_count: obj.single_count,
					multi_count: obj.multi_count,
					judge_count: obj.judge_count,
					state: obj.state,
					start_time: obj.start_time,
					end_time: obj.end_time,
					create_time: obj.create_time
				}
				
			},
			handleClickAdd() {
				this.$refs.add.dialogFormVisible = true
				
			},
			handleClickRecode(paper){
				this.$refs.recode.dialogFormVisible = true
				this.$refs.recode.paper = paper
				let now = new Date()
				let end = new Date(paper.end_time)
				let start = new Date(paper.start_time)
				if(now >= end){
					this.$refs.recode.paper.isEnd = '已结束'
				} else if(now < start) {
					this.$refs.recode.paper.isEnd = '未开始'
				} else {
					this.$refs.recode.paper.isEnd = '正在进行'
				}
				this.$refs.recode.loadRecode()
			}
		}
	}
</script>
