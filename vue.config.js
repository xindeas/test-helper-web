module.exports = {
    devServer: {
        host: 'localhost',
        port: '4300',
        open: true
        // proxy: {
        //     "/user": {
        //         target: "http://localhost:4400",
        //         changeOrigin: true // 是否开启跨域,
        //     },
        //     "/project": {
        //         target: "http://localhost:4400",
        //         changeOrigin: true // 是否开启跨域,
        //     }
        // }
    }
}
