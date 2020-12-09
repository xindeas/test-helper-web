import instance from '@/utils/serviceUtils'

export function queryProjectAuth (param) {
    return instance.post('/projectAuth/query', param);
}
export function addProjectAuth (projectAuth) {
    return instance.post('/projectAuth/add', projectAuth)
}
export function deleteProjectAuth (ids) {
    return Promise.all(ids.map(id => {
        return instance.delete('/projectAuth/delete/' + id)
    }))
}
