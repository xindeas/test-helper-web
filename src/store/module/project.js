export default {
    name: "project",
    namespaced: true,
    state: {
        curProject: {}
    },
    mutations: {
        setCurProject(state, v) {
            state.curProject = v;
        }
    }
}
