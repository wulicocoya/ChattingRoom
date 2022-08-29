import vm from "../main";
import Cookies from "js-cookie";
var headers = {
  headers: {
    Authorization: Cookies.get("user_token")
      ? "Bearer " + JSON.parse(Cookies.get("user_token")).token
      : "",
  },
};

var AccountHeader = {
  headers: {
    Authorization: Cookies.get("account_token")
      ? "Bearer " + JSON.parse(Cookies.get("account_token")).token
      : "",
  },
};





// 更新账号信息
export function updateAccount(accountInfo) {
  return vm.$http.put("/api/account/update", accountInfo,AccountHeader);
}

//获取账户信息
export function getAccountInfo(account_id, token) {
  return vm.$http.get("/api/account/info", {
    headers:{
      Authorization: "Bearer "+token
    }
    ,
    params: {
      account_id,
    },
  });
}

//获取账户token
export function getAccountToken(account_id) {
  return vm.$http.get("/api/account/token", {
    ...headers,
    params: {
      account_id,
    },
  });
}
//获取所有账户信息
export function getAllAccount() {
  return vm.$http.get("/api/account/infos/user", {
    ...headers,
  });
}




//注册账号
export function createAccount(info) {
  console.log(info);
  return vm.$http.post("/api/account/create", info, headers);
}

//通过昵称模糊搜索好友
export function searchAccount(name, page = 1, page_size = 6) {
  console.log(name);
  return vm.$http.get("/api/account/infos/name", {...AccountHeader,
   params:{
    name,
    page,
    page_size,
   }
  
  });
}

//更新密码
export function updatePass(code, new_password){
  return vm.$http.put("/api/user/update/pwd", {
    code,
    new_password
  },headers)
}

//获取账户所有好有
export function getAllFriends(){
  return vm.$http.get('/api/setting/friend/list',{...AccountHeader})
}

//获取所有好友申请
export function getApplication(){
  return vm.$http.get('/api/application/list',{...AccountHeader})
}

//获取所有群组
export function getAllGroups(){
  return vm.$http.get("/api/group/list",{...AccountHeader})
}

//注册账户
export function registerAccount(registerForm){
  vm.$http.post('/api/account/create',registerForm,headers)
}

//删除账户
export function delAccount(account_id){
  vm.$http.delete('/api/account/delete',{...headers},{
    data:{
      account_id
    }
  })
}