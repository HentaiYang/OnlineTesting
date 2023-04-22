<template>
	<div class="testPage">
		<div class="title">
			<div class="title_left" >
				<span>{{paper.title}}</span>
				
			</div>
			<div class="title_right">
				<span v-if="isUpdate && isSubmit">考试已结束</span>
				<span v-else>距离考试结束还有：{{showHours}}:{{showMinutes}}:{{showSeconds}}</span>
				<div class="title_submit">
					<el-button :disabled="isUpdate" class="submitButton" type="primary" @click="submitCheck()">交卷</el-button>
				</div>
			</div>
			
		</div>
		<div class="line"></div>
		<div class="typeModule">
			<div class="secondTitle">
				<span>单选题</span>
			</div>
				<div class="question" v-for="(item,index) in singles" :key="index">
					<div class="content">
						{{index+1+"、"}}{{item.content}}<span style="color: #989898;">{{'('+item.point+'分)'}}</span>
					</div>
					<div class="content">
						<span v-if="isUpdate && isSubmit" style="color: black;">{{'答案：'+item.answer}}</span>
						<span v-if="isUpdate && isSubmit" :style="'color:'+['red','green'][judgeColorChange[index]] +' ;'">
						{{'&nbsp&nbsp&nbsp你的选择：'+userSelection[index]}}
						</span>
					</div>
					<div class="selection" v-for="(item2,index2) in singles[index].selections" :key="'111'+index2">
						<el-radio :disabled="isUpdate && isSubmit" v-model="userSelection[index]" :label="'ABCDEFGH'[index2]" border>
							{{"ABCDEFGH"[index2]+"、"}}{{item2}}</el-radio>
					</div>
				</div>
		</div>
		
		<div class="line"></div>
		<div class="typeModule">
			<div class="secondTitle">
				<span>多选题</span>
			</div>
			<div class="question" v-for="(item,index) in multis" :key="singles.length + index">
				<div class="content">
					{{singles.length + index+1+"、"}}{{item.content}}<span style="color: #989898;">{{'('+item.point+'分)'}}</span>
				</div>
				<div class="content">
					<span v-if="isUpdate && isSubmit" style="color: black;">{{'答案：'+item.answer}}</span>
					<span v-if="isUpdate && isSubmit" :style="'color:'+['red','green'][judgeColorChange[singles.length + index]] +' ;'">
					{{'&nbsp&nbsp&nbsp你的选择：'+userSelection[singles.length + index]}}
					</span>
				</div>
				<el-checkbox-group v-model="userSelection[singles.length + index]">
					<div class="selection" v-for="(item2,index2) in multis[index].selections" :key="'222'+index2">
						<el-checkbox :disabled="isUpdate && isSubmit" :label="'ABCDEFGH'[index2]" border>{{"ABCDEFGH"[index2]+"、"}}{{item2}}
						</el-checkbox>
					</div>
				</el-checkbox-group>

			</div>

		</div>
		
		<div class="line"></div>
		<div class="typeModule">
			<div class="secondTitle">
				<span>判断题</span>
			</div>
			<div class="question" v-for="(item,index) in judges" :key="singles.length + multis.length + index">
				<div class="content">
					{{singles.length + multis.length + index+1+"、"}}{{item.content}}<span style="color: #989898;">{{'('+item.point+'分)'}}</span>
				</div>
				<div class="content">
					<span v-if="isUpdate && isSubmit" style="color: black;">{{'答案：'+item.answer}}</span>
					<span v-if="isUpdate && isSubmit" :style="'color:'+['red','green'][judgeColorChange[singles.length + multis.length + index]] +' ;'">
					{{'&nbsp&nbsp&nbsp你的选择：'+userSelection[singles.length + multis.length + index]}}
					</span>
				</div>
				<div class="selection" v-for="(item2,index2) in judges[index].selections" :key="'333'+index2">
					<el-radio :disabled="isUpdate && isSubmit" v-model="userSelection[singles.length + multis.length + index]"
						:label="'ABCDEFGH'[index2]" border>{{"ABCDEFGH"[index2]+"、"}}{{item2}}</el-radio>
				</div>
			</div>
		</div>
		<el-button :disabled="isUpdate"  class="submitButton" type="primary" @click="submitCheck()">交卷</el-button>
	</div>
