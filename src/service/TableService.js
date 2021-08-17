import instance from '@/utils/serviceUtils'

export function createCode(tableName) {
    return instance.get('/table/create-code', {params: {tableName}})
}

export function getAllTable() {
    return instance.get('/table/get-all-table')
}

export function download(tableName) {
    return instance({
        method: 'post',
        url: '/table/download',
        params: {tableName},
        responseType: 'blob',
    })
}
