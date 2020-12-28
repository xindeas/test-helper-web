import instance from '@/utils/serviceUtils'

export function queryDefect (param) {
    return instance.post('/defect/query', param);
}

export function addDefect (defect) {
    return instance.post('/defect/add', defect)
}
export function saveDefect (defect) {
    return instance.post('/defect/save', defect)
}
export function loadDefect (id) {
    return instance.get('/defect/load/' + id)
}
