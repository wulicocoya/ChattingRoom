<template>
  <div class="wrapper">
    <LeftShow />
    <Chatting />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import Chatting from "./childComps/Chatting.vue";
import LeftShow from "./childComps/LeftShow.vue";
export default {
  name: "MessagePart",
  components: {
    Chatting,
    LeftShow,
  },
  mounted() {
   console.log(JSON.parse(Cookies.get("account_token")).token);
  },
 
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  width: 100%;
}
</style>
