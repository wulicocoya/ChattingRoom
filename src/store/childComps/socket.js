const state = {
    socket: null,
    socketId: null,
}
const mutations = {
    joinSocket(state, socket) {
        state.socket = socket
        state.socketId = socket.id
    }
}
const getters = {
    socket(state) {
        return state.socket
    },
    socketId(state) {
        return state.socketId
    }
}
export default {
    namespaced:true,
    state,
    mutations,
    getters
}

