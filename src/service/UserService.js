import instance from '@/utils/serviceUtils'

export function login (loginForm) {
    return instance.post('/user/login', loginForm)
}
export function queryUser () {
    return instance.post('/user/query', {
        pageIndex: 0,
        pageSize: 10,
        pagination: true,
        filter: {
            name: 'admin'
        }
    })
}
