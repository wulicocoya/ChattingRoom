<template>
  <div class="leftWrapper">
    <!--上方头像 昵称部分 -->
    <div class="profile">
      <h1>Profile</h1>
      <div class="middle">
        <!-- <div class="avatar">
          <el-avatar
            :size="100"
            :src="accountInfo ? accountInfo.avatar : circleUrl"
          ></el-avatar>
          <div class="detail">
            <p>{{ accountInfo ? accountInfo.name : "name" }}</p>
            <p>{{ accountInfo.id }}</p>
          </div>
        </div> -->
        <div class="avatarWrapper">
          <el-upload
            class="avatar-uploader"
            action="https://chat.humraja.xyz/api/file/avatar"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
            :data={relation_id:0}
          >
            <img
              v-if="imageUrl || accountInfo.avatar"
              :src="imageUrl ? imageUrl : accountInfo.avatar"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="detail">
            <p>{{ accountInfo ? accountInfo.name : "name" }}</p>
            <p>{{ accountInfo.id }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <ul>
        <li>
          <div class="title">name</div>
          <div class="des">
            <span>{{ accountInfo ? accountInfo.name : "userName" }}</span>
            <i class="el-icon-user"></i>
          </div>
        </li>
        <li>
          <div class="title">gender</div>
          <div class="des">
            <span>{{ accountInfo ? accountInfo.gender : "女" }}</span>
            <i
              :class="
                accountInfo && accountInfo.gender == '男'
                  ? 'el-icon-male'
                  : 'el-icon-female'
              "
            ></i>
          </div>
        </li>
        <li>
          <div class="title">signature</div>
          <div class="des">
            <span>{{
              accountInfo ? accountInfo.signature : "这是一条有个性的签名"
            }}</span>
            <i class="el-icon-sunny"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: "LeftShow",
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      imageUrl: "",
      headers:{
         Authorization: this.$cookies.get("account_token")
        ? "Bearer " + JSON.parse(this.$cookies.get("account_token")).token
        : "",
      }
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(res);
      this.imageUrl = URL.createObjectURL(file.raw);
      this.accountInfo.avatar = this.imageUrl;
      this.$store.commit("account/SET_ACCOUNTINFO", {
            freeLogin: this.freeLogin,
            account: this.accountInfo,
          });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
  computed: {
    accountInfo: {
      get() {
        return this.$store.state.account.accountInfo;
      },
      set(val) {
        return val;
      },
    },
    freeLogin(){
      return this.$store.state.freeLogin.freeLogin;
    }
  },
  mounted() {
    this.accountInfo = this.$store.state.account.accountInfo;
    console.log(this.$store.state.account.accountInfo);
  },
};
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 23px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}}
</style>

<style lang="scss" scoped>
.leftWrapper {
  width: 600px;
  height: 100%;
  background-color: var(--main-color2);
  padding: 30px;
  .profile {
    height: 270px;
    border-bottom: 1px solid var(--theme-color);
    .middle {
      display: flex;
      padding-top: 10px;
      width: 100%;
      justify-content: center;
      .avatarWrapper {
        text-align: center;
        .detail {
          color: var(--font-color3);
          text-align: center;
          display: flex;
          flex-direction: column;
          p {
            margin-top: 10px;
            display: inline-block;
          }
        }
      }
    }
  }

  .bottom {
    ul {
      padding-top: 20px;
      li {
        padding: 10px;
        background-color: var(--main-color);
        height: 65px;
        border: 1px solid var(--main-color2);
        .title {
          font-size: 14px;
          color: var(--font-color2);
        }
        .des {
          position: relative;
          margin-top: 5px;
          color: var(--font-color3);
          i {
            position: absolute;
            right: 10px;
          }
        }
      }
    }
  }
}
</style>
