import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/history',
    component: () => import('../views/history/history.vue'),
  },
  {
    path: '/chatting',
    component: () => import('../views/chat/Chatting.vue'),
  },
  {
    // 主页
    path: '/home',
    component: () => import('../views/home/home.vue'),
    meta:{show:true}
  },
  {
    // 排行榜
    path: '/top',
    component: () => import('../views/top/top.vue')
  },
  {
    // 上传
    path: '/creation',
    component: () => import('../views/upload/creation.vue'),
    children:[
      {
        path: '/creation/upload',
        component: () => import('../views/upload/children/upload.vue'),
      },
      {
        path: '/creation/upload/:id',
        component: () => import('../views/upload/children/editInfo.vue'),
      },
      {
        path: '/creation/video',
        component: () => import('../views/upload/children/video.vue'),
      }
    ]
  },
  {
    //直播
    path: '/live',
    component: () => import('../views/online/live.vue'),
    meta:{show:true}
  },
  {
    // 登录页
    path: '/login',
    component: () => import('../views/login/login.vue'),
    redirect: '/login/loginForm',
    children: [
      {
        // 登录表单
        path: '/login/loginForm',
        component: () => import('../views/login/children/loginForm')
      },
      {
        // 注册表单
        path: '/login/signIn',
        component: () => import('../views/login/children/signIn')
      },
      {
        // 忘记密码
        path: '/login/reSet',
        component: () => import('../views/login/children/reSet')
      },
      {
        // 邮箱验证码登录
        path: '/login/codelogin',
        component: () => import('../views/login/children/codelogin')
      },
      {
        // 手机号验证码登录
        path: '/login/phonelogin',
        component: () => import('../views/login/children/phonelogin')
      }
    ]
  },
  {
    // 消息中心
    path: '/message',
    component: () => import('../views/message/message.vue'),
    redirect: '/message/notice',
    children: [
      {
        path: '/message/notice',
        component: () => import('../views/message/children/notice.vue')
      },
      {
        path: '/message/reply',
        component: () => import('../views/message/children/reply.vue')
      },
      // {
      //   path: '/message/mymsg/',
      //   component: () => import('../views/message/children/mymsg.vue')
      // },
      {
        path: '/message/mymsg/:_id',
        component: () => import('../views/message/children/mymsg.vue')
      }
    ]
  },
  {
    // 个人中心
    path: '/mine',
    component: () => import('../views/mine/mine.vue'),
    redirect: '/mine/video',
    children: [
      {
        path: '/mine/video',
        component: () => import('../views/mine/children/video.vue')
      },
      {
        path: '/mine/collection',
        component: () => import('../views/mine/children/collection.vue')
      },
      {
        path: '/mine/attention',
        component: () => import('../views/mine/children/attention.vue')
      },
      {
        path: '/mine/setting',
        component: () => import('../views/mine/children/setting.vue')
      },
      {
        path: '/mine/setPassword',
        component: () => import('../views/mine/children/setPassword.vue')
      },
      {
        path: '/mine/live',
        component: () => import('../views/mine/children/live.vue')
      },
      {
        path: '/mine/trend',
        component: () => import('../views/mine/children/trend.vue'),
      }
    ]
  },
  {
    path: '/trendmaster',
    component: () => import('../views/trend/trendmaster.vue')
  },
  {
    path: '/trendinfo/:_id',
    component: () => import('../views/trend/trendinfo.vue')
  },
  {
    path: '/search',
    component: () => import('../views/search/search.vue'),
    redirect: '/search/video',
    children: [
      {
        path: '/search/video',
        component: () => import('../views/search/children/searchVideo.vue')
      },
      {
        path: '/search/user',
        component: () => import('../views/search/children/searchUser.vue')
      },
      {
        path: '/search/trend',
        component: () => import('../views/search/children/searchTrend.vue')
      }
    ]
  },
  {
    // 播放视频页
    path: '/detail/:_id',
    component: () => import('../views/detail/detail.vue'),
  },
  {
    // 直播
    path: '/online/:_id',
    component: () => import('../views/online/online.vue'),
  },
  {
    //用户页
    path: '/user/:id',
    component: () => import('../views/user/user.vue'),
    redirect: '/user/video/:id',
    children: [
      {
        path: '/user/video/:id',
        component: () => import('../views/user/children/video.vue')
      },
      {
        path: '/user/trend/:id',
        component: () => import('../views/user/children/trend.vue'),
      }
    ]
  }
]
const router = new VueRouter({
  routes
})
export default router
