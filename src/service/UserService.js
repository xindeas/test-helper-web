import instance from '@/utils/serviceUtils'

export function login (loginForm) {
    return instance.post('/user/login', loginForm)
}
export function queryUser (params) {
    return instance.post('/user/query', params)
}
