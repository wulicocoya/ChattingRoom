<template>
  <div class="leftWrapper">
     <ul class="accountList list">
      <template v-for="item in msgList">
          <li
            :key="item.relation_type == 'friend'?item.friend_info.account_id:item.group_info.relation_id"
            @click="openProfile(item)"
            v-if="item.is_show"
          >
            <div class="avatar">
              <el-avatar
                icon="el-icon-user-solid"
                :src="item.relation_type == 'friend'?item.friend_info.avatar:item.group_info.avatar"
              ></el-avatar>
            </div>
           <div class="rightInfo">
              <div class="name">{{item.relation_type=='friend'?item.friend_info.name:item.group_info.name}}</div>
              <div class="lastTime">{{item.last_show | dateFormat}}</div>
           </div>
          </li>
      </template>
        </ul>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {getFriendList} from '../../../api/message'
var _this ='';
export default {
  data() {
    return {
      name: "LeftShow",
      msgList: []
    };
  },
  methods:{
    async getFriendList(){
      const {data} = await getFriendList();
      this.msgList = data.list;
      console.log(this.msgList);
    },

    getDateObj(val){
      var obj = {
        'Y':dayjs(val).format('YYYY'),
        'M':dayjs(val).format('MM'),
        'D':dayjs(val).format('DD')
      }
      return obj;
    },
    openProfile(item){
      this.$router.push({
        path:"/message",
        query:{
          id:item.relation_id
        }
      })
      console.log(item);
      this.$store.commit("chat/SET_CURRENT", item);
      this.$bus.$emit("updateChat", item);
    }
  },
  mounted(){
    this.getFriendList();
    this.$bus.$on("updateMsgList", ()=>{
      this.getFriendList();
    })
  },
  created(){
    _this = this;
  },
  //时间过滤器
  filters:{
       dateFormat(value) {
          // var date = new Date(value);
          // var year = date.getFullYear();
          var now = _this.getDateObj(new Date());
          var date = _this.getDateObj(new Date(value));
          var res;
         if(now['Y'] == date['Y'] && now['M']==date['M'] && now['D']==date['D']){
            res = dayjs(date).format('HH:mm');
         }else if(now['Y'] == date['Y'] && now['M']==date['M'] && Number(now['D'])==Number(date['D'])+1){
            res = '昨天';
         }else{
            res = date['M']+'月'+date['D']+'日';
         }
          return res;
         
       }
  }
};
</script>

<style scoped lang="scss">
.leftWrapper {
  width: 600px;
  height: 100%;
  background-color: var(--main-color2);
  padding: 10px;
}
 .list {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    li {
      transition: all 0.5s;
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
      .rightInfo{
          flex: 1;
          padding-top: 20px;
          position: relative;
          height: 100%;
          .name{
            margin-left: 15px;
            display: inline-block;
          }
          .lastTime{
            position: absolute;
            right: 30px;
            top: 20px;
            font-size: 13px;
          }
      }
    }
    li:hover {
      background-color: var(--main-color3);
    }
    .el-pagination {
      margin: 0 auto;
    }
  }
</style>
