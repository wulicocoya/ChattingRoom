<template>
  <div class="notifyWrapper">
    <div class="topper">
      <div class="btn">
        <el-button type="primary" @click="drawer = true">发布新公告</el-button>
      </div>
    </div>

    <!-- 新公告抽屉 -->
    <el-drawer
      title="添加新公告"
      :visible.sync="drawer"
      direction="ltr"
      :before-close="handleClose"
    >
      <div class="myDrawer">
        <div class="textarea">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="msg_content"
          >
          </el-input>
          <!-- 实现@某人 待开发 -->
          <!-- <i class="iconfont icon-aite" @click="groupMemShow=true"></i> -->
        </div>
        <div class="confirm">
          <el-button @click="createNotify" type="primary">发布新公告</el-button>
        </div>
      </div>

      <!-- 选择@的人 -->
      <!-- <div class="groupMem" v-if="groupMemShow">
        <ChooseContact  />  
      </div> -->
    </el-drawer>
      
    <!-- 已有公告展示 -->
    <div class="reminder" v-if="!notifyList">还没有群公告哦</div>
    <div class="innerWrapper" v-else>
      
        <li v-for="(item, index) in notifyList" :key="item.id">
          <div class="contentWrapper" v-if="!item.editing">
            {{ item.msg_content }}
          </div>
          <el-input
            v-else
            :class="textarea"
            type="textarea"
            v-model="item.textarea"
            :ref="'num' + index"
          >
          </el-input>
          <div class="bottom">
            <div class="account bot">{{ item.friend_info.name }}</div>
            <div class="time bot">
              发表于&nbsp;&nbsp;{{ item.create_at | dateFormat }}
            </div>
            <div class="read bot">{{ item.read_ids.length }}已读</div>
            <!-- 后续补充：非群员不显示 -->
            <div class="del" @click="delNotify(item, index)">删除</div>
            <div class="edit" @click="edit(item, index)" v-if="!item.editing">
              编辑
            </div>
            <div class="edit" v-else>
              <el-button @click="item.editing = false">取消</el-button>
              <el-button @click="updateNotify(item)" type="primary"
                >发布新公告</el-button
              >
            </div>
          </div>
        </li>
     
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import {delNotify} from '../../../api/group'
import ChooseContact from "../../../components/Contact/ChooseContact.vue";
import {
  getNotify,
  createNotify,
  updateNotify,
  getGroupMembers,
} from "../../../api/group";
export default {
  name: "GroupNotify",
  components: {
    // ChooseContact
  },
  data() {
    return {
      notifyList: [],
      drawer: false,
      msg_content: "",
      msg_expand: {
        remind: [],
      },
      selectOne: "",
      groupMembers: [],
      idx: 0,
      groupMemShow: false,
      editingArr: [],
      groupMap: new Map(),
    };
  },
  methods: {
    //获取群公告
    async getNotify() {
      const { data } = await getNotify(this.currentChat.relation_id);
      this.notifyList = data.list;
      this.notifyList.forEach((element) => {
        this.$set(element, "editing", false);
        this.$set(element, "textarea", "");
        element.friend_info = this.groupMap.get(element.account_id);
        // element.editing = false;
        // element.textarea = '';
      });
      //新时间在上面
      this.notifyList.reverse();

    },

    //发送群公告
    async createNotify() {
      const { data } = await createNotify(
        this.msg_content,
        this.currentChat.relation_id
      );
      this.msg_content = "";
      this.drawer = false;

      this.getNotify();
    },

    //抽屉关闭
    handleClose(done) {
      done();
    },

    //编辑群公告
    edit(item, index) {
      this.notifyList[index].editing = true;
      item.textarea = item.msg_content;
      //获取光标
      this.$nextTick(() => {
        console.log(this.$refs["num" + index]);
        this.$refs["num" + index].focus();
      });

      // console.log(document.querySelectorAll(".textarea")[index]);
      // document.querySelectorAll(".textarea")[index].focus();
    },

    //更新群公告
    async updateNotify(item) {
      console.log(item.textarea);
      console.log(item.relation_id);
      await updateNotify(item.id, item.textarea, item.relation_id);
      this.getNotify();
      //或者直接修改content和extand
    },

    //删除群公告
    async delNotify(item,index) {
      this.$confirm("确定删除该群公告吗？")
        .then(async ()=>{
          const {data} = await delNotify(item.id, item.relation_id);
          if(!data){
            this.$message.success("已成功删除")
          }
           this.notifyList.splice(index,1);
        })
     
    },

    //获取群成员Map信息
    async getGroupMembers(id) {
      const { data } = await getGroupMembers(id);
      console.log(data);
      for (let item of data) {
        if (!this.groupMap.get(item.account_id)) {
          this.groupMap.set(item.account_id, item);
        }
      }
      console.log(this.groupMap);
    },
  },
  computed: {
    currentChat() {
      return this.$store.state.chat.currentChat;
    },
  },
  mounted() {
    this.$bus.$on("selectOne", (item) => {
      this.selectOne = item;
      //添加到文本框
      this.msg_content += "@" + item.name;
      //更改msg_extend
      this.idx++;
      var obj = {
        account_id: item.account_id,
        idx: this.idx,
      };
      console.log(obj);
      this.msg_expand.remind.push(obj);
      console.log(this.msg_expand.remind);
    });
    // this.$bus.$on("groupMap",(val)=>{
    // this.groupMap = val;
    // })
    this.getGroupMembers(this.$route.query.id);
    // this.testEditing = false;
    this.getNotify();

    // document.addEventListener("click", (e) => {
    //   if(e.target.className != 'groupMem'){
    //     this.groupMemShow = false;
    //   }
    // })
  },
  beforeDestroy() {
    this.$bus.$off("selectOne");
  },
  filters: {
    dateFormat(val) {
      if (dayjs(val).format("YY") == dayjs(new Date()).format("YY")) {
        return dayjs(val).format("MM-DD");
      } else {
        return dayjs(val).format("YY-MM-DD");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.notifyWrapper{
  position: relative;
  display: flex;
  height: 100%;
}
.topper {
  height: 100px;
  border-bottom: 1px solid var(--theme-color);
  width: 100%;
  position: absolute;
  top: 0px;
  background-color: var(--main-color);
  .btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 100px;
  }
}

// 抽屉样式设置
.myDrawer {
  position: relative;
  padding: 20px;
  .textarea {
    position: relative;
    .icon-aite {
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-size: 20px;
      cursor: pointer;
    }
    .icon-aite:hover {
      color: var(--theme-color2);
    }
  }
  .confirm {
    position: absolute;
    margin-top: 20px;
    right: 20px;
  }
}

//已有列表样式
.innerWrapper {
  width: 100%;
  padding: 20px;
  overflow-y:scroll;
  margin-top: 100px;
  li {
    margin-top: 20px;
    padding: 20px 40px;
    border: 1px solid var(--main-color3);
    .bottom {
      margin-top: 30px;
      position: relative;
      display: flex;
      .bot {
        margin-right: 10px;
        font-size: 13px;
      }
      .read {
        color: var(--theme-color2);
      }
      .edit {
        position: absolute;
        right: -3px;
        bottom: -7px;
        cursor: pointer;
        color: var(--theme-color2);
      }
      .edit:hover {
        color: var(--main-color3);
      }
      .del{
        position: absolute;
        right: 60px;
        bottom: -7px;
        cursor: pointer;
        color: var(--theme-color2);
      }
      .del:hover{
        color: var(--main-color3);
      }

    }
  }
}
</style>
