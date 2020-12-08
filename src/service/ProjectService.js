import instance from '@/utils/serviceUtils'

export function queryProject (param) {
    return instance.post('/project/query', param);
}
export function addProject (project) {
    return instance.post('/project/add', project)
}
