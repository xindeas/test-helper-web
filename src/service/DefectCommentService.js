import instance from '@/utils/serviceUtils'

export function queryDefectComment (param) {
    return instance.post('/defect-comment/query', param);
}

export function addDefectComment (defectComment) {
    return instance.post('/defect-comment/add', defectComment);
}
export function saveDefectComment (defectComment) {
    return instance.post('/defect-comment/save', defectComment);
}
export function loadDefectComment (id) {
    return instance.get('/defect-comment/load/' + id);
}
