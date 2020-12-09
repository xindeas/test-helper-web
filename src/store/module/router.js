export default {
    name: "router",
    namespaced: true,
    state: {
        // 当前打开的标签页
        curTabs: [],
    },
    mutations: {
        setCurTabs(state, v) {
            state.curTabs = v;
        }
    }
}
