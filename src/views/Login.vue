<template>
    <div class="full-content login">
        <div class="form-content">
            <h2>登录</h2>
            <el-form :model="loginForm" :rules="rules" ref="loginForm">
                <el-form-item prop="login">
                    <el-input v-model="loginForm.login"
                              autocomplete="off"
                              prefix-icon="el-icon-user">
                    </el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input v-model="loginForm.pwd"
                              @keyup.enter.native="submitForm"
                              prefix-icon="el-icon-lock"
                              show-password>
                    </el-input>
                </el-form-item>
                <el-row class="btn-row">
                    <el-col :span="12" style="text-align: left;">
                        <el-button style="height: 0;" type="text" @click="submitForm">注册</el-button>
                        <el-button style="height: 0;" type="text" @click="submitForm">忘记密码？</el-button>
                    </el-col>
                </el-row>
                <el-row class="btn-row">
                    <el-button class="full-btn" type="primary" @click="submitForm" :loading="loginLoading">登录</el-button>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {
        Form,
        FormItem,
        Input,
        Button,
        Row,
        Col
    } from 'element-ui'
    import { login } from '@/service/UserService.js'
    import { refreshUserCookie } from '@/utils/cookieUtil'
    export default {
        name: 'Login',
        components: {
            'el-form': Form,
            'el-form-item': FormItem,
            'el-input': Input,
            'el-button': Button,
            'el-row': Row,
            'el-col': Col
        },
        data () {
            return {
                loginLoading: false,
                loginForm: {
                    login: 'admin',
                    pwd: 'admin'
                },
                rules: {
                    login: [{ required: true, message: '请输入账号', trigger: 'blur' }],
                    pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
                }
            }
        },
        methods: {
            submitForm () {
                this.$refs.loginForm.validate().then((status) => {
                    if (status) {
                        this.loginLoading = true
                        login(this.loginForm).then(data => {
                            this.loginLoading = false
                            if (data.success) {
                                refreshUserCookie(data.result)
                                this.$router.push('Home')
                            }
                        }, () => {
                            this.loginLoading = false
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .login {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #43454C;
    }
    .form-content {
        display: block;
        width: 25em;
        padding: 1em;
        border-radius: .5em;
        background-color: rgba(255, 255, 255, .7);
    }
    .form-content h2 {
        text-align: center;
    }
    .btn-row {
        margin-bottom: .5em;
    }
    .full-btn {
        display: block;
        width: 100%;
    }
</style>
