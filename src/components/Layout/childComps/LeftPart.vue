<template>
  <div class="wrapper">
    <div class="logo">
      <i class="el-icon-sugar"></i>
    </div>
    <!-- 选择图标部分 -->
    <ul class="itemWrapper">
      <li v-for="(item,index) in iconInfo" :key="index" class="iconItem">
        <el-tooltip
          class="item"
          effect="dark"
          :content="item.tip"
          placement="top"
        >
          <el-button @click='toPage(item.route)' :class='item.active'>
            <i :class="item.class"></i>
          </el-button>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "LeftPart",
  data(){
    return{
    iconInfo: [
    { class: "el-icon-chat-line-round", tip: "chats" , route:'/message', active:'active'},
    { class: "el-icon-user", tip: "contacts" ,route:'/maillist',active:''},
    {class:"el-icon-s-custom", tip:"profile",route:'/profile', active:''}
  ],}
  },
  methods:{
    toPage(route){
      console.log(this.$route.path);
      if(this.$route.path != route)
        this.$router.push(route);
    }
  },
  watch:{
    $route(to){
      for(let item of this.iconInfo){
        let reg = new RegExp(`^${item.route}.*`);
        if(reg.test(to.path)){
          item.active = 'active';
        }else{
          item.active = '';
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  width: 100px;
  height: 100%;
  background-color: var(--main-color);
  display: flex;
  flex-direction: column;
  padding-top:30px ;
  .logo{
    display: flex;
    margin: 0 auto;
    .el-icon-sugar{
      color: var(--theme-color);
    }
  }
  .itemWrapper{
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items:center;
    margin-top: 40px;
    .iconItem{
      margin-top: 30px;
      
      .el-button{
        border: none;
      }
    }

  }
}
.active{
  background-color: rgb(239, 236, 247);
}
i{
  font-size: 30px;
}
</style>
