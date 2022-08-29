<template>
  <div class="wrapper">
    <RegisterA v-if="registerAccount" />
    <AccountShow :list="list" v-else />
  </div>
</template>

<script>
import RegisterA from "./childComps/RegisterA.vue";
import AccountShow from "./childComps/AccountShow.vue";
import { getAllAccount } from "../../api/account";
export default {
  components: { RegisterA, AccountShow },
  data() {
    return {
      list: null,
      registerAccount: false,
    };
  },
  computed: {
    // ...mapState("user", ["userInfo"]),
  },
  methods: {
    //获取所有账户信息展示
    async getAllAccount() {
      const { data } = await getAllAccount();
      console.log(data);
      if (data.total == 0) {
        return (this.registerAccount = true);
      }
      this.$bus.$emit("showAccount", data.list);
      this.list = data.list;
      console.log(this.list);
    },
  },
  mounted() {
    this.getAllAccount();
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: white;
  width: 1000px;
  height: 500px;
  box-shadow: 0 2px 6px 6px rgb(0 0 0 / 7%);
  margin: 0 auto;
  border-radius: 20px;
  margin-top: 100px;
  overflow: hidden;
}
</style>
