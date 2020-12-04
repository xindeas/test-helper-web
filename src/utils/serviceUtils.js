import axios from 'axios'
import { Message } from 'element-ui';
import VueCookies from "vue-cookies";
import {refreshUserCookie} from "./cookieUtil";
import router from '@/router'

const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 10000
})
// 请求拦截，登录信息已过期的用户被拦截
instance.interceptors.request.use(
    config => {
        // 登录请求直接放行
        if (config && config.url === '/user/login') {
            return config
        }
        const user = VueCookies.get('user')
        if (user) {
            refreshUserCookie(user)
            return config;
        }
        else {
            Message.error('太久未操作，请重新登录！')
            router.push('/Login')
            return Promise.reject({
                response: {
                    status: 400
                }
            });
        }
    },
    err => {
        return Promise.reject(err);
    }
)
// 回调拦截，自动拼装提示信息
instance.interceptors.response.use(
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
export default instance
