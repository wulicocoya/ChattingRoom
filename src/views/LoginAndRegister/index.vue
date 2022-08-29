<template>
  <div class="wrapper">
            <div class="img">
              <img src="../../assets/dlbox.svg" alt="">
            </div>
            <Login v-if="isLogin" @changeIsLogin="changeIsLogin"/>
            <Register v-else @changeIsLogin="changeIsLogin"/>
        </div>
</template>

<script>
import Register from './childComps/Register.vue'
import Login from './childComps/Login.vue'
export default {
    name:'LoginAndRegister',
    data(){
      return{
        isLogin:true
      }
    },
    methods:{
      changeIsLogin(){
        this.isLogin = !this.isLogin;
      }
    },
    components:{
      Register,
      Login
    }
}
</script>

<style lang='scss' scoped>
*{
    padding: 0px;
    margin: 0px;
    list-style: none;
}
.wrapper{
  background-color: white;
    width: 1000px;
    height: 500px;
    box-shadow: 0 2px 6px 6px rgb(0 0 0 / 7%);
    margin: 0 auto;
    margin-top: 100px;
    display: flex;
    .img{
        width: 60%;
        height: 100%;
        background-color:#DAD1F8 ;
        img{
          height: auto;
          width: 100%;
        }
    }
    .loginWrapper{
      flex: 1;
    }
    .registerWrapper{
      flex: 1;
    }
}
</style>