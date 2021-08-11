export default {
    name: "router",
    namespaced: true,
    state: {
        // 当前打开的标签页
        curTabs: [],
    },
    mutations: {
        setCurTabs(state, v) {
            if (v) {
                const home = v.find(item => item.path === '/Home')
                if (!home) {
                    v = [{
                        path: '/Home',
                        name: 'Home',
                        meta: {
                            title: '首页'
                        },
                        component: () => import('@/views/Home')
                    }].concat(v)
                }
            } else {
                v = [{
                    path: '/Home',
                    name: 'Home',
                    meta: {
                        title: '首页'
                    },
                    component: () => import('@/views/Home')
                }]
            }
            state.curTabs = v;
        }
    }
}
