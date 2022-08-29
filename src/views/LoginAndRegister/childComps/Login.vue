<template>
  <div class="loginWrapper">
    <h1>Sign In</h1>
    <el-form
      :model="userInfo"
      ref="validateForm"
      label-width="100px"
      class="login-form"
      :rules="loginRules"
    >
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="userInfo.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <input type="checkbox" id="remember" v-model="freeLogin"/>
        <!--后期加上 -->
        <label for="remember" class="remember">15天免登陆</label>
      </el-form-item>
      <el-form-item>
        <el-button class="submitBtn" @click="submit('validateForm')" type="primary">
          登录
        </el-button>
      </el-form-item>
    </el-form>
    <div class="bottom">
      <span>还没有账户? </span>
      <span class="toRegister" @click="changeIsLogin">点此注册</span>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { loginRules } from "../../../utils/validate";
import { login } from "../../../api/LoginAndRegister";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  methods: {
    async login() {
      const {data} = await login(this.userInfo);
      if(this.freeLogin){
        //存储token
        // localStorage.setItem("user_token",JSON.stringify( data.user_token));
        // localStorage.setItem("user_id", data.user_info.id);
        Cookies.set("user_token",JSON.stringify( data.user_token),{expires:15});    
      }else{
        Cookies.set("user_token",JSON.stringify( data.user_token));
      }
      this.$store.dispatch("freeLogin/SET_FREELOGIN",this.freeLogin)
      this.$bus.$emit('isFreeLogin', this.freeLogin);
      //store存储用户信息
      this.$router.replace('/account');
    },
    submit(validateForm) {
      this.$refs[validateForm].validate((valid) => {
        if (!valid) {
          this.$message.error("error submit!");
        } else {
          this.login();
        }
      });
    },
    //跳转注册
    changeIsLogin() {
      this.$emit("changeIsLogin");
    },
  },
  data() {
    return {
      userInfo: {
        email: "2094748221@qq.com",
        password: "88888888",
      },
      loginRules: loginRules,
      freeLogin:''
    };
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.loginWrapper {
  padding-top: 30px;
  padding-right: 50px;
  h1 {
    margin-left: 35px;
  }
  .login-form {
    margin-top: 40px;
    .el-form-item {
      width: 100%;
      .remember {
        font-size: 15px;
        color: #8888a7;
      }
      .submitBtn {
        width: 100%;
      }
    }
  }
  .toRegister {
    cursor: pointer;
    color: #6769e8;
  }
  .toRegister:hover {
    text-decoration: underline;
  }
  .bottom {
    display: flex;
    width: 100%;
    margin-left: 150px;
  }
}
</style>
