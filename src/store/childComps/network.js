const state = {
    network:true
}
const mutations = {
    CHANGE_NETWORK(state, val){
        state.network = val;
    }
}
export default {
    namespaced:true,
    state,
    mutations
}
