<template>
    <div class="wrapper">
        <LeftPart/>
        <router-view></router-view>
    </div>
</template>

<script> 
import LeftPart from './childComps/LeftPart.vue'
export default {
    name:'LayoutPart',
    components:{
        LeftPart
    }
}
</script>

<style lang='scss'>
.wrapper{
    height: 100%;
    display: flex;
}
</style>