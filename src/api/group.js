import vm from "../main";
import Cookies from "js-cookie";
var AccountHeader = {
  headers: {
    Authorization: Cookies.get("account_token")
      ? "Bearer " + JSON.parse(Cookies.get("account_token")).token
      : "",
  },
};

//获取所有群成员
export function getGroupMembers(relation_id) {
  return vm.$http.get(
    "/api/group/members",
    { ...AccountHeader ,
      params: {
        relation_id,
      },
    }
  );
}
//退出群聊
export function quitGroup(account_id, relation_id) {
  return vm.$http.post(`/api/group/quit`, {
    account_id,
    relation_id,
  }, AccountHeader);
}
//解散群
export function dissolveGroup(relation_id) {
  return vm.$http.post(`/api/group/dissolve`, {
    relation_id,
  }, AccountHeader);
}

//创建群组
export function createGroup(groupInfo) {
  console.log(groupInfo);
  return vm.$http.post(
    `/api/group/create`,
    groupInfo,
    AccountHeader
  );
}

//获取群公告
export function getNotify(relation_id) {
  return vm.$http.get(`/api/notify/getnotify?relation_id=${relation_id}`, {
    ...AccountHeader,
  });
}

//邀请好友进群
export function inviteFriends(account_id, relation_id) {
  return vm.$http.post("/api/group/invite", {
    account_id,
    relation_id,
  }, AccountHeader);
}

//新建群公告
export function createNotify(msg_content, relation_id, msg_expand) {
  return vm.$http.post("/api/notify/create", {
    msg_content,
    relation_id,
  }, AccountHeader);
}

//更新群公告
export function updateNotify(id, msg_content, relation_id, msg_expand) {
  return vm.$http.post("/api/notify/update", {
    id,
    msg_content,
    relation_id,
  }, AccountHeader);
}

//删除群公告
export function delNotify(id, relation_id) {
  return vm.$http.get(
    "/api/notify/delete",
    { ...AccountHeader ,
      params: {
        id,
        relation_id,
      },
    }
  );
}

//转让群主
export function transferGroup(relation_id,to_account_id){
  return vm.$http.post('/api/group/transfer', {
    relation_id,
    to_account_id
  },AccountHeader)
}