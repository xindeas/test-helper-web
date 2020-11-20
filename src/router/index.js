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
        component: () => import('@/views/Home')
      }
    ]
  },
  {
    path: '/Login',
    name: 'Login',
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
