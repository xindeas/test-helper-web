import Vue from 'vue'
import VueRouter from 'vue-router'
import nprogress from 'nprogress'

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
  const user = sessionStorage.getItem('user')
  if (to.path !== '/Login' && !user) {
    next({
      path: '/Login'
    })
  }
  next()
})
router.afterEach(() => {
  nprogress.done()
})

export default router
