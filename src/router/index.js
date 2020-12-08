import Vue from 'vue'
import VueRouter from 'vue-router'
import nprogress from 'nprogress'
import VueCookies from 'vue-cookies'
import { refreshUserCookie } from '@/utils/cookieUtil'
import { Message } from 'element-ui';

Vue.use(VueRouter)

const routes = [
  {
    path: '/Layout',
    name: 'Layout',
    component: () => import('@/layout/index'),
    children: [
      {
        path: '/Home',
        name: 'Home',
        meta: {
          title: '首页'
        },
        component: () => import('@/views/Home')
      },
      {
        path: '/Project',
        name: 'Project',
        meta: {
          title: '我的项目'
        },
        component: () => import('@/views/Project')
      },
      {
        path: '/WorkBench',
        name: 'WorkBench',
        meta: {
          title: '工作台'
        },
        component: () => import('@/views/WorkBench')
      },
      {
        path: '/Defect',
        name: 'Defect',
        meta: {
          title: '缺陷管理'
        },
        component: () => import('@/views/Defect')
      },
      {
        path: '/TestCase',
        name: 'TestCase',
        meta: {
          title: '测试用例'
        },
        component: () => import('@/views/TestCase')
      }
    ]
  },
  {
    path: '/Login',
    name: 'Login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/Login')
  },
  {
    path: '/',
    redirect: '/Layout'
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  nprogress.start()
  document.title = to.meta.title
  const user = VueCookies.get('user')
  if (to.path !== '/Login' && !user) {
    // 存在path属性则代表本次路由是系统内执行的路由
    if (from.path !== '/') {
      Message.error('太久未操作，请重新登录！')
    }
    next({
      path: '/Login'
    })
    return
  }
  // 刷新cookie过期时间
  if (user) {
    refreshUserCookie(user)
  }
  next()
})
router.afterEach(() => {
  nprogress.done()
})

export default router
