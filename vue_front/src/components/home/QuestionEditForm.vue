<template>
  <div>
    <el-dialog
      title="添加/修改题目"
      :visible.sync="dialogFormVisible"
      @close="clear"
	  :append-to-body="true"
	  style="margin-top: -5vh;">
      <el-form v-model="form" style="text-align: left" ref="dataForm">
		  <el-form-item label="题目类型" :label-width="formLabelWidth" prop="question_type">
		    <el-select v-model="form.question_type" :disabled="isEdit" placeholder="请选择题目类型">
		      <el-option label="单选" value="单选"></el-option>
		      <el-option label="多选" value="多选"></el-option>
		      <el-option label="判断" value="判断"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="学科" :label-width="formLabelWidth" prop="subject">
		    <el-input placeholder="题目所属学科" v-model="form.subject" autocomplete="off"></el-input>
		  </el-form-item>
		  <el-form-item label="默认分值" :label-width="formLabelWidth" prop="point">
		    <el-input type="number" placeholder="题目默认分值" v-model="form.point" autocomplete="off"></el-input>
		  </el-form-item>
        <el-form-item label="题干" :label-width="formLabelWidth" prop="content">
          <el-input type="textarea" placeholder="请输入题干" v-model="form.content" autocomplete="off"></el-input>
        </el-form-item>
        
		<div v-if="form.question_type == '单选' || form.question_type == '多选'" v-for="(item,index) in form.selection" :key="index">
			<el-form-item
			:label="'选项'+'ABCDEFGH'[index]" :label-width="formLabelWidth"
			prop="item">
			  <el-input v-model="form.selection[index]" :placeholder="'选项'+'ABCDEFGH'[index]+'答案'" autocomplete="off"></el-input>
			</el-form-item>
		</div>
		<div v-if="form.question_type == '判断'">
			<el-form-item label="选项A" :label-width="formLabelWidth">
			  <el-input value="正确" disabled autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="选项B" :label-width="formLabelWidth">
			  <el-input value="错误" disabled autocomplete="off"></el-input>
			</el-form-item>
		</div>
		<div v-if="form.question_type == '单选'">
			<el-form-item  label="答案" :label-width="formLabelWidth" prop="form.answer">
			  <el-select v-model="form.answer" placeholder="单选题答案">
			    <el-option label="A" value="A"></el-option>
			    <el-option label="B" value="B"></el-option>
			    <el-option label="C" value="C"></el-option>
			    <el-option label="D" value="D"></el-option>
			  </el-select>
			</el-form-item>
		</div>
		
		<div v-if="form.question_type == '多选'">
			<el-form-item  label="答案" :label-width="formLabelWidth" prop="form.answer">
			  <el-input placeholder="多选题答案" v-model="form.answer" autocomplete="off"></el-input>
			</el-form-item>
		</div>
		
		<div v-if="form.question_type == '判断'">
			<el-form-item  label="答案" :label-width="formLabelWidth" prop="form.answer">
			  <el-select v-model="form.answer" placeholder="判断题答案">
			    <el-option label="A" value="A"></el-option>
			    <el-option label="B" value="B"></el-option>
			  </el-select>
			</el-form-item>
		</div>
        
        <el-form-item prop="id" style="height: 0">
          <el-input type="hidden" v-model="form.id" autocomplete="off"></el-input>
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
    name: 'QuestionEditForm',
    data () {
      return {
        dialogFormVisible: false,
        form: {
          id: null,
          question_type: "",
		  subject: "",
          content: "",
          selection: ["","","",""],
          answer: "",
          point: 5,
        },
        formLabelWidth: '120px',
		isEdit: false
      }
    },
    methods: {
      clear () {
        this.form = {
          id: null,
          question_type: "",
		  subject: "",
          content: "",
          selection: ["","","",""],
          answer: "",
          point: 5,
        }
      },
      onSubmit () {
		  console.log(this.form)
		  let selection = this.form.selection[0]
		  for(let i = 1; i < this.form.selection.length; i++){
			  selection += ' ' + this.form.selection[i]
		  }
		  let newQues = {
			id: this.form.id == "" ? null : this.form.id,
            questionType: this.form.question_type,
			subject: this.form.subject,
            content: this.form.content,
            selection: selection,
            answer: this.form.answer,
            point: this.form.point,
          }
		  console.log(newQues)
        this.$axios
          .post('/questions', newQues).then(resp => {
          if (resp && resp.status === 200) {
			  // console.log(resp.data)
            this.dialogFormVisible = false
			this.$message({
				type: 'info',
				message: '添加/修改成功'
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


