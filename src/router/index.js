import Vue from 'vue'
import VueRouter from 'vue-router'
import nprogress from 'nprogress'
import VueCookies from 'vue-cookies'
import { refreshUserCookie } from '@/utils/cookieUtil'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Layout',
    name: 'Layout',
    component: () => import('@/views/Layout'),
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
  let user = VueCookies.get('user')
  if (to.path !== '/Login' && !user) {
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
