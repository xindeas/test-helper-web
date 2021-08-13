export default {
    name: "router",
    namespaced: true,
    state: {
        // 当前打开的标签页
        curTabs: [],
        // 所有的路由
        routes: []
    },
    mutations: {
        setCurTabs(state, v) {
            const homeRouter = {
                path: '/Home',
                name: 'Home',
                meta: {
                    title: '首页'
                },
                component: () => import('@/views/Home')
            }
            if (v) {
                const home = v.find(item => item.path === '/Home')
                if (!home) {
                    v = [homeRouter].concat(v)
                }
            } else {
                v = [homeRouter]
            }
            state.curTabs = v;
        },
        setRoutes(state, v) {
            state.routes = v;
        }
    }
}
