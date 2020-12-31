import instance from '@/utils/serviceUtils'

export function queryProjectVersion (param) {
    return instance.post('/project-version/query', param);
}

export function addProjectVersion (projectVersion) {
    return instance.post('/project-version/add', projectVersion)
}
export function saveProjectVersion (projectVersion) {
    return instance.post('/project-version/save', projectVersion)
}
export function loadProjectVersion (id) {
    return instance.get('/project-version/load/' + id)
}
export function checkUniqueNo (projectId, no, id) {
    return instance.get('/project-version/unique-no/' + projectId + '/' + no, {params: {id}});
}
export function deleteProjectVersion (ids) {
    return Promise.all(ids.map(id => {
        return instance.delete('/project-version/delete/' + id)
    }))
}
