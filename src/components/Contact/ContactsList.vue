<!--
* @description: 联系人列表(多选)
  实现选择联系人： 
  关联：邀请人 转让群主功能需求

-->

<template>
  <div class="chooseContacts">
    <div class="innerWrapper">
      <div class="left">
        <h3>我的联系人</h3>
        <ul>
          <li v-for="item in contactList" 
          :key="item.friend_info.account_id"
          :class="item.disabled?'filter':''">
            <input
              v-model="item.checked"
              type="checkbox"
              :id="item.friend_info.account_id"
              @click="updateSelect(item)"
              :disabled="item.disabled"
            />
            <label :for="item.friend_info.account_id">
              <div class="friend">
                <el-avatar
                  icon="el-icon-user-solid"
                  :src="item.friend_info.avatar"
                ></el-avatar>
                <div class="name">{{ item.friend_info.name }}</div>
              </div>
            </label>
          </li>
        </ul>
      </div>
      <div class="right">
        <div class="chosed">已选{{ selectList.length }}人</div>
        <ul>
          <li v-for="item in selectList" :key="item.relation_id">
            <div class="friend">
              <el-avatar
                icon="el-icon-user-solid"
                :src="item.friend_info.avatar"
              ></el-avatar>
              <div class="name">{{ item.friend_info.name }}</div>
              <i class="el-icon-close" @click="delSelect(item)"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="operators">
      <el-button @click="cancelSelect">取消</el-button>
      <el-button
        type="primary"
        :disabled="this.selectList.length == 0"
        @click="confirmSelect"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import { getAllFriends } from "../../api/account";
export default {
  name: "chooseContacts",
  data() {
    return {
      contactList: "",
      selectSet: new Set(),
      selectList: [],
    };
  },
  props:['groupMap'],
  methods: {
    //获取好友列表
    async getAllFriends() {
      const { data } = await getAllFriends();
      this.contactList = data.list;
      this.contactList.forEach((element) => {
        //判断是否为群成员？
        element["checked"] = false;
        if (this.groupMap.has(element.friend_info.account_id)) {
          element.disabled = true;
        }
        console.log(this.contactList);
      });
    },

    //更改选中状态
    updateSelect(item) {
      item.checked = !item.checked;
      if (item.checked) {
        this.selectSet.add(item);
      } else {
        this.selectSet.delete(item);
      }
      this.selectList = Array.from(this.selectSet);
    },

    //删除右边选中
    delSelect(item) {
      this.selectSet.delete(item);
      this.selectList = Array.from(this.selectSet);
      item.checked = false;
    },
    //确定选中
    confirmSelect() {
      this.$bus.$emit("select", this.selectList);
    },
    //取消
    cancelSelect() {
      this.$bus.$emit("cancelSelect");
    },
  },
  mounted() {
    this.getAllFriends();
    this.$bus.$on("groupMap",(val) => {
      alert("触发");
      this.map = val;
      console.log(val);
    })
  },
  beforeDestroy() {
    this.$bus.$off("groupMap");
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.chooseContacts {
  background-color: white;
  z-index: 200;
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
    border: 1px solid var(--main-color3);
    display: flex;
    .left {
      width: 50%;
      height: 100%;
      border-right: 1px solid var(--main-color3);
      h3 {
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
          label {
            margin-left: 10px;
            flex: 1;
            cursor: pointer;
            .friend {
              display: flex;
              align-items: center;
              .name {
                margin-left: 10px;
              }
            }
          }
        }
        li:hover {
          background-color: var(--main-color2);
        }
        .filter{
          opacity: 0.6;
      }
    }
    }

    // 右边列表
    .right {
      width: 50%;
      .chosed {
        padding: 10px;
        margin-bottom: 10px;
      }
      ul {
        padding: 10px;
        li {
          transition: all 0.5s;
          border-radius: 10px;
          padding: 10px;
          display: flex;
          .friend {
            display: flex;
            align-items: center;
            .name {
              margin-left: 10px;
            }
            i {
              cursor: pointer;
              margin-left: 80px;
            }
          }
        }
        li:hover {
          background-color: var(--main-color2);
        }
      }
    }
  }
  .operators {
    padding: 20px;
    display: flex;
    justify-content: flex-end;
  }
  .contactShow {
    z-index: 200;
  }

}
</style>