</template>

<style>
	.line{
		height: 2px;
		background-color: #e7e7e7;
	}
	.testPage {
		width: 90%;
		margin-top: 40px;
		margin-left: 5%;
		text-align: left;
		border: 2px solid #d9d9d9;
		box-shadow: 1px 1px 8px 3px #d9d9d9;
		border-radius: 5px;
	}
	.title{
		width: 100%;
		font-size: 40px;
		font-weight: bold;
		padding: 20px 0;
		display: flex;
		/* border: 2px solid #d9d9d9; */
	}
	.title_left{
		width: 60%;
		margin-left: 20px;
		margin-top: 16px;
	}
	.title_right{
		width: 40%; 
		font-size: 20px; 
		margin-top: 10px;
		margin-right: 20px;
		display: flex; 
		flex-direction: column; 
		text-align: right;
	}
	.title_submit{
		margin-top: 10px;
	}
	.submitButton{
		padding: 12px 40px;
		font-size: 20px; 
		font-weight: bold;
	}
	
	.typeModule{
		width: 90%;
		margin-top: 30px;
		margin-left: 5%;
		/* border: 1px solid black; */
	}
	.secondTitle{
		font-size: 30px;
		font-weight: bold;
		margin-bottom: 16px;
		/* border: 1px solid black; */
	}
	
	.question{
		width: 90%;
		padding: 20px 60px;
		margin-left: 0;
		margin-bottom: 30px;
		border: 1px solid #e3e3e3;
		border-radius: 4px;
		box-shadow: 0 0 6px 2px #e3e3e3;
	}
	.content{
		font-size: 20px;
	}
	.selection{
		margin-left: 20px;
		margin-top: 15px;
		font-size: 16px;
	}

</style>


