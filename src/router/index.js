import Vue from 'vue'
import VueRouter from 'vue-router'
import nprogress from 'nprogress'
import VueCookies from 'vue-cookies'
import {refreshUserCookie} from '@/utils/cookieUtil'
import {Message} from 'element-ui';
import store from "@/store/index"
import {MAX_TABS_NUM} from '@/utils/constant'

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
            }
        ]
    },
    {
        path: '/Project',
        name: 'Project',
        meta: {
            title: '项目'
        },
        component: () => import('@/layout/index'),
        children: [
            {
                path: '/Project/MyProject',
                name: 'MyProject',
                meta: {
                    title: '我的项目'
                },
                component: () => import('@/views/MyProject/index')
            },
            {
                path: '/Project/ProjectModule',
                name: 'ProjectModule',
                meta: {
                    title: '项目模块'
                },
                component: () => import('@/views/ProjectModule/index')
            },
        ]
    },
    {
        path: '/W',
        name: 'W',
        component: () => import('@/layout/index'),
        children: [
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
                // component: {
                //   render: (h) => {
                //     return h('div', '123')
                //   }
                // }
            },
            {
                path: '/User',
                name: 'User',
                meta: {
                    title: '用户管理'
                },
                component: () => import('@/views/User/index')
            },
            {
                path: '/CodeCreator',
                name: 'CodeCreator',
                meta: {
                    title: '代码生成'
                },
                component: () => import('@/views/CodeCreator/index')
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
        path: '/Error',
        name: 'Error',
        meta: {
            title: '404'
        },
        component: () => import('@/views/Error')
    },
    {
        path: '/',
        redirect: '/Layout'
    },
    {
        path: '*',
        redirect: '/Error'
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

function getParentByBrother(brotherName, parent) {
    const brother = parent.children.find(item => item.name === brotherName)
    if (brother) {
        return parent
    }
    return null
}

router.selfAdd = (params, brotherName) => {
    let parent = null
    for (const item of router.options.routes) {
        parent = getParentByBrother(brotherName, item)
        if (parent) {
            break
        }
    }
    if (!parent) {
        parent = router.options.routes[0]
    }
    const existIndex = parent.children.findIndex(item => item.name === params.name)
    if (existIndex < 0) {
        parent.children.push(params);
        router.matcher = new VueRouter().matcher;
        router.addRoutes(router.options.routes)
    } else {
        parent.children.splice(existIndex, 1, params);
        router.matcher = new VueRouter().matcher;
        router.addRoutes(router.options.routes)
    }
}
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
    const maxTabNum = MAX_TABS_NUM;
    const index = arr.findIndex(item => item.name === to.name)
    if (arr.length < maxTabNum && index < 0) {
        arr.push(to)
    } else if (arr.length >= maxTabNum && index < 0) {
        arr.splice(0, 1)
        arr.push(to)
    }
    store.commit("router/setCurTabs", arr)
}

export default router
