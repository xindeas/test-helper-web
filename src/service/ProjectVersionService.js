import instance from '@/utils/serviceUtils'

export function queryProjectVersion (param) {
    return instance.post('/project-version/query', param);
}

export function addProjectVersion (project) {
    return instance.post('/project-version/add', project)
}
export function saveProjectVersion (project) {
    return instance.post('/project-version/save', project)
}
export function loadProjectVersion (id) {
    return instance.get('/project-version/load/' + id)
}
export function deleteProjectVersion (ids) {
    return Promise.all(ids.map(id => {
        return instance.delete('/project-version/delete/' + id)
    }))
}
