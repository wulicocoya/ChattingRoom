<template>
  <div class="profileDetail">
    <div class="bac">
      <i v-if="item.friend_info.account_id != myID"
      class="el-icon-more" 
      @click="optionShow = !optionShow" ></i>
      <div class="options" v-if="optionShow">
        <ul>
          <li class="first" @click="disturb(item.is_not_disturb)"><i class="iconfont icon-pingbi"></i>
            {{item.is_not_disturb?"解除屏蔽":"屏蔽用户"}}</li>
          <li  @click="hideAccount(item.is_show)"
          ><i class="iconfont icon-yincang"></i>
            {{item.is_show?"隐藏用户":"取消隐藏"}}</li>
          <li class="end" @click="delAccount(item)"><i class="iconfont icon-shanchu"></i>
            删除好友</li>
        </ul>
      </div>
    </div>
    <div class="avatar">
      <img :src="item && item.friend_info && item.friend_info.avatar" alt="" />
    </div>
    <p class="name">{{ item && item.friend_info && item.friend_info.name }}</p>
    <div class="message" @click="toMsg(item)">
      <i class="el-icon-chat-line-square"></i>
      消息
    </div>
    <!-- 不是自己则显示 -->
    <!-- v-if="myID != item.friend_info.account_id" -->
    <div class="remark">
      <span class="editTitle">备注与描述</span>
      <input type="text" class="editInput" :placeholder="item.nick_name?item.nick_name:'编辑内容'" v-model="inputValue"
      @blur="submitEdit" />
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="account_id">
      账户号：{{ item && item.friend_info.account_id }}
    </div>
  </div>
</template>

<script>
import {setEdit} from '../../api/setting'
import {updateDisturb, hideAccount, delAccount, updateListShow} from '../../api/contacts'
export default {
  data() {
    return {
      item: {
        friend_info: {
          name: "name",
          avatar:
            "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
          relationID: 0,
        },
        nick_name:""
      },
      inputShow: false,
      inputValue: "",
      show:true,
      optionShow:false
    };
  },
  // props:['item'],
  //不能是mounted否则无法正常渲染
  created() {
    //调事件 赋值item
    this.$bus.$on("ProfileDetail", (item) => {
      this.item = item;
      console.log(item);
    });
  },
  computed: {
    myID() {
      return this.$store.state.account.accountInfo.id;
    },
  },
  methods: {
    async submitEdit(){
      console.log(this.inputValue);
      if(!this.inputValue) return this.inputValue = "";
      if(this.inputValue == this.item.nick_name) return this.inputValue = "";
      const {data} = await setEdit(this.inputValue, this.item.relation_id);
      console.log(data);
      this.item.nick_name = this.inputValue;
      this.inputValue = "";
    },
    //免打扰设置
     disturb(disturb){
      console.log(disturb);
      //取消屏蔽
      if(!disturb){
         this.$confirm('确定屏蔽该用户吗？屏蔽后你们将无法正常聊天')
          .then(async () => {
            this.item.is_not_disturb = !this.item.is_not_disturb;
            const {data} = await updateDisturb(this.item.is_not_disturb , this.item.relation_id);
            done();
          })
          .catch(() => {});
      }else{
        this.$confirm('确定取消屏蔽该用户吗？取消屏蔽后你们将恢复正常聊天')
          .then(async () => {
            this.item.is_not_disturb = !this.item.is_not_disturb;
            const {data} = await updateDisturb(this.item.is_not_disturb , this.item.relation_id);
            done();
          })
          .catch(() => {});
      }
     
     },
     //隐藏设置
     hideAccount(show){
       if(show){
         this.$confirm('确定隐藏该用户吗？隐藏后你将无法在首页列表找到该用户')
          .then(async () => {
            this.item.is_show = !this.item.is_show;
            await hideAccount(this.item.is_show , this.item.relation_id);
          
          })
          .catch(() => {});
      }else{
        this.$confirm('确定取消隐藏该用户吗？取消隐藏用户会正常显示在首页列表')
          .then(async () => {
            this.item.is_show = !this.item.is_show;
            await hideAccount(this.item.is_show , this.item.relation_id);
          
          })
          .catch(() => {});
      }
    },
    //删除好友
    delAccount(){
         this.$confirm('确定删除该用户吗？删除后对方将从你的好友列表中移除')
          .then(async () => {
            await delAccount(this.item.relation_id);
            
          })
          .catch(() => {});
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
  mounted(){
    console.log(this.$store.state.account.accountInfo);
    console.log(this.myID);
  },
};
</script>

<style scoped lang="scss">
.profileDetail {
  height: 440px;
  width: 320px;
  border-radius: 20px;
  background-color: var(--main-color);
  position: fixed;
  pointer-events:auto;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--font-color2);
  box-shadow: 1px 1px 8px 0px rgba(0, 0, 0, 0.2);
  .bac {
    width: 100%;
    height: 130px;
    border-radius: 20px 20px 0px 0px;
    border-bottom: 1px solid var(--main-color3);
    position: relative;
    .el-icon-more{
      position: absolute;
      right: 15px;
      top: 10px;
    }
    .options{
      position: absolute;
      right: 10px;
      top: 30px;
      z-index: 60;
      display: inline-block;
      border: 1px solid var(--main-color2);
      border-radius: 10px;
      box-shadow: 1px 1px 8px 0px rgba(0, 0, 0, 0.2);
      li{
        background-color: var(--main-color);
        padding: 5px;
         border: 1px solid var(--main-color3);
      }
      li:hover{
        background-color: var(--main-color2);
      }
      .first{
        border-radius: 10px 10px 0px 0px;
      }
      .end{
        border-radius: 0px 0px 10px 10px;
      }
    }
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
    .editInput {
      margin-left: 10px;
      width: 100px;
      border: none;
      background-color: var(--main-color2);
    }
    .editInput:hover{
      border: none;
        outline: none;
      border-bottom: 1px solid var(--theme-color);
    }
    .edit {
      display: inline-block;
      margin-left: 30px;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .el-button {
    margin-top: 20px;
  }
}
</style>
