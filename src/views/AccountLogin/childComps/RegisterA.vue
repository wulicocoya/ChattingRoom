<template>
  <div class="show1">
    <div class="rightPart">
      <h1>Welcome</h1>
      <p class="tip">
        您已经成功登录，欢迎来到xx聊天室，在这里你可以实现一个
        同一个账号不用身份登录。<br />
        接下来，让我们先来注册第一个账号，需要注册更多 可在主页实现。
      </p>
    </div>
    <div class="leftPart">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item prop="gender">
          <el-radio v-model="ruleForm.gender" label="男">男</el-radio>
          <el-radio v-model="ruleForm.gender" label="女">女</el-radio>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item prop="signature">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入你的个性签名"
            v-model="ruleForm.signature"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="inputWrapper">
        <p @click="createAccount">>>>点击注册</p>
      </div>
    </div>
  </div>

</template>

<script>
import Cookies from 'js-cookie'
import { createAccount } from "../../../api/account";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      rules: {
        name: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      ruleForm: {
        name: "",
        signature: "",
        gender: "女",
      },
      freeLogin:''
    };
  },
  methods: {
    ...mapMutations("account", { set_accountInfo: "SET_ACCOUNTINFO" }),
    //创建账号
    createAccount() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (!valid) {
          return this.$message("请完善信息哦");
        }
        const {data} = await createAccount(this.ruleForm);
        //存储账号信息到vuex
        const obj = {
          gender: this.ruleForm.gender,
          account_id: data.id,
          name: this.nameVal,
          signature: this.ruleForm.signature,
          avatar:data.avatar
        };
        this.set_accountInfo(obj);
        //存储token和id（和用户保持一致 存储天数）
       if(this.freeLogin){
        Cookies.set("account_token",JSON.stringify( data.account_token),{expires:15});
        Cookies.set("account_id",data.id,{expires:15}); 
        Cookies.set('account_Info', JSON.stringify(obj),{expires:15});
      }else{
        Cookies.set("account_token",JSON.stringify( data.account_token));
        Cookies.set("account_id",data.id); 
        Cookies.set('account_Info', JSON.stringify(obj));
      }
      this.$message.success("注册成功, 正在跳转主页...");
      this.$store.commit("account/SET_ACCOUNTINFO", {account:obj,freeLogin:this.freeLogin});
      setTimeout(() => {
        this.$router.replace("/message");
      }, 3000);

      });
    },
  },
  mounted(){
    this.$bus.$on('isFreeLogin',(freeLogin)=>{
      this.isFreeLogin = freeLogin;
      console.log(this.isFreeLogin);
    })
  }
};
</script>

<style lang="scss" scoped>
li,
ul {
  list-style: none;
}

  .show1 {
    border-radius: 20px;
    display: flex;
    height: 100%;
    .rightPart {
      border-radius: 20px 0px 0px 20px;
      height: 100%;
      background-color: #8e94fb;
      width: 55%;
      padding: 30px;
      box-sizing: border-box;
      .tip {
        font-size: 18px;
        line-height: 40px;
        margin-top: 60px;
        // color: #6769EC;
        color: white;
      }
      h1 {
        color: white;
        font-size: 70px !important;
        // color: #6C63FF;
      }
    }
    .leftPart {
      width: 45%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .el-form {
        width: 80% !important;
      }
      .inputWrapper {
        width: 200px;
        margin: 0 auto;
        margin-top: 40px;
        p {
          width: 100px;
          height: 40px;
          margin: 0 auto;
          display: table;
          margin-top: 20px;
          cursor: pointer;
        }
        p:hover{
          color: var(--theme-color);
        }
      }
    }
  }
  

</style>
