<!--
* @description: 联系人列表(单选)
  实现选择联系人： 
  关联：@某人 转让群
-->

<template>
  <div class="chooseContacts">
    <div class="innerWrapper">
      <h3>我的联系人</h3>
      <ul>
        <li
          v-for="item in groupMembers"
          :key="item.account_id"
          @click="confirmSelect(item)"
          :class="item.account_id != $store.state.account.accountInfo.id?'visible':''"
        >
          <div class="friend" >
            <el-avatar icon="el-icon-user-solid" :src="item.avatar"></el-avatar>
            <div class="name">{{ item.name }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {getGroupMembers} from '../../api/group'
export default {
  name: "ChooseContacts",
  data() {
    return {
        groupMembers:[]
    };
  },
  methods: {
    //确定选中
    confirmSelect(item) {
      this.$confirm("确定选择该联系人作为新群主吗？")
      .then(()=>{
        this.$bus.$emit("selectOne", item);
        this.$bus.$emit("cancelSelectOne");
      })
    },
    async getGroupMembers(id) {
      const { data } = await getGroupMembers(id);
      this.groupMembers = data;
      console.log(data);
    }
  },
  mounted() {
    this.getGroupMembers(this.$route.query.id);
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.chooseContacts {
  background-color: white;
  z-index: 300;
  width: 500px;
  height: 600px;
  padding: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 10px;
  box-shadow: 1px 1px 8px 0px rgba(0, 0, 0, 0.2);

  .innerWrapper {
    height: 90%;
    width: 100%;
    border: 1px solid var(--main-color3);
    display: flex;
    flex-direction: column;
    h3 {
      width: 100%;
      padding: 10px;
    }
    ul {
      width: 100%;
      height: calc(100% - 42px);
      overflow-y: scroll;
      li {
        padding: 10px;
        display: flex;
        border: 1px solid var(--main-color3);
        cursor: pointer;
        .friend {
          display: flex;
          align-items: center;
          .name {
            margin-left: 10px;
          }
        }
      }
      li:hover {
        background-color: var(--main-color2);
      }
      .visible{
        display: none;
      }
    }
  }

  .contactShow {
    z-index: 200;
  }
}
</style>
