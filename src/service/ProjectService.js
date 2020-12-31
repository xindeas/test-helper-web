import instance from '@/utils/serviceUtils'

export function queryProject (param) {
    return instance.post('/project/query', param);
}
export function queryProjectForOptions (param) {
    return instance.post('/project/queryForOptions', param, {
        params: param
    });
}
export function addProject (project) {
    return instance.post('/project/add', project)
}
export function saveProject (project) {
    return instance.post('/project/save', project)
}
export function loadProject (id) {
    return instance.get('/project/load/' + id)
}
export function switchVersion (projectId, versionNo) {
    return instance.get('/project/switch-ver', {params: {projectId, versionNo}})
}
export function deleteProject (ids) {
    return Promise.all(ids.map(id => {
        return instance.delete('/project/delete/' + id)
    }))
}
export function enableProject (ids) {
    return Promise.all(ids.map(id => {
        return instance.get('/project/enable/' + id)
    }))
}
export function disableProject (ids) {
    return Promise.all(ids.map(id => {
        return instance.get('/project/disable/' + id)
    }))
}
