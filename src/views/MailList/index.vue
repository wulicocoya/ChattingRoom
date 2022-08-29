<template>
  <div class="wrapper">
    <LeftShow/>
    <router-view></router-view>
  </div>
</template>

<script>
import LeftShow from './childComps/LeftShow.vue'
export default {
    name:'MailList',
    components:{
      LeftShow
    }
}
</script>

<style scoped lang='scss'>
.wrapper{
    display: flex;
    width: 100%;
}
</style>