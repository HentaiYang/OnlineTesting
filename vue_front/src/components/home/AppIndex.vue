<template>
	<div class="pageArea">
		<div class="funcArea">
			<span style="font-size: 28px; font-weight: bold;">欢迎使用HTY在线考试系统</span>
			<div class="searchArea">
				<el-select v-model="searchType" placeholder="试卷状态" style="flex: 3;" @change="search">
				  <el-option label="所有状态" :value="''"></el-option>
				  <el-option label="已开放的考试" :value="'允许考试'"></el-option>
				  <el-option label="未开始的考试" :value="'考试未开始'"></el-option>
				  <el-option label="已结束的考试" :value="'考试已结束'"></el-option>
				</el-select>
				<el-select v-model="searchLabel" placeholder="搜索类型" style="flex: 4;">
				  <el-option label="根据试卷类型搜索" :value="'paper_type'"></el-option>
				  <el-option label="根据标题搜索" :value="'title'"></el-option>
				</el-select>
				<el-input placeholder="输入" v-model="searchInput" autocomplete="off" style="flex: 5;" @input="search"></el-input>
			</div>
		</div>
		<el-table
		:data="showList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
		height=58vh
		border
		style="">
			<!-- <el-table-column
		      type="selection"
		      width="55"
			  style="border-color: black;">
		    </el-table-column> -->
			<el-table-column align="center" prop="paper_type" label="试卷类型" width="100"></el-table-column>
			<el-table-column align="center" prop="title" label="试卷标题" width="200"></el-table-column>
			<el-table-column align="center" prop="summary" label="试卷说明" width="300"></el-table-column>
			<el-table-column align="center" prop="startFormat" label="开始时间" width="100"></el-table-column>
			<el-table-column align="center" prop="endFormat" label="结束时间" width="100"></el-table-column>		
			<el-table-column align="center" prop="state" label="状态" width="100"></el-table-column>
			<el-table-column align="center" prop="duration" label="持续时间(分钟)" width="120"></el-table-column>
			<el-table-column align="center" prop="count" label="题目数量" width="120"></el-table-column>
			

			<el-table-column
			align="center"
			      fixed="right"
			      label="操作"
			      width="160">
			      <template slot-scope="scope">
					<el-button @click="handleClickStart(scope.row)" :disabled="scope.row.state != '允许考试'" type="primary">进入考试</el-button>
			      </template>
			    </el-table-column>
		</el-table>
		<div class="pageButtonArea">
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

<script>
	import store from '../../store'
	export default {
		name: 'AppIndex',
		data() {
		      return {
				papers: [],
				showList: [],
				nowSelecting: [],
				currentPage: 1,
				pagesize: 5,
				searchLabel: "paper_type",
				searchType: "",
				searchInput: ""
		      }
		},
		mounted(){
			this.loadPapers()
		},
		methods: {
			loadPapers() {
				var _this = this
				this.$axios.get('/papers').then(resp => {
					if (resp && resp.status === 200) {
						let now = new Date()
						let papers = []
						for(let i = 0; i < resp.data.length; i++){
							if(resp.data[i].state == "已开放"){
								let start_time = new Date(resp.data[i].start_time)
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
								papers.push(resp.data[i])
							}
						}
						papers.sort((a,b)=>{ return parseInt(b.id) - parseInt(a.id) })
						_this.papers = papers
						_this.showList = papers
					}
				})
			},
			search(){
				// console.log(this.searchLabel)
				// console.log(this.searchInput)
				this.showList = this.papers.filter((a)=>{
					if(!(a[this.searchLabel] && a['state'])){return false}
					return (a[this.searchLabel].indexOf(this.searchInput) != -1 && a['state'].indexOf(this.searchType) != -1)
					})
			},
			handleClickStart(paper){
				var _this = this
				_this.$axios.get('/practices?userId=' + store.state.user.id+'&paperId=' + paper.id).then(resp => {
					if (resp && resp.status === 200) {
						console.log(resp)
						if(resp.data){
							// console.log("存在记录")
							if(resp.data.is_done != 0){
								_this.$message({
									message: "你已经答过题了！",
									type: "error"
								})
								return
							}
						}
						_this.$router.push({
							name: 'TestPage',
							query: {
								paperId: paper.id
							}
						})
						
					} else {
						console.log('错误信息：', resp)
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
			
		}
	}
</script>

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
	.emptyFuncArea{
		width: 100%;
		background-color: #fff;
		margin-bottom: 50px;
		text-align: left;
	}
	
	
	.pageButtonArea{
		width: 100%;
		height: 7vh;
		background-color: #fff;
		text-align: right;
	}
	
	.searchArea{
		width: 45%;
		margin-left: 55%;
		display: flex;
		text-align: right;
	}

</style>
