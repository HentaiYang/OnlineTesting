<template>
  <el-container style="flex-direction: column;">
	<NavMenu></NavMenu>
	<el-container style="margin-top: 70px;">
		<SideMenu></SideMenu>
		<div style="width: 100%; min-height: 90vh; border: #e7e7e7 solid 2px;">
			<router-view/>
		</div>
    </el-container>  
  </el-container>
</template>

<script>
  import NavMenu from './common/NavMenu'
  import SideMenu from './common/SideMenu.vue'
  export default {
    name: 'Home',
    components: {
		NavMenu,
		SideMenu
		}
  }
</script>

<style scoped>
	  body > .el-container {
	    margin-bottom: 40px;
	  }
	  
	  .el-container:nth-child(5) .el-aside,
	  .el-container:nth-child(6) .el-aside {
	    line-height: 260px;
	  }
	  
	  .el-container:nth-child(7) .el-aside {
	    line-height: 320px;
	  }
</style>

