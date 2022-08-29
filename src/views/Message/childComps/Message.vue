<template>
  <div class="msgWrapper">
    <ul class="chatWrapper">
      <li v-for="item in msgList" :key="item.account_id">
        <div
          class="item-inner-wrapper"
          :class="
            item.account_id == myInfo.id ? 'right msgItem' : 'left msgItem'
          "
        >
          <!-- <div class="avatar">
                    <el-avatar
                    icon="el-icon-user-solid"
                    :src="item.account_id == myInfo.id? currentChat.friend_info.avatar:myInfo.avatar"
                    ></el-avatar>
                </div> -->
          <div class="msgInner">
            <div class="msg">
              <!-- 补充内容：文件消息 -->
              {{ item.msg_content }}
            </div>
            <!-- <div class="name">{{item.account_id == currentChat.friend_info.account_id? currentChat.friend_info.name:myInfo.name}}</div> -->
          </div>
        </div>
      </li>
    </ul>
    <!--下方fixed部分 -->
    <div class="bottom">
      <el-input placeholder="Enter Message..." v-model="inputVal"></el-input>
      <div class="emoticon icon">
        <el-button>
          <i class="iconfont icon-biaoqingbao"></i>
        </el-button>
      </div>

      <div class="at icon">
        <el-button>
          <i class="iconfont icon-aite"></i>
        </el-button>
      </div>

      <div class="send icon">
        <el-button type="primary" @click="sendMsg">
          <i class="iconfont icon-faxiaoxi"></i>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // props:['currentChat'],
  data() {
    return {
      msgList: [
        { msg_content: "hello", account_id: 23342 },
        { msg_content: "hello", account_id: 65863566753792 },
      ],
      inputVal:""
    };
  },
  computed: {
    myInfo() {
      //id还是account_id?
      if (this.$store.state.account.accountInfo) {
        return this.$store.state.account.accountInfo;
      } else {
        return { account_id: 20958324719616 };
      }
    },
    currentChat() {
      return this.$store.state.chat.currentChat;
    },
  },
  mounted() {
    console.log(this.$store.state.account.accountInfo);
  },
  methods:{
    sendMsg(){
      
    }
  }
};
</script>

<style lang="scss" scoped>
.msgWrapper {
  width: 100%;
  height: 100%;
  .chatWrapper {
    overflow-y: scroll;
    margin-bottom: 100px;

    li {
      clear: both;
      .item-inner-wrapper {
        display: inline-flex;
        padding: 10px;
        align-items: flex-end;
        .msgInner {
          margin-left: 7px;
          .msg {
            width: 100px;
            color: white;
            margin-left: 10px;
            margin-bottom: 10px;
            padding: 15px;
            position: relative;
            border-radius: 5px 5px 5px 0px;
            background-color: #7269ef;
          }
          .msg:before {
            content: "";
            border: 5px solid transparent;
            position: absolute;
            bottom: -10px;
            border-top-color: #7269ef;
          }

          .name {
            color: var(--font-color1);
          }
        }
      }
      .left {
        clear: both;
        .msgInner {
          .msg:before {
            content: "";
            left: 0px;
            border-left-color: #7269ef;
          }
        }
      }
      .right {
        float: right;
        align-items: flex-end;
        .avatar {
          float: right;
          order: 3;
          margin-left: 13px;
        }
        .msgInner {
          .msg {
            color: var(--font-color2);
            background-color: var(--main-color2);
          }
          .msg:before {
            content: "";
            border-right-color: var(--main-color2);
            border-top-color: var(--main-color2);
            right: 0px;
          }
          .name {
            text-align: right;
          }
        }
      }
    }
  }
   //下方样式
  .bottom {
    position: fixed;
    bottom: 0;
    display: flex;
    height: 100px;
    align-items: center;
    width: 1014px;
    padding: 10px;
    border-top: 1px solid var(--main-color3);
    .el-input {
      width: 80%;
      input {
        background-color: var(--main-color3) !important;
      }
      .el-button {
        button {
          transition: all 0.5s;
        }
      }
    }
    .icon {
      margin-left: 10px;
    }
  }
}
</style>



<style lang="scss">
.bottom {
  .el-input {
    input {
      background-color: var(--main-color3);
    }
  }
  .el-button {
    button {
      transition: all 1s !important;
    }
  }
}
</style>