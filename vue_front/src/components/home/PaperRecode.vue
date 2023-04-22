<template>
  <div>
    <el-dialog
      title="考试结果"
      :visible.sync="dialogFormVisible"
      @close="clear"
	  :append-to-body="true"
	  style="margin-top: -60px;">
      <el-form v-model="recodes" style="text-align: left" ref="dataForm">
				<el-form-item label="试卷信息" :label-width="formLabelWidth">
					<div class="examInfo">
						<span>&nbsp&nbsp&nbsp&nbsp试卷类型：{{paper.paper_type}}</span>
						<span>&nbsp&nbsp&nbsp&nbsp试卷标题：{{paper.title}}</span>
						<span>&nbsp&nbsp&nbsp&nbsp考试时长：{{paper.duration}}分钟</span>
						<span>&nbsp&nbsp&nbsp&nbsp考试状态：{{paper.isEnd}}</span>
					</div>
				</el-form-item>
			<el-form-item label="考试人数" :label-width="formLabelWidth">
				<div class="examInfo">
					<span>&nbsp&nbsp&nbsp&nbsp答题人数：{{recodes.length}}人</span>
					<span>&nbsp&nbsp&nbsp&nbsp答题完成人数：{{doneCount}}人</span>
					<span>&nbsp&nbsp&nbsp&nbsp平均分数：{{avgScore}}分</span>
				</div>
			</el-form-item>
			<el-form-item label="考试信息" :label-width="formLabelWidth">
				<div class="examInfo">
					<div class="oneInfo" v-for="(item,index) in recodes" :key="'0000'+index" :index="index">
						<span>&nbsp&nbsp&nbsp&nbsp考生{{index+1}}:</span>
						<span>&nbsp&nbsp&nbsp&nbsp用户名：{{item.user.username}}</span>
						<span>&nbsp&nbsp&nbsp&nbsp学号：{{item.user.studentid}}</span>
						<span>&nbsp&nbsp&nbsp&nbsp答对题数：{{item.count}}</span>
						<span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp最终得分：{{item.score}}</span>
					</div>
				</div>
			</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">返 回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'PaperRecode',
    data () {
      return {
        dialogFormVisible: false,
        paper: {},
		avgScore: 0,
		doneCount: 0,
		recodes: [],
        formLabelWidth: '120px',
      }
    },
	mounted() {
		
	},
    methods: {
      clear () {
        this.paper = {}
		this.recodes = []
      },
	  loadRecode(){
		  // console.log("函数被调用了")
		  // console.log(this.paper)
		  var _this = this
		  this.$axios
		    .get('/practicePaperId?paperId=' + _this.paper.id).then(resp => {
		    if (resp && resp.status === 200) {
		        // console.log(resp.data)
				_this.recodes = resp.data
				let allScore = 0
				for(let i = 0; i < resp.data.length; i++){
					allScore += parseInt(resp.data[i].score)
					if(_this.recodes[i].is_done != 0){
						_this.doneCount++
					}
					_this.recodes[i].user = {}
					_this.loadUser(i)
				}
				_this.avgScore = allScore / resp.data.length
		    }
		  })
	  },
	  loadUser(index){
		  var _this = this
		  this.$axios
		    .get('/userId?id=' + _this.recodes[index].userId).then(resp => {
		    if (resp && resp.status === 200) {
		        // console.log(resp.data)
		  		_this.recodes[index].user = resp.data
				// console.log(_this.recodes)
					_this.recodes[index].score++
					_this.recodes[index].score--
		    }
		  })
	  },
      onSubmit () {
		  // console.log(this.form)
		  let form = this.form
		  var r = /^\+?[1-9][0-9]*$/;
		  if(form.id == null){
			  console.log("未传入题目id")
			  return
		  }
		  var _this=this
		  if(!r.test(form.duration)){
						  _this.$message({
			  				message: "考试时间应为数字！", 
							type: 'error', 
							center: true})
			  				return
		  }
		  if(form.duration == 0){
			  _this.$message({
			  	message: "考试时间不能为0！", 
			  	type: 'error', 
			  	center: true})
			  	return
		  }
		  if(form.duration > 6000){
		  			  _this.$message({
		  			  	message: "考试时间过长！", 
		  			  	type: 'error', 
		  			  	center: true})
		  			  	return
		  }
		  if(form.title == ""){
		  			  _this.$message({
		  			  	message: "试卷标题不能为空！", 
		  			  	type: 'error', 
		  			  	center: true})
		  			  	return
		  }
		  if(this.timeValue == null || this.timeValue.length == 0){
			  _this.$message({
			  	message: "请设定考试开放时间！", 
			  	type: 'error', 
			  	center: true})
			  	return
		  }
		  //到这里基本就是合法的数据了
		  let paper = {
			  id: form.id,
			  paper_type: form.paper_type,
			  duration: form.duration,
			  title: form.title,
			  summary: form.summary,
			  count: form.count,
			  single_count: form.single_count,
			  multi_count: form.multi_count,
			  judge_count: form.judge_count,
			  state: "已开放",
			  start_time: this.timeValue[0],
			  end_time: this.timeValue[1],
			  create_time: form.create_time
		  }
		  
		  console.log(paper)
		  
		  var _this = this
		  this.$axios
		    .post('/papers', paper).then(resp => {
		    if (resp && resp.status === 200) {
		            this.dialogFormVisible = false
		        	this.$message({
		        		type: 'info',
		        		message: '考试已开放！'
		        	})
		            this.$emit('onSubmit')
		    }
		  })
		  
		  // this.$axios
		  //   .get('/paperQuestions?id=' + paper.id).then(resp => {
		  //   if (resp && resp.status === 200) {
		  //           console.log(resp.data)
		  //   }
		  // })
        
      }
    }
  }
</script>

<style scoped>
	.examInfo{
		display: flex; 
		flex-direction: column; 
		border: 1px solid #e7e7e7;
		border-radius: 5px;
		box-shadow: 0 0 2px 1px #e7e7e7;
	}
</style>


