<template>
  <div class="wrapper">
    <div class="initial" v-if="!currentChat">找个人开始聊天吧~</div>
    <!-- v-else -->
    <template v-else>
      <div class="topper">
        <div class="firstLine">
          <!-- <div class="avatar">
          <el-avatar
            icon="el-icon-user-solid"
            :src="
              currentChat && currentChat.relation_type == 'friend'
                ? currentChat.friend_info.avatar
                : currentChat.group
                +_info.avatar
            "
          ></el-avatar>
        </div> -->
          <div class="name">
            {{
              currentChat && currentChat.relation_type == "friend"
                ? currentChat.friend_info.name
                : currentChat.group_info.name
            }}
          </div>
          <div class="icons">
            <i class="el-icon-search" @click="accountSearch = true"></i>
            <i
              class="el-icon-more"
              v-if="currentChat && currentChat.relation_type == 'group'"
              @click="SettingDrawer = true"
            ></i>
          </div>
        </div>
        <div class="secondLine">
          <router-link
            :to="{
              path: '/message/chat',
              query: {
                id: this.$route.query.id,
              },
            }"
          >
            <i class="el-icon-chat-dot-round"></i>
            消息
          </router-link>
          <router-link
            v-if="currentChat && currentChat.relation_type == 'group'"
            :to="{
              path: '/message/groupNotify',
              query: {
                id: this.$route.query.id,
              },
            }"
            class="notify"
          >
            <i class="iconfont icon-gonggao"></i>
            群公告</router-link
          >
        </div>
      </div>
      <!-- 搜索抽屉 -->
      <el-drawer
        title="搜索会话内容"
        :visible.sync="accountSearch"
        direction="rtl"
        :before-close="handleClose"
      >
        <div class="myDrawer">
          <el-input
            placeholder="搜索"
            v-model="inputVal"
            @keyup.enter.native="searchMsg()"
          ></el-input>
          <ul class="searchList list" v-if="searchList">
            <li v-for="item in searchList" :key="item.id">
              <div class="showList" @click="openDetail(item)">
                <div class="avatarName">
                  <div class="avatar">
                    <el-avatar
                      icon="el-icon-user-solid"
                      :src="item.friend_info.avatar"
                    ></el-avatar>
                  </div>
                  <div class="name">{{ item.friend_info.name }}</div>
                  <div class="time">{{ item.create_at }}</div>
                </div>
                <div class="msg">{{ item.msg_content }}</div>
              </div>
            </li>
          </ul>
          <!-- 分页 -->
          <el-pagination
            layout="prev, pager, next"
            :total="searchList && searchList.length"
            @current-change="handleCurrentChange"
            v-if="searchList && searchList.length"
          >
          </el-pagination>
          <div class="remind" v-else>{{ reminder }}</div>
        </div>
      </el-drawer>

      <!-- 群组设置抽屉 -->
      <el-drawer
        title="设置"
        :visible.sync="SettingDrawer"
        direction="rtl"
        :before-close="handleClose"
      >
        <div
          class="groupSetting"
          v-if="currentChat && currentChat.relation_type == 'group'"
        >
          <ul>
            <li class="show">
              <div class="avatar">
                <el-avatar
                  icon="el-icon-user-solid"
                  :src="
                    currentChat &&
                    currentChat.group_info &&
                    currentChat.group_info.avatar
                  "
                ></el-avatar>
                <div class="name">
                  {{
                    currentChat &&
                    currentChat.group_info &&
                    currentChat.group_info.name
                  }}
                </div>
              </div>
              <i class="el-icon-arrow-right" @click="innerDrawer = true"></i>
            </li>
            <!-- 群消息设置 -->
            <el-drawer
              title="编辑群信息"
              :append-to-body="true"
              :before-close="handleClose"
              :visible.sync="innerDrawer"
              class="innerDrawer"
            >
              <el-form
                ref="form"
                :model="edit"
                label-position="top"
                class="editForm"
              >
                <el-form-item label="群头像"> </el-form-item>
                <el-form-item label="群名称">
                  <div class="name" v-if="!editName">
                    {{ editSignature.name }}
                    <i
                      class="el-icon-edit-outline"
                      @click="editName = true"
                    ></i>
                  </div>
                  <div class="textarea" v-else>
                    <el-input
                      type="textarea"
                      v-model="edit.name"
                    ></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="群简介">
                  <div class="signature" v-if="!editSignature">
                    {{ edit.signature && edit.signature }}
                    <i
                      class="el-icon-edit-outline"
                      @click="editSignature = true"
                    ></i>
                  </div>
                  <div class="textarea" v-else>
                    <el-input
                      type="textarea"
                      v-model="edit.signature"
                    ></el-input>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button @click="toInitial">取消</el-button>
                  <el-button @click="submitEdit" type="primary"
                    >确定修改</el-button
                  >
                </el-form-item>
              </el-form>
            </el-drawer>
            <li class="member">
              <h3>群成员</h3>
              <div class="avatars">
                <div
                  v-for="item in groupMembers"
                  :key="item.account_id"
                  class="avatarItem"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.name && item.name"
                    placement="top"
                  >
                    <el-avatar
                      icon="el-icon-user-solid"
                      :src="item.avatar"
                    ></el-avatar>
                  </el-tooltip>
                </div>
                <!-- 添加群成员 -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="添加群成员"
                  placement="top"
                >
                  <i class="iconfont icon-tianjia" @click="openContact"></i>
                </el-tooltip>

                <div class="contactShow" v-if="contactShow">
                  <!-- 固定定位 这样就不局限于父元素了 -->
                  <ContactList :groupMap="groupMap" />
                </div>
              </div>
            </li>
            <li class="set">
              <div class="setting">
                <input
                  type="checkbox"
                  id="is_not_disturb"
                  @click="updateDisturb"
                  v-model="currentChat.is_not_disturb"
                />
                <label for="is_not_disturb">消息免打扰</label>
              </div>
              <div class="setting">
                <input
                  type="checkbox"
                  id="is_pin"
                  @click="updatePin"
                  v-model="currentChat.is_pin"
                />
                <label for="is_pin">添加到标记</label>
              </div>
              <div class="setting">
                <input
                  type="checkbox"
                  id="is_show"
                  @click="updateListShow"
                  v-model="currentChat.is_show"
                />
                <label for="is_pin">显示在首页列表</label>
              </div>
            </li>
            <li class="del">
              <el-button @click="quitGroup">退出群组</el-button>
              <el-button
                type="primary"
                v-if="accountInfo.account_id == groupLeader.account_id"
                @click="dissolveGroup"
                >解散群组</el-button
              >
            </li>
            <!-- 选择转让群联系人 -->
            <div class="chooseShow" v-if="chooseShow">
              <ChooseContact />
            </div>
          </ul>
        </div>
      </el-drawer>

      <div class="chatBody">
        <router-view></router-view>
      </div>
    </template>
    <!-- 上方fixed部分 -->
  </div>
