<template>
  <div>
    <el-dialog
      title="开始考试"
      :visible.sync="dialogFormVisible"
      @close="clear"
	  :append-to-body="true">
      <el-form v-model="form" style="text-align: left" ref="dataForm">
				<el-form-item label="试卷类型" :label-width="formLabelWidth" prop="paper_type">
				  <el-input placeholder="试卷类型" v-model="form.paper_type" disabled autocomplete="off" @input="searchQuestionBySubject()"></el-input>
				</el-form-item>
		  <el-form-item label="试卷标题" :label-width="formLabelWidth" prop="title">
		    <el-input placeholder="试卷标题" v-model="form.title" autocomplete="off"></el-input>
		  </el-form-item>
        <el-form-item label="试卷说明" :label-width="formLabelWidth" prop="summary">
          <el-input type="textarea" placeholder="试卷说明" v-model="form.summary" autocomplete="off"></el-input>
        </el-form-item>
		<el-form-item label="考试时长(分钟)" :label-width="formLabelWidth" prop="duration">
		  <el-input type="number" placeholder="考试持续时长(分钟)" v-model="form.duration" autocomplete="off"></el-input>
		</el-form-item>
		<el-form-item label="考试开放时间" :label-width="formLabelWidth" prop="timeValue">
			<el-date-picker
			      v-model="timeValue"
			      type="datetimerange"
			      :picker-options="pickerOptions"
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期"
			      align="right">
			    </el-date-picker>
		</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'PaperEditForm',
    data () {
      return {
        dialogFormVisible: false,
        form: {
		  id: null,
          duration: 60, //这里是分钟
          title: "",
          paper_type: "",
          summary: "",
		  count: 0,
		  single_count: 0,
		  multi_count: 0,
		  judge_count: 0,
		  state: "",
		  start_time: null,
		  end_time: null,
		  create_time: null
        },
		pickerOptions: {
		          shortcuts: [{
		            text: '最近一小时',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              end.setTime(start.getTime() + 3600 * 1000);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近一天',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              end.setTime(start.getTime() + 3600 * 1000 * 24);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近一周',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', [start, end]);
		            }
		          }]
		        },
			timeValue: [],
        formLabelWidth: '120px',
      }
    },
	mounted() {
		
	},
    methods: {
      clear () {
        this.form = {
		  id: null,
          duration: 60,
          title: "",
          paper_type: "",
          summary: "",
		  count: 0,
		  single_count: 0,
		  multi_count: 0,
		  judge_count: 0,
		  state: "",
		  start_time: null,
		  end_time: null,
		  create_time: null
        }
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

</style>


