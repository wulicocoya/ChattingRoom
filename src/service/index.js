import axios from "axios";
import { Message } from "element-ui";
import Cookies from "js-cookie";
import router from "../router";
//创建实例
const instance = axios.create({
  // baseURL:'http://localhost:3000',
  // baseURL: "http://47.108.173.156:8080",
  baseURL: "https://chat.humraja.xyz",
  // timeout: 1000 * 10, // 请求超时时间
  //示跨域请求时是否需要使用凭证
  withCredentials: true, // 是否允许带cookie这些
  // headers: {
  //   "Content-Type": "application/json ;charset=utf-8",
  //   //全局配置
  //   Authorization: Cookies.get("account_token")?
  //   'Bearer '+ JSON.parse(Cookies.get("account_token")).token:'Bearer '+ JSON.parse(Cookies.get("user_token")).token
  // },
  //  transformRequest:[function(data, headers){
  //   headers['Authorization']=Cookies.get("account_token")?
  //   'Bearer '+ JSON.parse(Cookies.get("account_token")).token:'Bearer '+ JSON.parse(Cookies.get("user_token")).token;
  //   return data;
  //  }]
});
// instance.interceptors.request.use(
//     config=>{
//         //token认证
//         if(Cookies.get("account_token")){
//             config.headers.Authorization = "bearer v2.local.S0IkurxK12E-aAVhGdMLTpE0DvfBKF59yOy2T98aiaFYN1jZvh7gNiN7S4H9Tr2Cs8B5xKjJjL1D0UhRd5qP6rq1IM9ufI_QfAMbZeRsw0dUXMWqeVi9I3NuBco6Gp3nyNboHf1ztCnZVI9KGD2XN266mc7PH67ZyzMKzBv8hHRx112cGMWe4dKIbYtQS75-YFVcK8o7ahxFRjNL_zd4-znPZS3jIts6dYJooghvFyV1lSenh7m43wDn181j5FRRVTxsThue_Xqg1vSffsQpBFiSCJtq442I3413-avNosIwxB1w_glj2u_4wlJdl_iuir3jVJFuM5S4M1AXM0Ui.bnVsbA";
//         }
//         return config;
//     },
//     error=>{
//         console.log(error);
//         return Promise.reject(error);
//     }
// )
instance.interceptors.response.use(
  (res) => {
    console.log(res);
    if (res.data.status_code !== 0) {
      statusError(res.data.status_code, res.data.status_msg);
      return Promise.reject(res.data.status_msg);
    }
    Message.success("success");
    return Promise.resolve(res.data);
  },
  (error) => {
    console.log(error);
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandler(response.status, response.status_msg);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        //断网处理？
        this.$store.commit("CHANGE_NETWORK  ", false);
      } else {
        return Promise.reject(error);
      }
    }
  }
);

function statusError(status, msg) {
  switch (status) {
    case 1001:
      Message.error("参数有误");
      break;
    case 1002:
      Message.error("未找到资源");
      break;
    case 1003:
      Message.error("系统错误");
      break;
    case 1004:
      Message.error("请求过多");
      break;
    case 1005:
      Message.error("请求超时");
      break;
    case 2001:
      Message.error("用户不存在");
      break;
    case 2002:
      Message.error("密码错误");
      break;
    case 2003:
      Message.error("邮件发送频繁，请稍后再试");
      break;
    case 2004:
      Message.error("邮箱验证码校验失败");
      break;
    case 2005:
      Message.error("邮箱重复");
      break;
    case 2006:
      Message.error("邮箱已经注册");
      break;
    case 2007:
      Message.error("身份不存在");
      break;
    case 2008:
      Message.error("身份验证失败");
      break;
    case 2009:
      Message.error("账号不存在");
      break;
    case 2010:
      Message.error("账号不存在");
      break;
    case 2011:
      Message.error("账号名已经存在");
      break;
    case 2012:
      Message.error("账号数量超过限制");
      break;
    case 2013:
      Message.error("身份过期");
      break;
    case 3001:
      Message.error("申请已经存在");
      break;
    case 3002:
      Message.error("申请不存在");
      break;
    case 3003:
      Message.error("申请不合法");
      break;
    case 3004:
      Message.error("重复操作申请");
      break;
    case 3005:
      Message.error("用户存在账户");
      break; // 删除用户时用户仍存在账户
    case 3006:
      Message.error("账号身为群主不能删除");
      break; // 删除账户时，账户存在群主身份
    case 4001:
      Message.error("关系已经存在");
      break;
    case 4002:
      Message.error("关系不存在");
      break;
    case 5001:
      Message.error("消息不存在");
      break;
    case 5002:
      Message.error("消息已经撤销");
      break;
    case 5003:
      Message.error("回复消息已经撤销");
      break;
    case 5004:
      Message.error("回复的消息和发送;消息并非在一个群");
      break;
    case 5005:
      Message.error("消息已经阅读");
      break;
    case 7001:
      Message.error("非群主");
      break;
    default:
      Message.error(msg);
  }
}

function errorHandler(status, errMsg) {
  switch (status) {
    //未登录状态
    case 401:
      toLogin();
      break;
    // token过期
    case 403:
      Message.error("登录过期，请重新登录");
      localStorage.removeItem("token");
      // eslint-disable-next-line
      // store.commit("isLogin", false);
      setTimeout(() => {
        toLogin();
      }, 1000);
      break;
    case 404:
      Message.error("请求资源不存在");
      router.push("/error/404");
      break;
    default:
      Message.error(errMsg ? errMsg : "error");
  }
}

function toLogin() {
  router.push({
    path: "/login",
  });
}

export default {
  install: (Vue) => {
    Object.defineProperty(Vue.prototype, "$http", { value: instance });
  },
};
