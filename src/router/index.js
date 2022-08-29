import VueRouter from "vue-router";
import {Message} from 'element-ui'
import Cookies from "js-cookie";

const router = new VueRouter({
  routes: [
    {
      path: "/login",
      component: () => import("@/views/LoginAndRegister"),
      meta:{title:"登录", Auth:false}
    },
    {
      path: "/",
      component: () => import("@/components/Layout"),
      redirect: "/message",
      meta:{Auth:true},
      children: [
        {
          path: "/message",
          component: () => import("@/views/Message"),
          redirect:'/message/chat',
          children:[
            {
              path:"chat",
              component:()=>import("@/views/Message/childComps/Message"),
              meta: { title: "消息", Auth: true }
            },
            {
              path:"groupNotify",
              component:()=>import("@/views/Message/childComps/GroupNotify"),
              meta:{title:"群公告", Auth:true}
            }
          ]
        },
        {
          path: "/maillist",
          component: () => import("@/views/MailList"),
          meta: { title: "通讯录", Auth: true },
          redirect:'/maillist/contacts',
          children:
            [
              {
                path:"contacts",
                component:()=>import("@/views/MailList/childComps/Contacts.vue"),
                meta:{title:'我的联系人'}
              },
              {
                path:"groups",
                component:()=>import("@/views/MailList/childComps/Groups.vue"),
                meta:{title:'我的群组'}
              },
              {
                path:'new',
                component:()=>import("@/views/MailList/childComps/newContacts.vue"),
                meta:{title:"新的联系人"}
              }
            ]
          
        },
        {
          path:'profile',
          component:() => import("@/views/Profile"),
          meta:{title:'个人简介', Auth:true}
        }
      ],
    },
    {
      path:'/account',
      component:()=>import("@/views/AccountLogin"),
      meta:{title:"选择用户", Auth:true},
    },
    {
      path:'/accountDetail',
      component:()=>import("@/views/AccountLogin/childComps/AccountDetail")
    }
  ],
});

router.beforeEach((to, from, next) => {
  console.log(to.path);
  if (to.meta.Auth && to.path != "/login") {
    //未登录则跳转至登录页面
    if (Cookies.get("user_token")) {
        //具体有待细化
      let lifeTime =
      JSON.parse(Cookies.get("user_token"))?.expired_at;
      lifeTime = new Date(lifeTime).getTime();
      console.log(lifeTime);
      let nowTime = new Date().getTime(); // 当前时间的时间戳
      if (nowTime < lifeTime) {
        next();
      } else {
        Message.error("登录信息过期,请重新登录");
        next({
          path: "/login",
        });
      }
    } else {
      next({
        path: "/login",
      });
        }
    } 
    else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title;
});
export default router;
