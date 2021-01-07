import instance from '@/utils/serviceUtils'

export function queryProjectModule (param) {
    return instance.post('/project-module/query', param);
}

export function addProjectModule (projectModule) {
    return instance.post('/project-module/add', projectModule);
}
export function saveProjectModule (projectModule) {
    return instance.post('/project-module/save', projectModule);
}
export function loadProjectModule (id) {
    return instance.post('/project-module/load/' + id);
}