</template>

<script>
import ContactList from "../../../components/Contact/ContactsList.vue";
import ChooseContact from "../../../components/Contact/ChooseContact";
import {
  updateDisturb,
  updatePin,
  updateListShow,
} from "../../../api/contacts";
import { getMsgList, searchMsg } from "../../../api/message";
import {
  getGroupMembers,
  quitGroup,
  dissolveGroup,
  inviteFriends,
  transferGroup,
} from "../../../api/group";
import Message from "../childComps/Message.vue";

export default {
  data() {
    return {
      inputVal: "",
      msgList: "",
      isInitial: true,
      socket: "",
      chat: "",
      SettingDrawer: false,
      accountSearch: false,
      searchList: [],
      //群成员信息和id的映射关系
      groupMap: new Map(),
      historySearch: "",
      reminder: "",
      groupMembers: [],
      //群主
      groupLeader: "",
      contactShow: false,
      //选中联系人
      selectList: [],
      chooseShow: false,
      selectOne: "",
      edit: {
        group_info: {
          name: "",
          signature: "",
        },
      },
      innerDrawer: false,
      editName: false,
      editSignature: false,
    };
  },
  watch: {
    // "$route.query.id"(to) {
    //   console.log(to);
    //   if (!to) {
    //     this.isInitial = true;
    //   } else {
    //     this.isInitial = false;
    //     this.getGroupMembers(to);
    //     // this.getMsgList(new Date(), to);
    //   }
    // },
  },
  components: {
    Message,
    ContactList,
    ChooseContact,
  },
  computed: {
    currentChat() {
      return this.$store.state.chat.currentChat;
    },
    accountInfo() {
      return this.$store.state.account.accountInfo;
    },
  },

  mounted() {
    let token = JSON.parse(this.$cookies.get("account_token")).token;
    console.log(token);
    // 连接
    // this.$socket.connect();
    // this.$socket.emit("auth", token, function (data) {
    //   console.log("recv:" + data);
    // });

    //  chat.emit("auth", token, function (data) {
    //         console.log("recv:" + data);
    //     });

    //      socket.on("auth", function (sendAckCb) {
    //     console.log("auth_1")
    //     sendAckCb("connect");
    //     console.log("auth_2")
    // });

    // chat.on("test", function (msg) {
    //     console.log("chat_test_1")
    //     console.log("recv:" + msg)
    //     console.log("chat_test_2")
    // })

    // this.$socket.open();

    //根据query中的id渲染item
    if (!this.$route.query.id) {
      this.isInitial = true;
    } else {
      this.isInitial = false;
      this.getGroupMembers(this.$route.query.id);
    }

    //选中联系人的回调
    this.$bus.$on("select", (val) => {
      this.contactShow = false;
      this.selectList = val;
      console.log(this.selectList);
      this.inviteFriends();
    });

    //点击其他地方 联系人列表消失
    document.addEventListener("click", function (event) {
      if (event.target.className != "contactShow") {
        this.contactShow = false;
      }
      if (event.target.className != "chooseShow") {
        this.chooseShow = false;
      }
    });

    this.$bus.$on("updateChat", (item) => {
      this.getGroupMembers(item.relation_id);
    });

    this.$bus.$on("cancelSelect", () => {
      this.contactShow = false;
    });

    this.$bus.$on("selectOne", async (val) => {
      this.selectOne = val;
      //转群
      await transferGroup(
        this.currentChat.relation_id,
        this.selectOne.account_id
      );
      await dissolveGroup(this.currentChat.relation_id);
      this.SettingDrawer = false;
      this.$router.replace("/message");
      this.$bus.$emit("updateMsgList");
    });

    this.$bus.$on("cancelSelectOne", () => {
      this.chooseShow = false;
    });
    if (this.$store.state.chat.currentChat) {
      this.edit = this.$store.state.chat.currentChat.group_info;
      if(!this.edit.signature){
        this.edit.signature = '';
      }
    } else {
      this.edit = {
          name: "",
          signature: "",
      };
    }
    console.log(this.edit);
  },

  beforeDestroy() {
    this.$bus.$off("updateChat");
    this.$bus.$off("cancelSelect");
    this.$bus.$off("select");
    this.$bus.$off("selectOne");
    // this.$nextTick(()=>{
    //   this.$bus.$emit("groupMap", this.groupMap);
    // })
  },

  methods: {
    sendMsg() {
      // this.$socket.emit(
      //   "test",
      //   JSON.stringify({ name: "raja", age: "20" }),
      //   function (data) {
      //     console.log("recv:" + data);
      //   }
      // );
    },

    //根据时间戳获取消息
    async getMsgList(lastTime, id) {
      console.log(lastTime, id);
      const { data } = await getMsgList(lastTime, id);
      console.log(data);
    },
    handleClose(done) {
      this.contactShow = false;
      this.chooseShow = false;
      //不加done退不出的
      done();
    },
    //搜索消息
    async searchMsg() {
      const { data } = await searchMsg(
        this.inputVal,
        this.currentChat.relation_id
      );
      if (data && data.list) {
        this.searchList = data.list;
      }
      if (data.total == 0) {
        this.reminder = "没有搜到相关结果。";
      }
      this.historySearch = this.inputVal;
      this.inputVal = "";
      //先处理数据
      this.searchList = data.list;
      for (let item in this.searchList) {
        item["group_info"] = this.groupMap[item.account_id];
      }
    },
    //实现分页搜索
    async handleCurrentChange(page) {
      this.loading = true;
      const { data } = await searchMsg(this.historySearch, page);
      if (data && data.list) {
        this.searchList = data.list;
      }
      this.loading = false;
    },
    //获取群成员
    async getGroupMembers(id) {
      if (this.currentChat && this.currentChat.relation_type == "group") {
        const { data } = await getGroupMembers(id);
        console.log(data);
        this.groupMembers = data;
        for (let item of this.groupMembers) {
          if (!this.groupMap.get(item.account_id)) {
            this.groupMap.set(item.account_id, item);
          }
          if (item.is_leader) {
            this.groupLeader = item;
            console.log("groupLeader", item);
          }
        }
        //获取不到数据不知道为什么啊啊哭了
        this.$bus.$emit("groupMembers", this.groupMembers);
        this.$bus.$emit("groupMap", this.groupMap);
      }
    },
    //打开联系人弹框
    openContact() {
      this.contactShow = true;
      //选中列表清零
      this.selectList = null;
    },
    //退出群聊
    quitGroup() {
      //群主的情况
      if (this.accountInfo.account_id == this.groupLeader.account_id) {
        //只有一个人则直接解散群组
        if (this.groupMembers.length == 1) {
          //解散群
          return this.$confirm(
            "群组没有其他群成员，退出群组将解散本群，你将无法查看聊天记录。",
            {
              type: "warning",
            }
          )
            .then(async () => {
              await dissolveGroup(this.currentChat.relation_id);
              this.SettingDrawer = false;
              this.$router.replace("/message");
              this.$bus.$emit("updateMsgList");
            })
            .catch(() => {});
        } else {
          return this.$confirm(
            "您是群主，退群前需要将群主转让其他群成员或者选择直接解散群组",
            "提示",
            {
              confirmButtonText: "转让群主",
              cancelButtonText: "取消",
              customClass: "del-model",
              type: "warning",
            }
          )
            .then(async () => {
              //出现选择联系人弹框
              this.chooseShow = true;
              //全部联系人以及确认框
            })
            .catch(() => {});
        }
      }

      this.$confirm("确认退出群聊吗？退出后你将不会接受到该群聊的任何消息", {
        type: "warning",
      })
        .then(async () => {
          const { data } = await quitGroup(
            this.accountInfo.id,
            this.currentChat.relation_id
          );
          this.SettingDrawer = false;
          if (!data) {
            this.$message.success("已成功退出");
          }

          this.$router.replace("/message");
          this.$bus.$emit("updateMsgList");
        })
        .catch(() => {});
    },

    //解散群组
    async dissolveGroup() {
      this.$confirm("解散会移除所有群成员，并且无法再查看历史记录").then(
        async () => {
          await dissolveGroup(this.currentChat.relation_id);
        }
      );
    },

    //邀请人入群
    async inviteFriends() {
      var paramArr = [];
      this.selectList.forEach((item) => {
        paramArr.push(item.friend_info.account_id);
      });
      const { data } = await inviteFriends(
        paramArr,
        this.currentChat.relation_id
      );
      // if (data.invite_member.length != 0) {
        // 显示邀请进群的群消息
        this.$message.success("成功邀请");
        this.getGroupMembers(this.$route.query.id);
      // }
    },
    //设置免打扰
    async updateDisturb() {
      this.currentChat.is_not_disturb = !this.currentChat.is_not_disturb;
      await updateDisturb(
        this.currentChat.is_not_disturb,
        this.currentChat.relation_id
      );
      
    },

    //设置pin
    async updatePin() {
      this.currentChat.is_pin = !this.currentChat.is_pin;
      await updatePin(this.currentChat.is_pin);
    },

    //设置是否显示在首页列表
    async updateListShow() {
      this.currentChat.is_show = !this.currentChat.is_show;
      await updateListShow(this.currentChat.is_show);
    },

    //提交编辑
    submitEdit() {
      console.log(this.edit.group_info.name, this.edit.group_info.signature);
      // await submitEdit(currentChat.name, )
    },

    //恢复初始
    toInitial() {
      this.editName = false;
      this.editSignature = false;
      if(!this.currentChat.group_info.signature){
        this.currentChat.group_info.signature = '';
      }
      this.edit = {...this.currentChat};
    },
  },
};
</script>
<style lang="scss">
.innerDrawer {
  .el-drawer__body {
    padding-left: 20px;
  }
  .el-form--label-top .el-form-item__label {
    font-weight: bold;
  }
  .el-drawer__header {
    span {
      font-size: 20px;
      font-weight: bold;
    }
  }
}
</style>

