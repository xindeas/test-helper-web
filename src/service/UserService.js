import { post } from '@/utils/serviceUtils'

export function login (loginForm) {
    return post('/user/login', loginForm)
}
export function query () {
    return post('/user/query', {
        pageIndex: 0,
        pageSize: 10,
        pagination: true
    })
}
