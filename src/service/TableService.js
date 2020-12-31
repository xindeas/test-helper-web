import instance from '@/utils/serviceUtils'
export function createCode (tableName) {
    return instance.get('/table/create-code', {params: {tableName}})
}
