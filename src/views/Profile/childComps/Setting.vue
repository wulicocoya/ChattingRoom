<template>
  <div class="wrapper">
    <div class="top">
      <h2>Settings</h2>
      <p class="des">Update Personal Information & Settings</p>
    </div>
    <div class="main">
      <!-- 更新账号部分 -->
      <div class="account formWrapper">
        <div class="title">
          <p>account</p>
          <div class="des">Update personal & contact information</div>
        </div>

        <el-form
          :model="infoForm"
          status-icon
          :rules="rules"
          ref="accountForm"
          label-width="80px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="name" prop="name">
            <el-input
              type="name"
              v-model="infoForm.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="gender" prop="gender">
            <el-radio v-model="infoForm.gender" label="女">女</el-radio>
            <el-radio v-model="infoForm.gender" label="男">男</el-radio>
          </el-form-item>
          <el-form-item label="signature">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="infoForm.signature"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm('accountForm')">重置</el-button>
            <el-button
              type="primary"
              @click="updateAccount"
              :disabled="isDisabled"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <!-- 密码表单 -->
      <div class="password formWrapper">
        <div class="title">
          <p>password</p>
          <div class="des">Update personal & contact information</div>
        </div>
        <el-form
          :model="passForm"
          status-icon
          :rules="updateRules"
          ref="passForm"
          label-width="100px"
          class="passForm"
          label-position="top"
        >
          <el-form-item label="邮箱" prop="email" class="email">
            <el-input
              v-model="passForm.email"
              autocomplete="off"
              :validate-event="false"
            ></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code" class="code">
            <el-input
              type="password"
              v-model="passForm.code"
              autocomplete="off"
              :validate-event="false"
            ></el-input>
            <el-button @click="getCode">{{ codeReminder }}</el-button>
          </el-form-item>
          <el-form-item label="新密码" prop="password" class="newPass">
            <el-input
              type="password"
              v-model="passForm.password"
              autocomplete="off"
              :validate-event="false"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm('passForm')">重置</el-button>
            <el-button type="primary" @click="updatePass('passForm')"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <!-- 退出登录以及注销账户 -->
      <div class="out formWrapper">
        <div class="title">
          <p>LogOut</p>
          <div class="des">Update account information</div>
        </div>
        <el-form
          status-icon
          label-width="100px"
          class="logoutForm"
          label-position="top"
        >
          <el-form-item label="账户" prop="email" class="email">
            <el-button @click="delAccount">注销账号</el-button>
            <el-button type="primary" @click="logout">退出登录</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 注册账号 -->
      <div class="register formWrapper">
        <div class="title">
          <p>Register</p>
          <div class="des">Register account information</div>
        </div>
        <el-form
          :model="registerForm"
          status-icon
          :rules="updateRules"
          ref="registerForm"
          label-width="100px"
          class="registerForm"
          label-position="top"
        >
          <el-form-item label="name" prop="name">
            <el-input
              type="name"
              v-model="registerForm.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="gender" prop="gender">
            <el-radio v-model="registerForm.gender" label="女">女</el-radio>
            <el-radio v-model="registerForm.gender" label="男">男</el-radio>
          </el-form-item>
          <el-form-item label="signature" prop='signature'>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="registerForm.signature"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm('registerForm')">重置</el-button>
            <el-button type="primary" @click="registerAccount"
              >注册账号</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <!-- 切换账号登录 -->
    </div>
  </div>
</template>

