import vm from "../main";
import Cookies from "js-cookie";
var AccountHeader = {
    headers: {
      Authorization: Cookies.get("account_token")
        ? "Bearer " + JSON.parse(Cookies.get("account_token")).token
        : "",
    },
  };
//免打扰
export function updateDisturb(is_not_disturb, relation_id){
    return vm.$http.put('/api/setting/update/disturb',{
        is_not_disturb,
        relation_id
    }, AccountHeader)
}
//隐藏
export function hideAccount(is_show,  relation_id){
    return vm.$http.put('/api/setting/update/show', {
        is_show,
        relation_id
    },AccountHeader)
}

//添加好友
export function addFriend(account_id, apply_msg){
    return vm.$http.post('/api/application/create',{
        account_id,
        apply_msg
    },AccountHeader)
}

//删除好友
export function delAccount(relation_id){
    return vm.$http.delete('/api/setting/friend/delete',{
        relation_id
    },AccountHeader)
}



  //更新聊天列表
export function updateListShow(is_show, relation_id){
    return vm.$http.put("/api/setting/update/show",{
        is_show,
        relation_id
    },AccountHeader)
}

//更新pin 
export function updatePin(is_pin, relation_id){
    return vm.$http.put('/api/setting/update/show',{
        is_pin,
        relation_id
    },AccountHeader)
}
//同意申请好友
export function acceptApply(account_id){
    return vm.$http.put('/api/application/accept',{
        account_id
    },AccountHeader)
}
//拒绝添加好友
export function refuseApply(account_id){
    return vm.$http.put('/api/application/refuse',{
        account_id
    }, AccountHeader)
}

//删除好友申请
export function delApply(account_id){
    return vm.$http.delete('/api/application/delete',{...AccountHeader,
        data:{
              account_id
        }
         
    });
}