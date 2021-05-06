import instance from '@/utils/serviceUtils'

export function login(loginForm) {
    return instance.post('/user/login', loginForm)
}

export function logout() {
    return instance.post('/user/logout')
}

export function queryUser(params) {
    return instance.post('/user/query', params)
}

export function addUser(user) {
    return instance.post('/user/add', user);
}

export function saveUser(user) {
    return instance.post('/user/save', user);
}

export function loadUser(id) {
    return instance.get('/user/load/' + id);
}
