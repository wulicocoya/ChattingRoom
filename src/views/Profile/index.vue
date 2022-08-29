<template>
  <div class="wrapper">
    <LeftShow/>
    <Setting/>
  </div>
</template>

<script>
import LeftShow from './childComps/LeftShow.vue'
import Setting from './childComps/Setting.vue'

export default {
    components:{
       LeftShow,
        Setting
    }

}
</script>

<style scoped>
.wrapper{
    display: flex;
    width: 100%;
}

</style>