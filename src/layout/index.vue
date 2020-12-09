<template>
    <div class="layout full-content">
        <el-container class="full-content">
            <el-aside width="auto">
                <HeaderMenu :menu="menuList" :collapse="collapse"/>
            </el-aside>
            <el-container>
                <el-header class="layout-header">
                    <i v-if="collapse" class="fold el-icon-s-unfold" @click="collapse = !collapse"></i>
                    <i v-else class="fold un-fold el-icon-s-unfold" @click="collapse = !collapse"></i>
                    <div class="header-blank"></div>
                    <el-select v-model="myProject" placeholder="请选择项目" size="mini" @change="changeCurProject">
                        <el-option
                                v-for="item in projectList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <el-dropdown trigger="hover">
                        <el-avatar :size="45" :src="user.avatar">
                            <img src="@/assets/pic.png"/>
                        </el-avatar>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>个人主页</el-dropdown-item>
                            <el-dropdown-item>我的周报</el-dropdown-item>
                            <el-dropdown-item @click.native="logout" divided>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-header>
                <el-main class="layout-main">
                    <div class="tabs-bar">
                        <template v-for="(item, index) of curTabs">
                            <div :class="{'tab-item': true, 'current': item.name === curRoute.name}"
                                 :key="index"
                                 @click="jumpTo(item.name)">
                                {{item.meta.title}}
                                <i class="el-icon-close"
                                   @click.stop="closeTab(item.name)"></i>
                            </div>
                        </template>
                    </div>
                    <div class="router-content">
                        <transition name="mainRouter">
                            <keep-alive :include="curTabsName">
                                <router-view/>
                            </keep-alive>
                        </transition>
                    </div>
                </el-main>
                <el-footer class="layout-footer">测试工具V0.0.1</el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import HeaderMenu from '@/layout/components/HeaderMenu';
    import {
        Container,
        Header,
        Aside,
        Main,
        Footer,
        Avatar,
        Select,
        Option,
        Dropdown,
        DropdownMenu,
        DropdownItem
    } from 'element-ui'
    import { queryProjectForOptions } from '@/service/ProjectService'
    import PubSub from "pubsub-js"

    export default {
        name: 'Layout',
        components: {
            HeaderMenu,
            'el-container': Container,
            'el-header': Header,
            'el-aside': Aside,
            'el-main': Main,
            'el-footer': Footer,
            'el-avatar': Avatar,
            'el-select': Select,
            'el-option': Option,
            'el-dropdown': Dropdown,
            'el-dropdown-menu': DropdownMenu,
            'el-dropdown-item': DropdownItem,
        },
        data () {
            return {
                subscriber: "",
                myProject: '',
                projectList: [],
                collapse: false,
                menuList: [
                    {
                        label: '我的项目',
                        index: 'Project',
                        icon: 'el-icon-folder-opened',
                        children: []
                    },
                    {
                        label: '工作台',
                        index: 'WorkBench',
                        icon: 'el-icon-files',
                        children: []
                    },
                    {
                        label: '缺陷管理',
                        index: 'Defect',
                        icon: 'el-icon-date',
                        children: []
                    },
                    {
                        label: '测试用例',
                        index: 'TestCase',
                        icon: 'el-icon-notebook-1',
                        children: []
                    }
                ]
            }
        },
        computed: {
            user() {
                return this.$cookies.get('user')
            },
            curTabs() {
                return this.$store.state.router.curTabs;
            },
            curTabsName() {
                return this.$store.state.router.curTabs.map(item => item.name);
            },
            curRoute() {
                return this.$route
            }
        },
        created() {
            this.loadProject()
        },
        mounted () {
            // 添加订阅
            this.subscriber = PubSub.subscribe("flushProject", this.loadProject)
        },
        methods: {
            loadProject () {
                const vm = this
                queryProjectForOptions({
                    userId: vm.user.id
                }).then(res => {
                    if (res && res.result && Array.isArray(res.result)) {
                        vm.projectList = res.result
                    }
                })
            },
            logout() {
                this.$cookies.remove('user')
                this.$router.push('Login')
            },
            // 切换项目
            changeCurProject(val) {
                const project = this.projectList.find(item => item.id === val);
                this.$store.commit("project/setCurProject", project)
            },
            jumpTo(name) {
                this.$router.push(name)
            },
            closeTab(name) {
                const arr = this.curTabs.filter(item => item.name !== name);
                this.$store.commit('router/setCurTabs', arr);
                if (name === this.curRoute.name && arr.length > 0) {
                    this.$router.push(arr[arr.length - 1].name);
                } else if (name === this.curRoute.name && arr.length > 0) {
                    this.$router.push("/Home");
                }
            }
        },
        destroyed() {
            // 取消订阅
            PubSub.unsubscribe(this.subscriber);
        }
    }
</script>
<style>
    .layout {
        overflow: hidden;
    }
    .el-aside {
        box-shadow: 0 0 1em  #999999;
    }
    .layout-header {
        padding: 0;
        width: 100%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }
    .layout-header>* {
        cursor: pointer;
    }
    .layout-header .fold {
        margin: 0 .5em;
        font-size: 1.5em;
        transform: rotate(0);
        transition: all 250ms;
    }
    .layout-header .un-fold {
        margin: 0 .5em;
        font-size: 1.5em;
        transform: rotate(180deg);
    }
    .layout-header .el-select {
        margin: 0 .5em;
    }
    .layout-header .el-dropdown {
        margin: 0 1em;
    }
    .header-blank {
        flex: 1;
    }
    .layout-main {
        height: 100%;
        padding: 0 1em 0 1em;
        box-sizing: border-box;
        overflow: hidden;
    }
    .layout-main .tabs-bar {
        height: 2.5rem;
        background-color: #f5f7fa;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
    }
    .layout-main .tabs-bar .tab-item {
        display: inline-block;
        height: 100%;
        vertical-align: middle;
        background-color: #f5f7fa;
        cursor: pointer;
        padding: 0 1rem;
        font-size: .7em;
        border-bottom: 1px solid #dcdfe6;
    }
    .layout-main .tabs-bar .tab-item.current {
        background-color: white;
        border-left: 1px solid #dcdfe6;
        border-right: 1px solid #dcdfe6;
        border-bottom: 1px solid transparent;
    }
    .layout-main .tabs-bar .tab-item:after {
        content: '';
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }
    .layout-main .tabs-bar .el-icon-close {
        transition: all 250ms;
        font-size: 1.2em;
    }
    .layout-main .tabs-bar .el-icon-close:hover {
        transform: rotate(180deg);
    }
    .layout-main .router-content {
        overflow: auto;
        box-sizing: border-box;
        height: calc(100% - 2.5rem);
    }
    .layout-footer {
        height: 3em;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #909399;
        padding: 0;
        margin: 0 16px;
        background-color: white;
    }
    .mainRouter-enter-active, .mainRouter-leave-active {
        position: absolute;
        transition: all .5s;
    }
    .mainRouter-enter {
        position: absolute;
        opacity: 0;
        transform: translateX(50%);
    }
    .mainRouter-leave-to {
        position: absolute;
        opacity: 0;
        z-index: -99;
        transform: translateX(-50%);
    }
</style>
