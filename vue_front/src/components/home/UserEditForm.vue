<template>
  <div>
    <el-dialog
      title="添加/修改用户"
      :visible.sync="dialogFormVisible"
      @close="clear"
	  :append-to-body="true"
	  style="margin-top: -5vh;">
      <el-form v-model="form" style="text-align: left" ref="dataForm">
		  <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
		    <el-input placeholder="用户名" v-model="form.username" autocomplete="off"></el-input>
		  </el-form-item>
		  <el-form-item v-if="!isEdit" label="密码" :label-width="formLabelWidth" prop="password">
		    <el-input placeholder="用户密码" v-model="form.password" autocomplete="off"></el-input>
		  </el-form-item>
		  <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
		    <el-input placeholder="用户年龄" v-model="form.age" autocomplete="off"></el-input>
		  </el-form-item>
		  <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
			<el-select v-model="form.sex" placeholder="用户性别">
			  <el-option label="男" :value="'男'"></el-option>
			  <el-option label="女" :value="'女'"></el-option>
			</el-select>
		  </el-form-item>
		  <el-form-item label="电话" :label-width="formLabelWidth" prop="phonenumber">
		    <el-input placeholder="用户手机号" v-model="form.phonenumber" autocomplete="off"></el-input>
		  </el-form-item>
        <el-form-item label="学号" :label-width="formLabelWidth" prop="studentid">
          <el-input placeholder="用户学号" v-model="form.studentid" autocomplete="off"></el-input>
        </el-form-item>
		<el-form-item label="学院" :label-width="formLabelWidth" prop="college">
		  <el-input placeholder="用户学院" v-model="form.college" autocomplete="off"></el-input>
		</el-form-item>
		<el-form-item label="班级" :label-width="formLabelWidth" prop="classinfo">
		  <el-input placeholder="用户班级信息" v-model="form.classinfo" autocomplete="off"></el-input>
		</el-form-item>
        
		<el-form-item  label="用户权限" :label-width="formLabelWidth" prop="authority">
		  <el-select v-model="form.authority" placeholder="用户权限">
		    <el-option label="用户" :value="'user'"></el-option>
		    <el-option label="管理员" :value="'admin'"></el-option>
		  </el-select>
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
    name: 'UserEditForm',
    data () {
      return {
        dialogFormVisible: false,
        form: {
          id: "",
          username: "",
		  password: "",
          sex: "",
          age: "",
          phonenumber: "",
          studentid: "",
          college: "",
          classinfo: "",
          authority: "",
        },
        formLabelWidth: '120px',
		isEdit: false
      }
    },
    methods: {
      clear () {
        this.form = {
          id: "",
          username: "",
		  password: "",
          sex: "",
          age: "",
          phonenumber: "",
          studentid: "",
          college: "",
          classinfo: "",
          authority: "",
        }
      },
      onSubmit () {
		  var _this = this
		  let form = this.form
		  var digit = /[0-9]+/ //匹配数字
		  if(form.username == ""){
		  	_this.$message({message:"用户名不能为空！",type:"error"})
		  	return
		  }
		  if(form.password == ""){
		  	_this.$message({message:"密码不能为空！",type:"error"})
		  	return
		  }
		  if(form.sex == ""){
		  	_this.$message({message:"性别不能为空！",type:"error"})
		  	return
		  }
		  if(form.age == ""){
		  	_this.$message({message:"年龄不能为空！",type:"error"})
		  	return
		  }
		  if(form.phonenumber == ""){
		  	_this.$message({message:"手机号不能为空！",type:"error"})
		  	return
		  }
		  if(form.studentid == ""){
		  	_this.$message({message:"学号不能为空！",type:"error"})
		  	return
		  }
		  if(form.college == ""){
		  	_this.$message({message:"学院不能为空！",type:"error"})
		  	return
		  }
		  if(form.classinfo == ""){
		  	_this.$message({message:"班级信息不能为空！",type:"error"})
		  	return
		  }
		  if(!digit.test(form.age)){
		  	_this.$message({message:"年龄应为数字！",type:"error"})
		  	return
		  }
		  if(!digit.test(form.phonenumber)){
		  	_this.$message({message:"手机号应为数字！",type:"error"})
		  	return
		  }
		  if(!digit.test(form.studentid)){
		  	_this.$message({message:"学号应为数字！",type:"error"})
		  	return
		  }
		  if(form.phonenumber.length != 11){
		  	_this.$message({message:"手机号应为11位！",type:"error"})
		  	return
		  }
		  if(form.studentid.length != 11){
		  	_this.$message({message:"学号应为11位！",type:"error"})
		  	return
		  }
		  if(form.sex != '男' && form.sex != '女'){
		  	console.log(form.sex)
		  	_this.$message({message:"性别应为‘男’或‘女’！",type:"error"})
		  	return
		  }
		  
		  form.id = form.id == "" ? null : form.id
		  if(_this.isEdit){
			  _this.$axios
			    .post('/users', form).then(resp => {
			    if (resp && resp.status === 200) {
			      _this.dialogFormVisible = false
			  	_this.$message({
			  		type: 'info',
			  		message: '添加/修改成功'
			  	})
			      _this.$emit('onSubmit')
			    }
			  })
		  } else {
			  _this.$axios
			    .post('/register', form).then(resp => {
			    if (resp && resp.status === 200) {
			      _this.dialogFormVisible = false
			  	_this.$message({
			  		type: 'info',
			  		message: '添加/修改成功'
			  	})
			      _this.$emit('onSubmit')
			    }
			  })
		  }
        
      }
    }
  }
</script>

<style scoped>
</style>


