import cookies from 'js-cookie'

const state = {
    accountInfo:cookies.get("account_info") && cookies.get("account_info") !=undefined?JSON.parse(cookies.get("account_info")):""
}
//直接操作数据
const mutations = {
    //value包括要设置的值以及freeLogin
    SET_ACCOUNTINFO(state, value){
        console.log(value);
        state.accountInfo = value.account;
        if(value.freeLogin){
            cookies.set("account_info", JSON.stringify(value.account),{empires:15});
        }else{
            cookies.set("account_info", JSON.stringify(value.account));
        }
    },
    DEL_ACCOUNTINFO(state){
        state.accountInfo = null;
        cookies.remove("account_info");
    }
}
export default {
    //这个属性很关键哦
    namespaced:true,
    state,
    mutations
}