<template>
  <div class="leftWrapper">
       <el-menu
      default-active="/maillist/contacts"
      class="el-menu-vertical-demo"
      router>
       <el-menu-item index="/maillist/contacts">
        <i class="el-icon-menu"></i>
        <span slot="title">我的联系人</span>
      </el-menu-item>
       <el-menu-item index="/maillist/groups">
        <i class="el-icon-menu"></i>
        <span slot="title">我的群组</span>
      </el-menu-item>
       <el-menu-item index="/maillist/new">
        <i class="el-icon-menu"></i>
        <span slot="title">新的联系人</span>
      </el-menu-item>
       </el-menu>
  </div>
</template>

<script>
export default {
    
}
</script>

<style scoped lang='scss'>
.leftWrapper {
  width: 600px;
  height: 100%;
  background-color: var(--main-color2);
  padding: 30px;
}
</style>