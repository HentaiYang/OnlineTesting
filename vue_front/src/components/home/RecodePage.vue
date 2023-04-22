<template>
	<div class="pageArea">
		<div class="funcArea">
			<span style="font-size: 28px; font-weight: bold;">欢迎使用HTY在线考试系统</span>
			<div class="searchArea">
				<el-select v-model="searchType" placeholder="试卷状态" style="flex: 3;" @change="search">
				  <el-option label="所有状态" :value="''"></el-option>
				  <el-option label="已提交" :value="'1'"></el-option>
				  <el-option label="未提交" :value="'0'"></el-option>
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
			<el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
			<el-table-column align="center" prop="paper_type" label="试卷类型" width="100"></el-table-column>
			<el-table-column align="center" prop="title" label="试卷标题" width="160"></el-table-column>
			<el-table-column align="center" prop="question_count" label="题目数量" width="100"></el-table-column>
			<el-table-column align="center" prop="count" label="答对题数" width="100"></el-table-column>
			<el-table-column align="center" prop="score" label="分数" width="100"></el-table-column>
			<el-table-column align="center" prop="startFormat" label="开始时间" width="100"></el-table-column>
			<el-table-column align="center" prop="endFormat" label="结束时间" width="100"></el-table-column>
			<el-table-column align="center" prop="spend_time" label="用时" width="100"></el-table-column>
			<el-table-column align="center" prop="duration" label="考试时长(分钟)" width="80"></el-table-column>
			<el-table-column align="center" label="状态" width="100">
				<template slot-scope="scope">
					<span>{{['未提交','已提交'][scope.row.is_done]}}</span>
				</template>
			</el-table-column>
			

			<el-table-column
			align="center"
			      fixed="right"
			      label="操作"
			      width="160">
			      <template slot-scope="scope">
					<el-button @click="handleClickStart(scope.row)" :disabled="scope.row.is_done != 0" type="primary">
						{{['回到考试','考试结束'][scope.row.is_done]}}
					</el-button>
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
		name: 'RecodePage',
		data() {
		      return {
				practices: [],
				showList: [],
				nowSelecting: [],
				searchLabel: "paper_type",
				searchType: "",
				searchInput: "",
				currentPage: 1,
				pagesize: 5
		      }
		},
		mounted(){
			this.loadPractice()
		},
		methods: {
			setPaperById(id,index) {
				var _this = this
				this.$axios.get('/paper?id=' + id).then(resp => {
					if (resp && resp.status === 200) {
						console.log(resp)
						_this.practices[index].title = resp.data.title
						_this.practices[index].question_count = resp.data.count
						_this.practices[index].paper_type = resp.data.paper_type
						_this.practices[index].paperId = resp.data.id
						_this.practices[index].duration = resp.data.duration
						//用于刷新页面时防止这一步的页面数据没有加载（因为是动态创建的值
						_this.practices[index].count++
						_this.practices[index].count--
						
						if(index == _this.practices.length-1){
							_this.showList = _this.practices
						}
						
					} else {
						console.log('错误信息：', resp)
					}
				})
			},
			setTime(index){
				let start_time = new Date(this.practices[index].start_time)
				let end_time = new Date(this.practices[index].end_time)
				let dif = end_time - start_time
				let hour = Math.floor(dif / 1000 / 3600)
				let minute = Math.floor(dif / 1000 / 60 % 60)
				let second = dif % 60
				
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
				
				this.practices[index].spend_time = (hour<10?'0'+hour:''+hour)+':'+(minute<10?'0'+minute:''+minute)+':'+(second<10?'0'+second:''+second)
				this.practices[index].startFormat = startFormat
				this.practices[index].endFormat = endFormat
			},
			setTimeNotDone(index){
				let start_time = new Date(this.practices[index].start_time)
				let startFormat = start_time.getFullYear()+"-"
				+((start_time.getMonth()+1)<10?'0'+(start_time.getMonth()+1):(start_time.getMonth()+1))+"-"
				+(start_time.getDate()<10?'0'+start_time.getDate():start_time.getDate())+' '
				+(start_time.getHours()<10?'0'+start_time.getHours():start_time.getHours())+":"
				+(start_time.getMinutes()<10?'0'+start_time.getMinutes():start_time.getMinutes())+":"
				+(start_time.getSeconds()<10?'0'+start_time.getSeconds():start_time.getSeconds())
				this.practices[index].startFormat = startFormat
			},
			handleClickStart(row){
				var _this = this
				// console.log(store.state.user.id)
				// console.log(row.paperId)
				_this.$axios.get('/practices?userId=' + store.state.user.id+'&paperId=' + row.paperId).then(resp => {
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
								paperId: row.paperId
							}
						})
						
					} else {
						console.log('错误信息：', resp)
					}
				})
				
			},
			loadPractice() {
				var _this = this
				this.$axios.get('/practiceUserId?userId='+store.state.user.id).then(resp => {
					if (resp && resp.status === 200) {
						console.log(resp.data)
						resp.data.sort((a,b)=>{ return parseInt(b.id) - parseInt(a.id) })
						_this.practices = resp.data
						for(let i = 0; i < resp.data.length; i++){
							
							if(resp.data[i].is_done != 0){
								_this.setTime(i)
							} else {
								_this.setTimeNotDone(i)
							}
							_this.setPaperById(resp.data[i].paperId, i)
						}
					}
				})
			},
			search(){
				// console.log(this.searchLabel)
				// console.log(this.searchInput)
				this.showList = this.practices.filter((a)=>{
					if(!(a[this.searchLabel] && a['is_done'])){return false}
					return (a[this.searchLabel].indexOf(this.searchInput) != -1 && (this.searchType == "" || a['is_done'] == this.searchType))
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
	}
	
	.searchArea{
		width: 45%;
		margin-left: 55%;
		display: flex;
		text-align: right;
	}

</style>