<script>
import { updateRules } from "../../../utils/validate";
import {
  updateAccount,
  updatePass,
  registerAccount,
  delAccount
} from "../../../api/account";
import { getCode } from "../../../api/LoginAndRegister.js";
export default {
  data() {
    return {
      rules: {
        name: [
          { required: true, message: "请输入名字" }
        ],
      },
      //是否禁用 防止用户多次重复提交
      isDisabled: false,
      infoForm: {
        name: "name",
        gender: "女",
        signature: "这是一条有个性的签名",
      },
      codeReminder: "获取验证码",
      passForm: {
        email: "",
        password: "",
        code: "",
      },
      updateRules: updateRules,
      freeLogin: "",
      registerForm: {},
    };
  },
  computed: {
    account() {
      if (this.$store.state.account.accountInfo) {
        return this.$store.state.account.accountInfo;
      } else {
        return {
          name: "name",
          gender: "女",
          signature: "这是一条有个性的签名",
        };
      }
    },
  },
  methods: {
    // 提交用户表单
    updateAccount() {
      this.$refs["accountForm"].validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请完善账号信息之后再提交");
        }
        if (JSON.stringify(this.account) == JSON.stringify(this.infoForm)) {
          return this.$message.warning("和原信息一致哦");
        }
        this.isDisabled = true;
        this.$confirm("确定更新账户信息吗？").then(async () => {
          await updateAccount(this.infoForm);
          for (let item in this.infoForm) {
            this.account[item] = this.infoForm[item];
          }
          this.$store.commit("account/SET_ACCOUNTINFO", {
            freeLogin: this.freeLogin,
            account: this.account,
          });
          console.log(this.$store.state.account.accountInfo);
          setTimeout(() => {
            this.isDisabled = false; //点击一次时隔两秒后才能再次点击
          }, 2000);
        })
        .catch(()=>{
          this.isDisabled = false; 
        })
      });
    },
    //更新用户密码
    updatePass(ref) {
      this.$refs[ref].validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data } = await updatePass(
          this.passForm.code,
          this.passForm.password
        );
        this.$message.success("密码更改成功");
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //获取验证码
    getCode() {
      let cntNum = 60;
      this.$refs["passForm"].validateField("email", async (msg) => {
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
          console.log(this.passForm.email);
          const data = await getCode(this.passForm.email);
          console.log(data);
          if (data.status_code != 0) {
            this.$message.error("获取验证码有误");
          } else {
            this.$message.success("已发送");
          }
        }
      });
    },
    //注册账号
    async registerAccount() {
      const data = await registerAccount(this.registerForm);
      console.log(data);
      if (!data) {
        this.$message.success("注册账户成功，您可退出进行登录");
      }
      this.$refs["registerForm"].resetFields();
    },
    //注销账户
    delAccount(){
      this.$confirm("确定要注销账户吗？注销后将丢失账户的所有信息。")
        .then(async ()=>{
          await delAccount(this.account.id);
        })
      
    },

    //退出登录
    logout() {
      this.$store.commit("account/DEL_ACCOUNTINFO");
      this.$cookies.set("user_token", "");
      this.$cookies.set("account_token", "");
      this.$cookies.set("account_info", "");
      this.$router.replace("/login");
    },
  },
  mounted() {
    if (this.$store.state.account.accountInfo) {
      //直接赋值 会导致对象引用问题
      this.infoForm = { ...this.$store.state.account.accountInfo };
    } else {
      this.infoForm = {
        name: "name",
        gender: "女",
        signature: "这是一条有个性的签名",
      };
    }
    this.$bus.$on("isFreeLogin", (val) => {
      this.freeLogin = val;
    });

    this.$bus.$on("freeLogin", (val) => {
      this.freeLogin = val;
    });
  },
};
</script>

<!-- 公共样式-->
<style lang="scss" scoped>
.title {
  padding: 15px;
  background-color: var(--main-color2);
  p {
    font-weight: bold;
    color: var(--font-color3);
  }
  .des {
    color: var(--font-color2);
    margin-top: 5px;
  }
}
.formWrapper {
  margin: 0 auto;
  margin-top: 50px;
  width: 92%;

  border: 1px solid var(--main-color3);

  .el-form {
    width: 70%;
    padding: 15px;
  }
}
</style>

<style scoped lang="scss">
.wrapper {
  background-color: white;
  .top {
    padding: 10px;
    position: absolute;
    top: 0;
    height: 100px;
    width: 100%;
    border-bottom: 1px solid var(--main-color2);
    h2 {
      color: var(--font-color3);
    }
    .des {
      margin-top: 10px;
      color: var(--font-color2);
    }
  }

  .main {
    margin-top: 100px;
    padding-top: 30px;
    width: 100%;
    overflow-y: scroll;

    .account {
      height: 500px;
      margin-top: 10px;
    }
    .password {
      height: 500px;
      .el-input {
        width: 90%;
      }
      .code {
        .el-input {
          width: 72%;
        }
      }
    }

    .register {
      margin-bottom: 100px;
    }
  }
}
</style>
