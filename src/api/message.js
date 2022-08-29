import vm from '../main'
import Cookies from "js-cookie";
var AccountHeader = {
    headers: {
      Authorization: Cookies.get("account_token")
        ? "Bearer " + JSON.parse(Cookies.get("account_token")).token
        : "",
    },
  };

//获取首页左侧联系人列表
export function getFriendList(){
    return vm.$http.get('/api/setting/shows',{...AccountHeader});
}

//通过时间戳获取消息列表
export function getMsgList(lastTime, relation_id){
    return vm.$http.get('/api/msg/list/time', {...AccountHeader,
        params:{
            lastTime,
            // page,
            // page_size,
            relation_id
        }
    })
}
//搜索消息
export function searchMsg(content, relation_id,page, page_size=6){
    vm.$http.get('/api/msg/list/content',{...AccountHeader,
        params:{
            content,
            page,
            page_size,
            relation_id
        }
    })
}