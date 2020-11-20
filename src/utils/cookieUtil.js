import VueCookies from 'vue-cookies'

export function refreshUserCookie(user) {
    VueCookies.set('user', user, '3min')
}
