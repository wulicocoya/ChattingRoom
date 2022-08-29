import vm from "../main";
import Cookies from 'js-cookie';
var AccountHeader = {
    headers: {
      Authorization: Cookies.get("account_token")
        ? "Bearer " + JSON.parse(Cookies.get("account_token")).token
        : "",
    },
  };


//修改好友备注
export function setEdit(nick_name, relation_id){
    vm.$http.put('/api/setting/update/nick_name', {
            nick_name,
            relation_id
    },AccountHeader)
}
