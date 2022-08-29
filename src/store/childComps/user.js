
const state = {
    userInfo:null
}
//直接操作数据
const mutations = {
    SET_USERINFO(state, value){
        state.userInfo = value;
    },
    DEL_USER(state){
        state.userInfo = null;
    }
}
export default {
    //这个属性很关键哦
    namespaced:true,
    state,
    mutations
}