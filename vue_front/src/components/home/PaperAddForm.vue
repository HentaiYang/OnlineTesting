<template>
  <div>
    <el-dialog
      title="自动生成试卷"
      :visible.sync="dialogFormVisible"
      @close="clear"
	  :append-to-body="true"
	  style="margin-top: -5vh;">
      <el-form v-model="form" style="text-align: left" ref="dataForm">
		  <el-form-item label="试卷类型" :label-width="formLabelWidth" prop="paper_type">
		    <el-input placeholder="试卷类型" v-model="form.paper_type" autocomplete="off" @input="searchQuestionBySubject()"></el-input>
		  </el-form-item>
		  <el-form-item v-if="form.paper_type != ''" label="相同类型试题" :label-width="formLabelWidth">
			<span v-if="questionSearching">{{searchText}}</span>
			<span v-else>查找成功，题库内有单选题{{questions[0].length}}道，多选题{{questions[1].length}}道，判断题{{questions[2].length}}道</span>
		  </el-form-item>
		  <el-form-item label="试卷标题" :label-width="formLabelWidth" prop="title">
		    <el-input placeholder="请输入试卷标题" v-model="form.title" autocomplete="off"></el-input>
		  </el-form-item>
        <el-form-item label="试卷说明" :label-width="formLabelWidth" prop="summary">
          <el-input type="textarea" placeholder="请输入试卷说明" v-model="form.summary" autocomplete="off"></el-input>
        </el-form-item>
		<el-form-item v-if="form.paper_type != ''" label="考试时长(分钟)" :label-width="formLabelWidth" prop="duration">
		  <el-input type="number" placeholder="考试持续时长(分钟)" v-model="form.duration" autocomplete="off"></el-input>
		</el-form-item>
		<el-form-item v-if="form.paper_type != ''" label="生成题目数" :label-width="formLabelWidth">
			<span>目前试卷题目总数：{{form.count}}道</span>
		</el-form-item>
		<el-form-item v-if="form.paper_type != ''" label="单选题数量" :label-width="formLabelWidth" prop="single_count">
		  <el-input type="number" placeholder="输入单选题数量" v-model="form.single_count" autocomplete="off" @input="changeCount()"></el-input>
		</el-form-item>
		<el-form-item v-if="form.paper_type != ''" label="多选题数量" :label-width="formLabelWidth" prop="multi_count">
		  <el-input type="number" placeholder="输入多选题数量" v-model="form.multi_count" autocomplete="off" @input="changeCount()"></el-input>
		</el-form-item>
		<el-form-item v-if="form.paper_type != ''" label="判断题数量" :label-width="formLabelWidth" prop="judge_count">
		  <el-input type="number" placeholder="输入判断题数量" v-model="form.judge_count" autocomplete="off" @input="changeCount()"></el-input>
		</el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">生 成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'PaperAddForm',
    data () {
      return {
        dialogFormVisible: false,
        form: {
          id: null,
          duration: 60, //这里是分钟
          title: "",
          count: 0,
		  single_count: 0,
		  multi_count: 0,
		  judge_count: 0,
          paper_type: "",
          summary: "",
        },
		searchText: "",
        formLabelWidth: '120px',
		questions: [],
		questionSearching: true
      }
    },
    methods: {
      clear () {
        this.form = {
          id: null,
          duration: 60,
          title: "",
          count: 0,
		  single_count: 0,
		  multi_count: 0,
		  judge_count: 0,
          paper_type: "",
          summary: "",
        }
      },
	  changeCount() {
		  this.form.count = 0
		  var r = /^\+?[1-9][0-9]*$/;　　//正整数
		  if(r.test(this.form.single_count)){
			  this.form.count += parseInt(this.form.single_count)
		  }
		  if(r.test(this.form.multi_count)){
		  			  this.form.count += parseInt(this.form.multi_count)
		  }
		  if(r.test(this.form.judge_count)){
		  			  this.form.count += parseInt(this.form.judge_count)
		  }
	  },
	  searchQuestionBySubject(){
		  let subject = this.form.paper_type
		  if(subject.length == 0){
			  return
		  }
		  this.questionSearching = true
		  this.searchText = "查找中..."
		  var _this = this
		  console.log(subject)
		  this.$axios.get('/questionsBySubject?subject=' + subject).then(resp => {
		  	if (resp && resp.status === 200) {
				if(resp.data[0].length == 0 && resp.data[1].length == 0 && resp.data[2].length == 0){
					_this.searchText = "题库中没有该学科题目"
					_this.questions = []
					// console.log("到这了")
					return
				}
		  		_this.questions = resp.data
				_this.questionSearching = false
		  	} else {
				_this.searchText = "查找失败"
			}
			// console.log(resp)
		  })
	  },
      onSubmit () {
		  // console.log(this.form)
		  let form = this.form
		  var r = /^\+?[1-9][0-9]*$/;
		  if(!(r.test(form.single_count) && r.test(form.multi_count) && r.test(form.judge_count) && r.test(form.duration))){
						  _this.$message({
			  				message: "题目数量或考试时间应为数字！", 
							type: 'error', 
							center: true})
			  				return
		  }
		  if(form.single_count > this.questions[0].length){
			  _this.$message({ 
				message: "单选题数不能大于题库内单选题数量！", 
			  	type: 'error', 
			  	center: true})
				return
		  }
		  if(form.multi_count > this.questions[1].length){
		  			  _this.$message({ 
		  				message: "多选题数不能大于题库内多选题数量！", 
		  			  	type: 'error', 
		  			  	center: true})
		  				return
		  }
		  if(form.judge_count > this.questions[2].length){
		  			  _this.$message({ 
		  				message: "判断题数不能大于题库内判断题数量！", 
		  			  	type: 'error', 
		  			  	center: true})
		  				return
		  }
		  if(form.single_count+form.multi_count+form.judge_count <= 0){
		  			  _this.$message({ 
		  				message: "试卷题目数量不能为0！", 
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
		  //到这里基本就是合法的数据了
		  let paper = {
			  duration: form.duration,
			  title: form.title,
			  count: form.count,
			  single_count: form.single_count,
			  multi_count: form.multi_count,
			  judge_count: form.judge_count,
			  paper_type: form.paper_type,
			  summary: form.summary,
			  create_time: new Date(), //时间戳
			  state: '未开放'
		  }
		  //开始随机题目
		  //需要随机的题目数
		  let single = form.single_count
		  let multi = form.multi_count
		  let judge = form.judge_count
		  //现有的题目数
		  let ques_single = this.questions[0].length
		  let ques_multi = this.questions[1].length
		  let ques_judge = this.questions[2].length
		  //随机出之后用于保存题目id的数组
		  let addQuestions = []
		  //用于确定随机的上限，每次随机之后减一，把获取的题目放到数组尾部
		  let n = ques_single
		  for(let i = 0; i < single; i++){
			  let index = Math.floor((Math.random()*n))
			  //注意这里保存的题目要深拷贝
			  addQuestions.push(JSON.parse(JSON.stringify(this.questions[0][index])))
			  //可以交换，但之后再创建时会再次获取，所以这里可以破坏数据，直接覆盖便可
			  this.questions[0][index] = this.questions[0][n-1]
			  n--
		  }
		  n = ques_multi
		  for(let i = 0; i < multi; i++){
		  			  let index = Math.floor((Math.random()*n))
					  //注意这里保存的题目要深拷贝
		  			  addQuestions.push(JSON.parse(JSON.stringify(this.questions[1][index])))
		  			  //可以交换，但之后再创建时会再次获取，所以这里可以破坏数据，直接覆盖便可
		  			  this.questions[1][index] = this.questions[1][n-1]
		  			  n--
		  }
		  n = ques_judge
		  for(let i = 0; i < judge; i++){
		  			  let index = Math.floor((Math.random()*n))
					  //注意这里保存的题目要深拷贝
		  			  addQuestions.push(JSON.parse(JSON.stringify(this.questions[2][index])))
		  			  //可以交换，但之后再创建时会再次获取，所以这里可以破坏数据，直接覆盖便可
		  			  this.questions[2][index] = this.questions[2][n-1]
		  			  n--
		  }
		  addQuestions = addQuestions.sort((a,b)=>{ return a.id > b.id })
		  // console.log(paper)
		  // console.log(addQuestions)
		  var _this = this
		  //先存入试卷
		  this.$axios
		    .post('/papers', paper).then(resp => {
		    if (resp && resp.status === 200) {
		      // console.log(resp)
			  //存储成功后获取试卷id
				let id = resp.data.id
				//存储试卷对应的题目id到多对多表中
		        this.$axios
		          .post('/paperAddQuestion', {
		        	  paper_id: id,
		        	  questions: addQuestions
		          }).then(resp2 => {
		          if (resp2 && resp2.status === 200) {
		        	  // console.log(resp)
		            this.dialogFormVisible = false
		        	this.$message({
		        		type: 'info',
		        		message: '生成试卷成功！'
		        	})
		            this.$emit('onSubmit')
		          } else {
					  this.$message({
					  	type: 'error',
					  	message: '生成试卷失败！'
					  })
				  }
		        })
		    } else {
					  this.$message({
					  	type: 'error',
					  	message: '生成试卷失败！'
					  })
				  }
		  })
        
      }
    }
  }
</script>

<style scoped>

</style>


