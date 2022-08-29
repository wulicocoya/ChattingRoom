<template>
  <div class="wrapper">
    <div class="top">
      <h2 class="title">我的群组</h2>
      <el-button @click="drawer = true">创建群组</el-button>
    </div>
    <!-- 添加联系人drawer -->
    <el-drawer
      title="添加群组"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
    >
      <div class="myDrawer groupDrawer">
        <el-form>
          <el-form-item label="群名称">
            <el-input placeholder="输入群名称" v-model="groupInfo.name"> </el-input>
          </el-form-item>
          <el-form-item label="群描述">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="groupInfo.description">
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="群头像">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="groupInfo.imageUrl" :src="groupInfo.imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item> -->
          <!-- <el-form-item label="群成员">
            <el-menu default-active="1" class="el-menu-vertical-demo">
              <el-submenu index="1-4">
                <template slot="title">我的联系人</template>
                <el-menu-item
                  v-for="item in accountList"
                  :key="item.friend_info.account_id"
                >
                 <el-checkbox-group v-model="groupInfo.contacts">
                <el-checkbox>
                  <div class="accountItem">
                    <div class="avatar">
                      <el-avatar
                        icon="el-icon-user-solid"
                        :src="item.friend_info.avatar"
                      ></el-avatar>
                    </div>
                    <div class="name">{{ item.friend_info.name }}</div>
                  </div>
                </el-checkbox>
                 </el-checkbox-group>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-form-item> -->

          <el-form-item>
            <el-button type="primary" @click="createGroup">创建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <!-- 已有群组展示 -->
    <div class="main">
      <div class="innerWrapper">
        <ul class="groupList list">
          <li v-for="item in groupList" :key="item.relation_id"
          @click="toMsg(item)"
          >
            <div class="avatar">
              <el-avatar
                icon="el-icon-user-solid"
                :src="item.group_info.avatar"
              ></el-avatar>
            </div>
            <div class="name">{{ item.group_info.name }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllGroups } from "../../../api/account";
import { updateListShow} from '../../../api/contacts';
import {createGroup} from '../../../api/group'
export default {
  components: {},
  data() {
    return {
      groupList: "",
      drawer: false,
      inputVal: "",
      isCollapse: true,
      accountList: [],
      groupInfo:{
        name:"",
        description:""
      }
    };
  },
  methods: {
    //关drawer之前先将列表清空
    handleClose(done) {
      this.searchList = [];
      this.friendDetail = false;
      done();
    },
    

    //获取账户所有好友列表
    async getAllGroups() {
      const { data } = await getAllGroups();
      console.log(data);
      this.groupList = data.List;
      console.log(this.groupList);
    },

    //创建群组
    async createGroup(){
      this.drawer = false;
      const {data} = await createGroup(this.groupInfo);
      this.getAllGroups();
      
    },

    //更新聊天列表
    async updateListShow(is_show, id){
      await updateListShow(is_show, id);
    },
    
    toMsg(item){
      //更新列表
      this.updateListShow(true, item.relation_id);
      //点击跳转群聊
      this.$router.push({
        path:'/message',
        query:{
          id:item.relation_id
        }
      })
    }
    
  },
  mounted() {
    this.getAllGroups();
    this.$bus.$on("closeDetail", (val) => {
      this.ProfileDetail = val;
    });
  },
  beforeDestroy() {
    this.$bus.$off("closeDetail");
  },
};
</script>

<style lang="scss">
.groupDrawer {
  .el-form-item__label {
    float: none !important;
  }
  .el-submenu__title {
    width: 100%;
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
  //drawer设置
  .myDrawer {
    padding: 10px;
    .remind {
      width: 180px;
      margin: 0 auto;
      margin-top: 10px;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 100%;
      min-height: 300px;
    }
    .accountItem{
      display: flex;
      align-items: center;
    }
  }
  //已有群组展示
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

<style lang='scss'>
.groupList{
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
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
  }
}
</style>
