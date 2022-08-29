<template>
  <div class="introduction">
    <div class="bac"></div>
    <div class="avatar">
      <img :src="item && item.avatar" alt="" />
    </div>
    <p class="name">{{ item && item.name }}</p>
    <div class="message" @click="toMsg(item)">
      <i class="el-icon-chat-line-square"></i>
      消息
    </div>

    <!-- <div class="remark" v-if="item && item.relationID != 0">
      <span class="editTitle">备注与描述</span>
      <span class="edit">{{item && item.nick_name}}</span>
      <i class="el-icon-arrow-right"></i>
    </div> -->
    <div class="account_id">账户号：{{ item.account_id }}</div>
    <el-button
      type="primary"
      @click="buttonShow = false"
      v-if="buttonShow && item && item.relation_id == 0"
      >添加联系人</el-button
    >
    <div class="change" v-if="!buttonShow">
      <el-input v-model="addReason"></el-input>
      <el-button type="primary" @click="addFriend">发送</el-button>
    </div>
  </div>
</template>

<script>
import {addFriend} from '../../api/contacts'
export default {
  data() {
    return {
      item: null,
      buttonShow:true,
      addReason:''
      // item:{
      //   name:"name",
      //   avatar:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      //   relationID:0,
      // }
    };
  },
  // props:['item'],
  created() {
    //调事件 赋值item
    this.$bus.$on("personDetail", (item) => {
      console.log(item);
      this.item = item;
    });
    console.log(this.item);
  },
  methods: {
    async addFriend() {
      await addFriend(this.item.account_id, this.addReason);
      this.$message.success("申请成功");
    },
    toMsg(item){
      console.log(item);
       this.$router.push({
        path:"/message",
        query:{
          id:item.relation_id
        }
      })
      this.$store.commit("chat/SET_CURRENT", item);
    }
  },
};
</script>

<style scoped lang="scss">
.introduction {
  height: 440px;
  width: 320px;
  border-radius: 20px;
  background-color: var(--main-color3);
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--font-color2);
  .bac {
    width: 100%;
    height: 130px;
    border-bottom: 1px solid var(--main-color3);
  }
  .avatar {
    transform: translateY(-50px);
    height: 100px;
    width: 100px;
    img {
      height: auto;
      width: 100%;
      max-height: 100%;
      border-radius: 50%;
    }
  }
  .name {
    margin-top: -40px;
    font-size: 24px;
    font-weight: bold;
  }
  .account_id {
    margin-top: 10px;
  }
  .message {
    margin-top: 10px;
    height: 40px;
    width: 120px;
    line-height: 40px;
    text-align: center;
    border-radius: 50px;
    cursor: pointer;
    background-color: var(--main-color2);
  }
  .message:hover {
    background-color: white;
  }
  .remark {
    margin-top: 10px;
    border-bottom: 1px solid var(--main-color2);
    .editTitle {
      display: inline-block;
    }
    .edit {
      display: inline-block;
      margin-left: 30px;
      font-size: 13px;
      cursor: pointer;
    }
  }
  .el-button {
    margin-top: 20px;
  }
  .change{
    display: flex;
    margin-top: 20px;
    .el-button{
      margin-top:0px;
    }
  }
}
</style>
