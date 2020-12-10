import instance from '@/utils/serviceUtils'

export function queryLog (param) {
    return instance.post('/log/query', param);
}