<script>
	import store from '../../store'
	export default {
		name: 'TestPage',
		data() {
			return {
				paperId: this.$route.query.paperId,
				userId: store.state.user.id,
				paper: {},
				questions: [],
				singles: [],
				multis: [],
				judges: [],
				userSelection: [],
				judgeColorChange: [],
				sel: [],
				timeRemaining: 0,
				showHours: "",
				showMinutes: "",
				showSeconds: "",
				isUpdate: false,
				isSubmit: false, //用于确定是否是点击按钮的更新
				practice:{
					id: null,
					userId: 0,
					paperId: 0,
					start_time: "",
					is_done: 0,
					user_answer: "",
					score: 0,
					count: 0
				}
			}
		},
		mounted() {
			window.addEventListener('beforeunload', this.updatePractice)
			this.getQuestionsByPaperId()
			this.getPaperById()
		},
		//钩子函数 防止用户意外退出页面
		beforeDestroy(){
			this.updatePractice()
		},
		methods: {
			getPaperById() {
				var _this = this
				this.$axios.get('/paper?id=' + this.paperId).then(resp => {
					if (resp && resp.status === 200) {
						// console.log(resp)
						if(resp.data.state == '未开放'){
							_this.$message({
								message: "试卷未开放！",
								type: "error"
							})
							_this.goBack()
							return
						}
						let now = new Date()
						let start = new Date(resp.data.start_time)
						let end = new Date(resp.data.end_time)
						if(now >= end || now < start){
							_this.$message({
								message: "不在考试开放时间内！",
								type: "error"
							})
							_this.goBack()
							return
						}
						_this.paper = resp.data
					} else {
						console.log('错误信息：', resp)
					}
				})
			},

			getQuestionsByPaperId() {
				var _this = this
				this.$axios.get('/paperQuestions?id=' + this.paperId).then(resp => {
					if (resp && resp.status === 200) {
						// console.log(resp.data)
						let singles = []
						let multis = []
						let judges = []
						for (let i = 0; i < resp.data.length; i++) {
							let selections = resp.data[i].selection.split(" ")
							resp.data[i].selections = selections
							if (resp.data[i].questionType == "单选") {
								singles.push(resp.data[i])
							} else if (resp.data[i].questionType == "多选") {
								multis.push(resp.data[i])
							} else {
								judges.push(resp.data[i])
							}
						}
						_this.singles = singles
						_this.singles.sort((a,b)=>{ return a.id > b.id })
						_this.multis = multis
						_this.multis.sort((a,b)=>{ return a.id > b.id })
						_this.judges = judges
						_this.judges.sort((a,b)=>{ return a.id > b.id })

						_this.questions = [...singles, ...multis, ...judges]
						_this.setSelection()
						_this.checkPractice()
						// console.log(_this.questions)
						// console.log(singles)
						// console.log(multis)
						// console.log(judges)
					} else {
						console.log('错误信息：', resp)
					}
				})
			},
			setSelection() {
				for (let i = 0; i < this.questions.length; i++) {
					if (this.questions[i].questionType == "多选") {
						this.userSelection.push([])
					} else {
						this.userSelection.push("")
					}
					this.judgeColorChange.push(0)
				}
				// console.log(this.userSelection)
			},
			setSelectionByPractice(){
				let oldAnswers = this.practice.user_answer.split(" ")
				// console.log(oldAnswers)
				for(let i = 0; i < this.userSelection.length; i++){
					if(oldAnswers[i] != '0'){
						if(this.questions[i].questionType == "多选"){
							let answer = []
							for(let j = 0; j < oldAnswers[i].length; j++){
								answer.push(oldAnswers[i][j])
							}
							this.userSelection[i] = answer
						} else {
							this.userSelection[i] = oldAnswers[i]
						}
					}
				}
			},
			checkPractice(){
				var _this = this
				this.$axios.get('/practices?userId=' + this.userId+'&paperId=' + this.paperId).then(resp => {
					if (resp && resp.status === 200) {
						console.log(resp)
						if(!resp.data){
							// console.log("不存在记录")
							// console.log(_this.userId,_this.paperId)
							let practice = {
								userId: _this.userId,
								paperId: _this.paperId,
								start_time: new Date(),
								is_done: 0
							}
							// console.log(practice)
							_this.$axios.post('practices', practice).then(resp2 => {
								if (resp2 && resp2.status === 200) {
									// console.log(resp2)
									_this.practice = resp2.data
									_this.setExamTime()
								}
							})
						} else {
							// console.log("存在记录")
							// console.log(resp)
							_this.practice = resp.data
							if(_this.practice.is_done != 0){
								_this.$message({
									message: "您已经答过题了",
									type: "error"
								})
								_this.goBack()
								return
							}
							_this.setExamTime()
							_this.setSelectionByPractice()
						}
						//获取测试信息后再设置结束时间
						
					} else {
						console.log('错误信息：', resp)
					}
				})
			},
			setExamTime() {
				// 考试总时间的秒数
				var _this = this
				let start_time = new Date(this.practice.start_time)
				let now_time = new Date()
				// console.log(start_time)
				// console.log(now_time)
				let dif = Math.floor(((now_time - start_time) / 1000))
				// console.log("时间差：", dif)
				this.timeRemaining = parseInt(this.paper.duration) * 60 - dif
				if(this.timeRemaining <= 0){
					if(!_this.isSubmit){
						_this.submitCheck()
						return
					}
				}
				// this.timeRemaining = 5
				// console.log(this.paper)
				
				let interval = setInterval(function() {
					// _this.answerFormat()
					_this.timeRemaining--
					let time = _this.timeRemaining
					let hour = Math.floor(time / 3600)
					let minute = Math.floor(time / 60)
					let second = time % 60
					_this.showHours = hour < 10 ? '0'+hour : ''+hour
					_this.showMinutes = minute < 10 ? '0'+minute : ''+minute
					_this.showSeconds = second < 10 ? '0'+second : ''+second
					if (_this.timeRemaining <= 0) {
						console.log("考试时间结束")
						clearInterval(interval)
						_this.timeRemaining = 0
						// console.log("时间到了2")
						if(!_this.isSubmit){
							_this.submitCheck()
						}
					}
				}, 1000);

			},
			answerFormat(){
				//用于格式化用户答案
				let answers = this.userSelection
				let answerFormat = ""
				let answerResult = []
				let count = 0
				for (let i = 0; i < this.questions.length; i++) {
					if (this.questions[i].questionType == "多选") {
						if(answers[i].length != 0){
							let mul = ""
							//因为多选可能是乱的，所以要进行排序
							answers[i].sort()
							// console.log(answers[i])
							// console.log(this.userSelection[i])
							for(let j = 0; j < answers[i].length; j++){
								mul += answers[i][j]
							}
							answerFormat += mul+' '
							answerResult.push(mul)
						} else {
							count++
							answerFormat += '0 '
							answerResult.push("")
						}
					} else {
						if(answers[i] != ""){
							answerFormat += answers[i] + ' '
						} else {
							count++
							answerFormat += '0 '
						}
						answerResult.push(answers[i])
					}
				}
				console.log(answerFormat)
				return {
					answerFormat: answerFormat,
					answerResult: answerResult,
					count: count
					}
			},
			submitCheck() {
				var _this = this
				this.isSubmit = true
				if(this.timeRemaining <= 0){
					// console.log("考试时间到了，考试结束")
					_this.$message({
						message: "考试时间已到, 将自动交卷",
						type: "warning"
					})
					_this.onsubmit()
					// console.log("确定之后的内容是异步执行吗") //是
				} else {
					let count = _this.answerFormat().count
					_this.$confirm('考试时间还未结束，您还有'+count+'道未做，确定要交卷吗？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						_this.onsubmit()
					}).catch(() => {
						this.isSubmit = false
						return
					})
				}
				
			},
			onsubmit(){
				this.judge()
				this.updatePractice()
				// this.goBack()
			},
			judge(){
				//考试结果确认
				let answers = this.answerFormat().answerResult
				let questions = this.questions
				console.log(answers)
				let count = 0
				let score = 0
				let fullScore = 0
				for(let i = 0; i < questions.length; i++){
					if(answers[i] === questions[i].answer){
						count++
						score += questions[i].point
						this.judgeColorChange[i] = 1
					}
					fullScore += questions[i].point
				}
				console.log(count+'/'+questions.length)
				console.log(score+'/'+fullScore)
				this.practice.count = count
				console.log(this.practice.count)
				this.practice.score = score
			},
			updatePractice(){
				if(this.isUpdate == true){
					return
				}
				this.isUpdate = true
				let answers = this.answerFormat().answerFormat
				//用于切出其他页面时保存答题信息
				if(this.isSubmit){
					//只有正常点击提交才把标志位设为已完成
					this.practice.is_done = 1
					this.practice.end_time = new Date()
				}
				this.practice.user_answer = answers
				var _this = this
				this.$axios.post('practices', this.practice).then(resp => {
					console.log(resp)
					if (resp && resp.status === 200) {
						// console.log(resp)
						if(!_this.isSubmit){
							console.log("未点击交卷或未超时，非正常提交")
							_this.isSubmit = true //避免退出后还弹出倒计时结束窗口
							return
						}
						_this.$confirm('考试结果已上传，正确'+_this.practice.count+'道，错误'+(_this.questions.length-_this.practice.count)
						+'道，得分：'+_this.practice.score+'分', '提示', {
							confirmButtonText: '查看结果',
							cancelButtonText: '退出答题',
							type: 'warning'
						}).then(() => {
							return
						}).catch(() => {
							_this.goBack()
							return
						})
					}
				})
			},
			goBack(){
				this.isSubmit = true
				if (window.history.length <= 1) {
				    this.$router.push({path:'/index'})
				    return false
				} else {
				    this.$router.go(-1)
				}
			}
		}
	}
</script>
