import instance from '@/utils/serviceUtils'

export function queryProjectAuth (param) {
    return instance.post('/project-auth/query', param);
}
export function addProjectAuth (projectAuth) {
    return instance.post('/project-auth/add', projectAuth)
}
export function deleteProjectAuth (ids) {
    return Promise.all(ids.map(id => {
        return instance.delete('/project-auth/delete/' + id)
    }))
}
