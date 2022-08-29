<template>
  <div class="showWrapper">
    <ul class="innerWrapper">
      <li>
        <div class="imgWrapper"  @click="toPage">
          <el-avatar
            icon="el-icon-user-solid"
            :src="list && list[0].avatar"
          ></el-avatar>
        </div>
        <p>{{ list ? list[0].name : "昵称" }}</p>
      </li>
      <!-- 查看更多 -->
      <div class="more" @click="showMore" v-if="list && list.length > 1">
        >>>查看更多账号信息
      </div>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
import {getAccountInfo, getAccountToken} from '../../../api/account'
import Cookies from 'js-cookie'
export default {
  props: ["list"],
  data() {
    return {
      freeLogin:''
    };
  },
  methods: {
    showMore() {
      this.$router.push("/accountDetail");
      
    },
    // 有待解决 cookie不能即时获取!
    //已经解决 ：直接传入toke放到头部里面
    async getAccountInfo(id, token){
      const {data} = await getAccountInfo(id, token);
      if(this.freeLogin){
        Cookies.set("account_info", JSON.stringify(data),{expires:15});
      }else{
        Cookies.set("account_info",JSON.stringify(data));
      }
      this.$store.commit("account/SET_ACCOUNTINFO", {account:data,freeLogin:this.freeLogin});
    },
    async getAccountToken(id){
      const {data} = await getAccountToken(id);
      console.log(data);
      if(this.freeLogin){
        Cookies.set("account_token",JSON.stringify( data.account_token,{expires:15}));
      }else{
        Cookies.set("account_token",JSON.stringify( data.account_token));
      }
        this.getAccountInfo(this.list[0].account_id, data.account_token.token);
      
    },
    toPage() {
      console.log(this.list[0].account_id);
      //设置token
      this.getAccountToken(this.list[0].account_id);
      this.$message.success("正在跳转主页...请稍等");
      setTimeout(() => {
        this.$router.replace("/message");
      }, 3000);
      
     
    },
    
  },
  mounted() {
      this.$bus.$on('isFreeLogin',(freeLogin)=>{
        this.freeLogin = freeLogin;
      })
    },
    beforeDestroyed(){
      this.$bus.$off('isFreeLogin');
    }
};
</script>

<style lang="scss">
.el-avatar {
  background-color: rgba($color: #8e94fb, $alpha: 0.5);
  padding:0 !important;
}
.showWrapper{
  .el-avatar:hover .el-icon-user-solid {
    transform: scale(1.2);
  }
}

.el-icon-user-solid {
  font-size: 57px !important;
}
.el-avatar>img {
  height: auto !important;
  width: auto !important;
  max-height: 100% !important;
  max-width: 100% !important;
  cursor: pointer !important;
}
.el-avatar>img:hover{
  transform:scale(1.2);
}
</style>

<style scoped lang="scss">
.showWrapper {
  width: 100%;
  height: 100%;
}
.innerWrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 100px;
  box-sizing: border-box;
  border-radius: 20px;
  background-color: linear-gradient(
    to bottom,
    rgba(100, 255, 150, 0.3) 60%,
    rgba(100, 255, 150, 1)
  );
  background-color: rgba($color: #8e94fb, $alpha: 0.2);
  li {
    flex-basis: 250px;
    text-align: center;
    .imgWrapper {
      width: 150px;
      height: 150px;
      // border-radius: 50%;
      margin: 0 auto;
      .el-avatar {
        height: 100%;
        width: 100%;
        padding-top: 25%;
        img:hover {
          transform: scale(1.2);
        }
        img {
          height: auto;
          width: auto;
          max-height: 100%;
          max-width: 100%;
          cursor: pointer;
        }
        .el-icon-user-solid {
          font-size: 57px !important;
        }
      }
    }
    p {
      margin-top: 10px;
      display: inline-block;
      cursor: pointer;
    }
  }
  .more {
    display: table;
    margin: 0 auto;
    cursor: pointer;
    color: #bbbffd;
  }
  .more:hover {
    color: #8e94fb;
  }
   img:hover {
          transform: scale(1.2);
        }
}
</style>
