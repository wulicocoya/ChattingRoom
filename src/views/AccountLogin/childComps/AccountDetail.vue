<template>
  <div class="wrapper">
    <ul class="infinite-list" v-infinite-scroll="load" style="overflow: auto">
      <li
        v-for="item in list"
        class="infinite-list-item"
        :key="item.key"
        @click="toPage(item)"
      >
        <div class="avatar">
          <el-avatar icon="el-icon-user-solid" :src="item.avatar"></el-avatar>
        </div>
        <div class="name">{{ item.name }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import {
  getAllAccount,
  getAccountToken,
  getAccountInfo,
} from "../../../api/account";
export default {
  data() {
    return {
      list: [],
      freeLogin: false,
    };
  },

  methods: {
    load() {
      this.count += 2;
    },
    async getAccountInfo(id, token) {
      const { data } = await getAccountInfo(id, token);
      if (this.freeLogin) {
        Cookies.set("account_info", JSON.stringify(data), { expires: 15 });
      } else {
        Cookies.set("account_info", JSON.stringify(data));
      }
      this.$store.commit("account/SET_ACCOUNTINFO", {
        account: data,
        freeLogin: this.freeLogin,
      });
    },

    //获取账户token+存储账户信息到store
    async getAccountToken(id) {
      const { data } = await getAccountToken(id);
      console.log(data);
      if (this.freeLogin) {
        Cookies.set(
          "account_token",
          JSON.stringify(data.account_token, { expires: 15 })
        );
        Cookies.set("account_id", id, { expires: 15 });
      } else {
        Cookies.set("account_token", JSON.stringify(data.account_token));
        Cookies.set("account_id", id);
      }
        this.getAccountInfo(id, data.account_token.token);
    },

    //跳转主页
    toPage(item) {
      //设置token
      this.getAccountToken(item.account_id);
      this.$message.success("正在进入主页中....请稍等");
      setTimeout(() => {
        this.$router.replace("/message");
      }, 3000);
    },

    //获取所有账户信息展示
    async getAllAccount() {
      const { data } = await getAllAccount();
      console.log(data);
      if (data.total !== 0) {
        this.list = data.list;
      }
    },
  },

  mounted() {
    this.getAllAccount();
    this.$bus.$on("isFreeLogin", (val) => {
      this.freeLogin = val;
    });
  },
  beforeDestroyed() {
    this.$bus.$off("isFreeLogin");
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  background-color: white;
  width: 1000px;
  height: 500px;
  box-shadow: 0 2px 6px 6px rgb(0 0 0 / 7%);
  margin: 0 auto;
  border-radius: 20px;
  margin-top: 100px;
  .infinite-list {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    li {
      height: 80px;
      cursor: pointer;
      padding: 4px;
      padding-left: 30px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      border-bottom: 1px dotted #bbbffd;
      .avatar {
        vertical-align: center;
        width: 50px;
        height: 50px;
        .el-avatar {
          border-radius: 50%;
          height: 100%;
          width: 100%;
        }
      }
      .name {
        margin-left: 10px;
      }
    }
    li:hover {
      background-color: rgba($color: #bbbffd, $alpha: 0.3);
    }
  }
}
</style>
