<template>
  <div class="wrapper">
    <div class="top">
      <h2 class="title">我的联系人</h2>
      <el-button @click="drawer = true">添加新的联系人</el-button>
    </div>
    <!-- 添加联系人drawer -->
    <el-drawer
      title="添加联系人"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
    >
      <div class="myDrawer" v-loading="loading">
        <el-input
          placeholder="搜索名称"
          v-model="inputVal"
          @keyup.enter.native="searchAccount(inputVal)"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchAccount(inputVal)"
          ></el-button>
        </el-input>
        <ul class="searchList list">
          <li v-for="item in searchList" :key="item.account_id">
            <div class="showList" @click="openDetail(item)">
              <div class="avatar">
                <el-avatar
                  icon="el-icon-user-solid"
                  :src="item.avatar"
                ></el-avatar>
              </div>
              <div class="accountID">
                {{ item.name }}&nbsp;({{ item.account_id }})
              </div>
            </div>
            <Introduction v-show="friendDetail" />
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

    <!-- 已有联系人展示 -->
    <div class="main">
      <div class="innerWrapper">
        <ul class="accountList list">
          <li
            v-for="item in accountList"
            :key="item.friend_info.account_id"
            @click.stop="openProfile(item)"
          >
            <div class="avatar">
              <el-avatar
                icon="el-icon-user-solid"
                :src="item.friend_info.avatar"
              ></el-avatar>
            </div>
            <div class="name">{{ item.friend_info.name }}</div>
            <div
              class="profileWrapper"
              ref="profileWrapper"
              v-show="ProfileDetail"
            >
              <ProfileDetail />
            </div>
          </li>
        </ul>

        <!-- 分页 -->
        <el-pagination
          layout="prev, pager, next"
          :total="accountList && accountList.length"
          @current-change="handleCurrentChange"
          v-if="accountList && accountList.length > 6"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Introduction from "../../../components/Person/introduction.vue";
import ProfileDetail from "../../../components/Person/ProfileDetail.vue";
import { searchAccount, getAllFriends } from "../../../api/account";
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
      accountList: [
        {
          friend_info: {
            account_id: "323123131",
            avatar: "",
            name: "name",
          },
          is_not_disturb: false,
          is_pin: false,
          is_show: false,
          nick_name: "nick_name",
          relation_id: "33", //关系ID
          relation_type: "",
        },
      ],
      reminder: "",
      cnt: 0,
      ProfileDetail: false,
    };
  },
  methods: {
    //获取账户所有好友列表
    async getAllFriends() {
      const { data } = await getAllFriends();
      this.accountList = data.list;
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
      console.log("看我进来");
      this.ProfileDetail = true;
      this.$bus.$emit("ProfileDetail", item);
    },

    handleClose2(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },

    hideProfile(e) {
      console.log(e.target.className);
      if (e.target.className != "profileWrapper") {
        this.ProfileDetail = false;
      }
    },

    
  },
  mounted() {
    this.getAllFriends();
    this.$bus.$on("closeDetail", (val) => {
      this.ProfileDetail = val;
    }),
      console.log(document);
    document.addEventListener("click", this.hideProfile);
  },
  beforeDestroy() {
    this.$bus.$off("closeDetail");
    document.removeEventListener("click",this.hideProfile);
  },
};
</script>

<style lang="scss" scoped>
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
    .showList{
      display: flex;
      align-items: center;
      .accountID{
        margin-left: 10px;
        
      }
    }
  }
  .list {
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
    .el-pagination {
      margin: 0 auto;
    }
  }
  .main {
    margin-top: 100px;
    width: 100%;
    .innerWrapper {
      width: 100%;
    }
    .friendDrawer {
      display: flex;
    }
  }
}
</style>
