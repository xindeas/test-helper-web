import axios from 'axios'
import { Message } from 'element-ui';
axios.defaults.baseURL=process.env.VUE_APP_BASE_URL
axios.interceptors.response.use(
    res => {
        if (res.data && !res.data.success) {
            Message.error(res.data.msg || '未知错误')
        }
        return res.data
    },
    error => {
        return Promise.reject(error.response.status) // 返回接口返回的错误信息
    }
)
export function post (url, params) {
    return axios.post(url, params, {
        timeout: 10000
    })
}