<style scoped lang="scss">
.wrapper {
  background-color: white;
  display: flex;
  width: 100%;
  .topper {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    padding: 20px 40px;
    height: 90px;
    border-bottom: 1px solid var(--main-color3);
    width: 1014px;
    .firstLine {
      .name {
        margin-left: 10px;
        flex: 1;
      }
      .icons {
        position: absolute;
        right: 30px;
        cursor: pointer;
        i {
          margin-left: 20px;
        }
      }
    }
    .secondLine {
      display: flex;
      margin-top: 10px;
      .notify {
        margin-left: 10px;
      }
    }
  }
  .myDrawer {
    padding: 10px;
  }
  .chatBody {
    width: 100%;
    margin-top: 90px;
    flex: 1;
  }
  .groupSetting {
    border-top: 1px solid var(--main-color3);
    padding: 20px;
    .show {
      position: relative;
      .avatar {
        display: flex;
        align-items: center;
        .name {
          margin-left: 10px;
          display: flex;
        }
      }
      i {
        position: absolute;
        right: 50px;
        top: 30px;
        cursor: pointer;
      }
    }
    .innerDrawer {
      .el-drawer__body {
        padding-left: 20px;
      }
    }
    li {
      padding: 20px;
      border-bottom: 1px solid var(--main-color3);
      .avatars {
        margin-top: 4px;
      }
    }
    .member {
      .avatars {
        display: flex;
        .avatarItem {
          margin-left: 5px;
        }
        i {
          font-size: 40px;
          margin-left: 5px;
          color: var(--main-color3);
          cursor: pointer;
        }
      }
    }
    .set {
      .setting {
        height: 30px;
        line-height: 30px;
        label {
          margin-left: 10px;
        }
      }
    }
    .del {
      margin-top: 100px;
      border-bottom: none;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
