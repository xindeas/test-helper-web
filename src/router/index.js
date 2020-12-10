import Vue from 'vue'
import VueRouter from 'vue-router'
import nprogress from 'nprogress'
import VueCookies from 'vue-cookies'
import { refreshUserCookie } from '@/utils/cookieUtil'
import { Message } from 'element-ui';
import store from "@/store/index"

Vue.use(VueRouter)

const routes = [
  {
    path: '/Layout',
    name: 'Layout',
    redirect: '/Home',
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
        component: () => import('@/views/Project/index')
      },
      {
        path: '/ProjectUpdate',
        name: 'ProjectUpdate',
        meta: {
          title: '新增项目'
        },
        component: () => import('@/views/Project/update')
      },
      {
        path: '/WorkBench',
        name: 'WorkBench',
        meta: {
          title: '工作台'
        },
        component: () => import('@/views/WorkBench/index')
      },
      {
        path: '/Defect',
        name: 'Defect',
        meta: {
          title: '缺陷管理'
        },
        component: () => import('@/views/Defect/index')
      },
      {
        path: '/TestCase',
        name: 'TestCase',
        meta: {
          title: '测试用例'
        },
        component: () => import('@/views/TestCase/index')
      },
      {
        path: '/User',
        name: 'User',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/views/TestCase/index')
      },
      {
        path: '/Test',
        name: 'Test',
        meta: {
          title: '测试'
        },
        component: {
          render: (createElement) => {
            return createElement("div", 123)
          }
        }
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
  console.log(to);
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
  if (to.path === '/Login') {
    store.commit("router/setCurTabs", [])
  } else {
    addTab(to);
  }
  next()
})
router.afterEach(() => {
  nprogress.done()
})
function addTab(to) {
  const arr = store.state.router.curTabs || [];
  const maxTabNum = 5;
  const index = arr.findIndex(item => item.name === to.name)
  if (arr.length < maxTabNum && index < 0) {
    arr.push(to)
  }
  else if (arr.length >= maxTabNum && index < 0) {
    arr.splice(0, 1)
    arr.push(to)
  }
  store.commit("router/setCurTabs", arr)
}

export default router
