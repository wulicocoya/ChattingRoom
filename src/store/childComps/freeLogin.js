import cookies from 'js-cookie'

const state = {
    freeLogin:""
}
//直接操作数据
const mutations = {
    //value包括要设置的值以及freeLogin
    SET_FREELOGIN(state, value){
        console.log(value);
        state.freeLogin = value.account;
    }
}
export default {
    //这个属性很关键哦
    namespaced:true,
    state,
    mutations
}