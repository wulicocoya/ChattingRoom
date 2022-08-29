import Vuex from 'vuex'
import user from './childComps/user'
import Vue from 'vue'
import account from './childComps/account'
import network from './childComps/network'
import chat from './childComps/chat'
import socket from './childComps/socket'
import freeLogin from './childComps/freeLogin'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        user,
        account,
        network,
        chat,
        socket,
        freeLogin
    }
})