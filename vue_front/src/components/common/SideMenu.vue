<template>
  <el-aside style="width: 260px;">
  <el-menu 
  :default-active="nowPage"
  router
  class="categories"
  @select="handleSelect">
	<el-menu-item class="items" v-for="(item,i) in sideList" :key="i" :index="item.name" v-if="item.user || userAuthority == 'admin'">
		{{item.text}}
	</el-menu-item>
  </el-menu>
  </el-aside>
</template>

<script>
	import store from '../../store'
  export default {
    name: 'SideMenu',
	data () {
	      return {
	        sideList: [
	          {name: '/index', text: '考试信息', user: true},
	          {name: '/recode', text: '历史分数', user: true},
			  {name: '/paper', text: '考试管理', user: false},
	          {name: '/user', text: '用户管理', user: false},
	          {name: '/question', text: '试题管理', user: false}
	        ],
			nowPage: "",
			userAuthority: ""
	      }
	    },
		mounted(){
			this.nowPage = window.location.pathname
			this.userAuthority = store.state.user.authority
		},
		methods:{
			handleSelect(index){
				console.log("选择",index)
			}
		}

  }
</script>

<style scoped>
	.el-aside {
		background-color: #fff;
	    text-align: center;
	    line-height: 200px;
	  }
	
	.categories {
		position: fixed;
		background-color: rgb(173, 235, 220);
		padding: 30px 0;
		width: 260px;
		height: 90vh;
		z-index: 100;
	}
	
	.items {
		width: 180px;
		height: 48px;
		line-height: 48px;
		margin: 25px 40px;
		border: rgb(137, 193, 199) solid 4px;
		border-radius: 5px;
		border-top: 0px;
		box-shadow: 4px 3px 5px #cac6c6;
	}
	
	.items:hover {
		background-color: rgb(248, 247, 192);
	}
	
	.items.is-active{
		background-color: rgb(236, 230, 138);
		color: rgb(255, 150, 58);
		font-size: 15px;
		font-weight: bold;
	}
</style>

