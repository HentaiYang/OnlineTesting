<template>
	<el-dialog
	  title="自动识别题目并添加"
	  :visible.sync="autoAddDialogFormVisible"
	  @close="clear"
	  :append-to-body="true">
	  <el-form style="text-align: left" ref="dataForm">
	  <el-form-item label="输入例" :label-width="formLabelWidth">
	    <span>{{example[0]}}</span>
	    <span>{{example[1]}}</span>
	    <span>{{example[2]}}</span>
	    <span>{{example[3]}}</span>
	    <span>{{example[4]}}</span>
	  </el-form-item>
	  <el-form-item label="判断题输入例" :label-width="formLabelWidth">
		  <span>{{example2}}</span>
	  </el-form-item>
	  <el-form-item label="注意事项" :label-width="formLabelWidth">
	    <span>可以分行、包含空格、空行， 但格式较严格， 题号和选项用中文顿号或英文句点，答案用中文或英文括号括起， 和例题一样。</span>
		<span>判断题无需选项，需要在题目中包含用中文或英文括号扩起的“对”、“错”、“正确”、“错误”、“√”或“x”。</span>
	  </el-form-item>
	  <el-form-item label="批量输入" :label-width="formLabelWidth">
	    <el-input type="textarea" placeholder="请输入题目信息" v-model="inputs" autocomplete="off"></el-input>
	  </el-form-item>
	  <el-form-item label="默认分值" :label-width="formLabelWidth">
	    <el-input type="number" placeholder="题目默认分值" v-model="point" autocomplete="off"></el-input>
	  </el-form-item>
	  <el-form-item label="学科" :label-width="formLabelWidth">
	    <el-input placeholder="题目所属学科" v-model="subject" autocomplete="off"></el-input>
	  </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="autoAddDialogFormVisible = false">取 消</el-button>
	    <el-button type="primary" @click="onSubmit">确 定</el-button>
	  </div>
	  </el-dialog>
</template>

<script>
	export default{
		name: 'QuestionAddAuto',
		data() {
			return {
				autoAddDialogFormVisible: false,
				inputs: "",
				point: 5,
				subject: "",
				formLabelWidth: '120px',
				example: ["5、坚持总体国家安全观，以（A）为宗旨。", "A、人民安全", "B、政治安全", "C、经济安全", "D、国际安全"],
				example2: "3、国家安全是安邦定国的重要基石，维护国家安全是全国各族人民根本利益所在。（对）",
			}
		},
		methods: {
			clear () {
			  this.inputs = ""
			},
			onSubmit(){
				let inp = this.inputs
				let questions = []
				// 去除所有空格、换行符
				inp = inp.replace(/(^\s+)|(\s+$)/g,"");
				inp = inp.replace(/\s/g,"");
				inp = inp.replace(/\r|\n/ig,"")
				// 按 数字+中文顿号/英文句点 分割
				let buffer = inp.split(/[0-9]+[\u3001]|[0-9]+[.]/)
				let idx = 0
				let allCount = buffer.length
				let addCount = 0;
				if(buffer[0].length == 0){
					idx = 1
					allCount--
				}
				
				while(idx < buffer.length){
					// 按 中、英文括号包裹的对、错、正确、错误、√、x区分
					var judge = /[(\uff08](\u6b63\u786e|\u9519\u8bef|\u5bf9|\u9519|\u221a|\xd7)[)\uff09]/
					if(judge.test(buffer[idx])){
						let answer = buffer[idx].match(judge)[0]
						// console.log(answer)
						answer = answer.slice(1, answer.length-1)
						
						answer = (answer == '对' || answer == '正确' || answer == '√') ? 'A' : 'B'
						let content = buffer[idx].replace(judge, '( )')
						let question = {
							questionType: '判断',
							subject: this.subject,
							content: content,
							selection: "正确 错误",
							answer: answer,
							point: this.point,
						}
						// console.log(question)
						questions.push(question)
						addCount++
						idx++
						continue
					}
					// 按 字母+中文顿号/英文句点分割
					let temp = buffer[idx].split(/[A-Z][\u3001]|[A-Z][.]/)
					if(temp.length <= 2){
						console.log("出错的题目：",idx+1, buffer[idx])
						idx++
						continue
					}
					let content = temp[0]
					let selection = temp[1]
					for(let i = 2; i < temp.length; i++){
						selection += ' ' + temp[i]
					}
					// 按(ABC)或（ABC）进行匹配
					var pattern = /[\uff08][A-Z]+[\uff09]|[(][A-Z]+[)]/
					
					let answer = content.match(pattern)[0]
					answer = answer.slice(1, answer.length-1)
					// console.log('答案：',answer)
					
					content = content.replace(pattern, '( )')
					// console.log("题干：", content)
					let question = { 
						questionType: answer.length == 1 ? '单选' : '多选',
						subject: this.subject,
						content: content,
						selection: selection,
						answer: answer,
						point: this.point,
					}
					if(this.subject != "" && content != "" && answer != "" && selection != "" && (selection.split(" ")).length > 1){
						questions.push(question)
						addCount++
					} else {
						console.log("出错的题目：",idx+1, buffer[idx])
					}
					
					idx++
				}
				console.log(questions)
				this.$axios
				  .post('/questionAutoAdd', questions).then(resp => {
				  if (resp && resp.status === 200) {
				    this.autoAddDialogFormVisible = false
					this.$message({
						type: 'info',
						message: '添加'+allCount+'个，添加成功'+addCount+'个'
					})
					console.log('添加'+allCount+'个，添加成功'+addCount+'个')
				    this.$emit('onSubmit')
				  }
				})
			}
		}
	}
</script>

<style>
</style>