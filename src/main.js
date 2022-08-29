import ElementUI from 'element-ui';
import './assets/theme/index.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueRouter from 'vue-router'
import axiosPlugin from "./service/index";
import store from './store'
import vuex from 'vuex'
import cookies from 'js-cookie'
// socket.io
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'


//https://chat.humraja.xyz/chat
// Vue.use(
//   new VueSocketIO({
//     debug: true,
//     connection:'https://chat.humraja.xyz/chat' 
//     // extraHeaders: { 'Access-Control-Allow-Origin': '*' }
//   })
// )

// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: SocketIO('http://127.0.0.1:3030', {   //需要连接socket的地址
//     autoConnect: false  //禁止自动连接socket，由于不需要一直连socket服务，所以这里设置关闭
//   }),  //可以连接socket
//   extraHeaders: { 'Access-Control-Allow-Origin': '*' }
// }));


Vue.use(vuex)

Vue.use(ElementUI);
Vue.use(axiosPlugin);


Vue.use(VueRouter);
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

Vue.prototype.$cookies = cookies;
Vue.config.productionTip = false;

export default new Vue({
  // sockets: {
  //   connecting() {
  //     console.log('正在连接')
  //   },
  //   disconnect() {
  //     console.log('Socket 断开')
  //   },
  //   connect_failed() {
  //     console.log('连接失败')
  //   },
  //   connect() {
  //     console.log('socket connected')
  //   },
  //   auth(){
  //     console.log("鉴权成功");
  //   },
  //   test(msg){
  //     console.log("chat_test_1")
  //     console.log("recv:" + msg)
  //     console.log("chat_test_2")
  //   }
  // },
  render: h => h(App),
  router:router,
  store:store,
  beforeCreate() {
    Vue.prototype.$bus = this
  },
}).$mount('#app')
