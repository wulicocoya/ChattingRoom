<template>
  <div class="wrapper">
    <div class="top">
      <h2 class="title">新的联系人</h2>
     
    </div>
  
    <!-- 新的联系人展示 -->
    <div class="main">
      <div class="innerWrapper">
        <ul class="applicationList list">
          <li v-for="item in applicationList" :key="item.account2_id">
             <i class="el-icon-close" @click="delApply(item)"></i>
            <div class="avatar" @click="openProfile(item)">
              <el-avatar
                icon="el-icon-user-solid"
                :src="item.avatar"
              ></el-avatar>
            </div>
            <div class="nrBox">
              <div class="name">{{ item.name }}</div>
              <div class="reason">
              <span style="color:grey">附加信息:</span> 
              {{item.account2_id == myId?'已发送验证信息': item.apply_msg }}
              </div>
            </div>
            <div class="handle">
              <div class="applying" v-if="item.status == '已申请' && item.account2_id == myId">
                <el-button @click="refuseApply(item.account1_id)"
                  >拒绝</el-button
                >
                <el-button type="primary" @click="acceptApply(item.account1_id)"
                  >同意</el-button
                >
              </div>
              <div class="applying" v-else-if="item.status == '已申请' && item.account1_id == $store.state.account.accountInfo.id">
                <span>已申请</span>
              </div>
              <div class="accept" v-else-if="item.status == '已同意'">
                <span>已接受</span>
              </div>
              <div class="refuse" v-else>
                <span>已拒绝</span>
              </div>
            </div>
            <!-- <div
              class="profileWrapper"
              ref="profileWrapper"
              v-show="ProfileDetail"
            >
              <ProfileDetail />
            </div> -->
          </li>
        </ul>

        <!-- 分页 -->
        <el-pagination
          layout="prev, pager, next"
          :total="applicationList && applicationList.length"
          @current-change="handleCurrentChange"
          v-if="applicationList && applicationList.length > 6"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Introduction from "../../../components/Person/introduction.vue";
import ProfileDetail from "../../../components/Person/ProfileDetail.vue";
import { searchAccount, getApplication } from "../../../api/account";
import { acceptApply, refuseApply, delApply} from "../../../api/contacts";
export default {
  components: {
    Introduction,
    ProfileDetail,
  },
  data() {
    return {
      drawer: false,
      inputVal: "",
      loading: false,
      historySearch: "",
      searchList: [],
      friendDetail: false,
      reminder: "",
      ProfileDetail: false,
      applicationList: "",
      acceptBtn: false,
    };
  },
  computed:{
    myId(){
      return this.$store.state.account.accountInfo.id;
    }
  },
  methods: {
    //获取账户所有好友申请列表
    async getApplication() {
      const { data } = await getApplication();
      console.log(data);
      this.applicationList = data.list;
      this.applicationList.forEach((element) => {
        element.acceptBtn = false;
        element.refuseBtn = false;
        element.refuseRemind = "拒绝";
        element.acceptRemind = "接受";
      });
    },

    //模糊搜索账户
    async searchAccount() {
      if (
        this.inputVal.trim() == "" ||
        this.inputVal.length > 8 ||
        this.inputVal < 4
      ) {
        return this.$message.warning("请输入合法名称（4到8位）");
      }
      this.loading = true;
      const { data } = await searchAccount(this.inputVal);
      if (!data) {
        return (this.loading = false);
      }
      if (data && data.list) {
        this.searchList = data.list;
      }
      if (data.total == 0) {
        this.reminder = "没有搜到相关结果。";
      }
      this.historySearch = this.inputVal;
      this.inputVal = "";
      this.loading = false;
    },

    //实现分页搜索
    async handleCurrentChange(page) {
      this.loading = true;
      const { data } = await searchAccount(this.historySearch, page);
      if (data && data.list) {
        this.searchList = data.list;
      }
      this.loading = false;
    },

    //关drawer之前先将列表清空
    handleClose(done) {
      this.searchList = [];
      this.friendDetail = false;
      done();
    },

    //打开详情
    openDetail(item) {
      this.friendDetail = !this.friendDetail;
      this.$bus.$emit("personDetail", item);
    },

    //打开详情
    openProfile(item) {
      this.ProfileDetail = true;
      console.log(this.ProfileDetail);
      this.$bus.$emit("ProfileDetail", item);
    },

    handleClose2(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },

    //接受申请
    async acceptApply(id) {
      await acceptApply(id);
      this.status = "已同意";
    },

    //拒绝申请
    async refuseApply(id) {
      await refuseApply(id);
      this.status = "已拒绝";
    },

    //删除好友申请
    delApply(item){
      this.$confirm()
      .then(async ()=>{
      await delApply(item.account2_id);
      this.getApplication();
      })
      
    }
  },
  mounted() {
    this.getApplication();
    this.$bus.$on("closeDetail", (val) => {
      this.ProfileDetail = val;
    });
    document.addEventListener("click", (e) => {
      if (e.target.className != "profileWrapper") {
        this.ProfileDetail = false;
      }
    });
  },
  beforeDestroy() {
    this.$bus.$off("closeDetail");
  },
};
</script>

<style lang="scss" scoped>
// 抽屉样式设置
.el-drawer__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  .bac {
    width: 100%;
    height: 130px;
    border-bottom: 1px solid var(--main-color3);
  }
  .avatar {
    height: 200px;
    width: 200px;
    img {
      height: auto;
      width: 100%;
      max-height: 100%;
      border-radius: 50%;
    }
  }
  .name {
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
    // margin-top: 20px;
  }
}
</style>

<style scoped lang="scss">
.wrapper {
  background-color: var(--main-color);
  .top {
    padding: 10px;
    position: fixed;
    top: 0;
    height: 100px;
    width: 100%;
    border-bottom: 1px solid var(--main-color2);
    padding: 30px;
    .title {
      display: inline-block;
    }
    .el-button {
      position: absolute;
      // 怎么固定在靠右100px
      left: 700px;
    }
  }
  .myDrawer {
    padding: 10px;
    .remind {
      width: 180px;
      margin: 0 auto;
      margin-top: 10px;
    }
  }
  .list {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    li {
      position: relative;
      height: 80px;
      padding: 4px;
      padding-left: 30px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      border-bottom: 1px dotted #bbbffd;
      .el-icon-close{
        position: absolute;
        right: 38px;
        top: 6px;
        font-size: 20px;
        display: none;
        cursor: pointer;
      }
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
    li:hover  .el-icon-close{
      display: inline-block;
    }
    .el-pagination {
      margin: 0 auto;
    }
  }
  .main {
    margin-top: 100px;
    width: 100%;
    .innerWrapper {
      width: 100%;
      li {
        position: relative;
        .nrBox {
          margin-left: 10px;
          .reason {
            margin-left: 10px;
            font-size: 13px;
          }
        }
        .handle {
          position: absolute;
          right: 100px;
        }
      }
    }
  }
}
</style>
