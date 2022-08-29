const state = {
    currentChat:null
}
const mutations={
    SET_CURRENT( state, val){
        state.currentChat = val;
    },
    REMOVE_CURRENT(state){
        state.currentChat = ''
    }
}
export default {
    namespaced:true,
    state,
    mutations
}