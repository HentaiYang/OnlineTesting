<template>
  <div>
    <el-dialog
      title="修改试卷信息"
      :visible.sync="dialogFormVisible"
      @close="clear"
	  :append-to-body="true">
      <el-form v-model="form" style="text-align: left" ref="dataForm">
		  <el-form-item label="试卷类型" :label-width="formLabelWidth" prop="paper_type">
		    <el-input placeholder="试卷类型" v-model="form.paper_type" disabled autocomplete="off" @input="searchQuestionBySubject()"></el-input>
		  </el-form-item>
		  <el-form-item label="试卷标题" :label-width="formLabelWidth" prop="title">
		    <el-input placeholder="请输入试卷标题" v-model="form.title" autocomplete="off"></el-input>
		  </el-form-item>
        <el-form-item label="试卷说明" :label-width="formLabelWidth" prop="summary">
          <el-input type="textarea" placeholder="请输入试卷说明" v-model="form.summary" autocomplete="off"></el-input>
        </el-form-item>
		<el-form-item label="考试时长(分钟)" :label-width="formLabelWidth" prop="duration">
		  <el-input type="number" placeholder="考试持续时长(分钟)" v-model="form.duration" autocomplete="off"></el-input>
		</el-form-item>
		<el-form-item v-if="form.state != '未开放'" label="考试开始时间" :label-width="formLabelWidth" prop="start_time">
		  <el-date-picker
		        v-model="form.start_time"
		        type="datetime"
		        placeholder="选择日期时间"
		        align="right"
		        :picker-options="pickerOptions">
		      </el-date-picker>
		</el-form-item>
		<el-form-item v-if="form.state != '未开放'" label="考试结束时间" :label-width="formLabelWidth" prop="end_time">
		  <el-date-picker
		        v-model="form.end_time"
		        type="datetime"
		        placeholder="选择日期时间"
		        align="right"
		        :picker-options="pickerOptions">
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
		  id: "",
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
		            text: '现在',
		            onClick(picker) {
		              picker.$emit('pick', new Date());
		            }
		          }, {
		            text: '明天',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() + 3600 * 1000 * 24);
		              picker.$emit('pick', date);
		            }
		          }, {
		            text: '一周',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', date);
		            }
		          }],
		},
        formLabelWidth: '120px',
      }
    },
    methods: {
      clear () {
        this.form = {
		  id: "",
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
			  state: form.state,
			  start_time: form.start_time,
			  end_time: form.end_time,
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
		        		message: '修改试卷成功！'
		        	})
		            this.$emit('onSubmit')
		    }
		  })
        
      }
    }
  }
</script>

<style scoped>

</style>


