<template>
  <div class="registerWrapper">
    <h1>Register</h1>
    <el-form
      :model="userInfo"
      ref="validateForm"
      label-width="100px"
      class="register-form"
      :rules="RegisterRules"
    >
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code" class="codeItem">
        <el-input v-model="userInfo.code" autocomplete="off"></el-input>
        <el-button @click="getCode">{{ codeReminder }}</el-button>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="userInfo.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submitBtn" @click="submit('validateForm')" type="primary">
          注册
        </el-button>
      </el-form-item>
    </el-form>
    <div class="bottom">
      <span>已有账户? </span>
      <span class="toRegister" @click="changeIsLogin">点此登录</span>
    </div>
  </div>
</template>

<script>
import { RegisterRules } from "../../../utils/validate";
import { register, getCode } from "../../../api/LoginAndRegister.js";
export default {
  name: "Register",
  methods: {
    async register() {
      console.log("come in");
      console.log(this.userInfo);
      const data  = await register(this.userInfo);
      console.log(data);
      if(!data){
          return;
      }
      this.$message.success("注册成功");
    },
    submit(validateForm) {
      console.log("hello");
      this.register();
      // this.$refs[validateForm].validate((valid) => {
      //   console.log(valid);
      //   if (!valid) {
      //     this.$message.error("error submit!");
      //   } else {
      //     console.log("ss");
      //     this.register();
      //   }
      // });
    },
    //跳转注册
    changeIsLogin() {
      this.$emit("changeIsLogin");
    },
    //获取验证码
    getCode() {
      let cntNum = 60;
      this.$refs["validateForm"].validateField("email", async (msg) => {
        if (msg) {
          return this.$message.error(msg);
        } else {
          //节流
          if (this.limit == 1) {
            return;
          }
          this.limit = 1;
          let timer = setInterval(() => {
            if (cntNum <= 0) {
              clearInterval(timer);
              this.codeReminder = "发送验证码";
              this.limit = 0;
              return;
            }
            cntNum--;
            this.codeReminder = `已发送（${cntNum}）`;
          }, 1000);
          const data = await getCode(this.userInfo.email);
          console.log(data);
          if (data.status_code != 0) {
            this.$message.error("获取验证码有误");
          } else {
            this.$message.success("已发送");
          }
        }
      });
    },
  },
  data() {
    return {
      userInfo: {
        email: "",
        password: "",
        code: "",
        limit: 0,
      },
      RegisterRules: RegisterRules,
      codeReminder: "获取验证码",
    };
  },
};
</script>

<style lang="scss" scoped>
.registerWrapper {
  padding-top: 30px;
  padding-right: 50px;
  h1 {
    margin-left: 35px;
  }
  .register-form {
    margin-top: 40px;
    .el-form-item {
      width: 100%;
      .remember {
        font-size: 18px;
        color: #8888a7;
      }
      .submitBtn {
        width: 100%;
      }
    }
    .codeItem {
      .el-form-item__content {
        display: flex !important;
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
