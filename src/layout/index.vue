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
                    <el-popover
                            placement="bottom"
                            title="提醒"
                            width="200"
                            trigger="hover">
                        <el-badge slot="reference" :value="12" :max="99" class="header-icon">
                            <i class="el-icon-bell"></i>
                        </el-badge>
                        <div>缺陷新增提醒</div>
                    </el-popover>
                    <el-popover
                            placement="bottom"
                            title="消息"
                            width="200"
                            trigger="hover">
                        <el-badge slot="reference" hidden :value="10" :max="99" class="header-icon">
                            <i class="el-icon-message"></i>
                        </el-badge>
                        <template>
                            <div>某某某回复了你的评论</div>
                        </template>
                    </el-popover>
                    <el-select v-model="myProject" placeholder="请选择项目" size="mini" @change="changeCurProject" clearable>
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
                            <el-dropdown-item>修改密码</el-dropdown-item>
                            <el-dropdown-item @click.native="logout" divided>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-header>
                <el-main class="layout-main">
                    <div class="tabs-bar">
                        <template v-for="(item, index) of curTabs">
                            <div :class="{'tab-item': true, 'current': item.name === curRoute.name}"
                                 :key="index"
                                 @click="jumpTo(item)">
                                {{item.meta.title}}
                                <i class="el-icon-close"
                                   v-if="curTabs.length > 1 || item.name !== 'Home'"
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
                <el-footer class="layout-footer">测试工具V{{version}}</el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import HeaderMenu from '@/layout/components/HeaderMenu';
    import config from '../../package.json'
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
        DropdownItem,
        Badge,
        Popover
    } from 'element-ui'
    import {queryProjectForOptions} from '@/service/ProjectService'
    import {logout} from '@/service/UserService'
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
            'el-badge': Badge,
            'el-popover': Popover
        },
        data() {
            return {
                subscriber: "",
                closeTabScriber: "",
                myProject: '',
                projectList: [],
                collapse: false,
                menuList: [
                    {
                        label: '项目',
                        index: 'Project',
                        icon: 'el-icon-folder-opened',
                        children: [
                            {
                                label: '我的项目',
                                index: 'Project',
                                icon: 'el-icon-folder-opened',
                            },
                            {
                                label: '项目模块',
                                index: 'ProjectModule',
                                icon: 'el-icon-s-grid',
                            },
                        ]
                    },
                    {
                        label: '缺陷管理',
                        index: 'Defect',
                        icon: 'el-icon-date',
                        children: []
                    },
                    {
                        label: '工作台',
                        index: 'WorkBench',
                        icon: 'el-icon-files',
                        children: []
                    },
                    {
                        label: '测试用例',
                        index: 'TestCase',
                        icon: 'el-icon-notebook-1',
                        children: []
                    },
                    {
                        label: '用户管理',
                        index: 'User',
                        icon: 'el-icon-user',
                        children: []
                    },
                    {
                        label: '代码生成',
                        index: 'CodeCreator',
                        icon: 'el-icon-cpu',
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
            },
            version() {
                return config.version;
            }
        },
        created() {
            this.loadProject()
        },
        mounted() {
            // 添加订阅
            this.subscriber = PubSub.subscribe("flushProject", this.loadProject)
            this.closeTabScriber = PubSub.subscribe("closeCurTab", this.closeCurTab)
        },
        methods: {
            loadProject() {
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
                logout().then(() => {
                    this.$cookies.remove('user')
                    this.$router.push('Login')
                })
            },
            // 切换项目
            changeCurProject(val) {
                const project = this.projectList.find(item => item.id === val) || {};
                this.$store.commit("project/setCurProject", project)
            },
            jumpTo(item) {
                if (item.path === this.curRoute.path) {
                    return;
                }
                this.$router.push(item)
            },
            closeCurTab() {
                this.closeTab(this.curRoute.name);
            },
            closeTab(name) {
                const arr = this.curTabs.filter(item => item.name !== name);
                this.$store.commit('router/setCurTabs', arr);
                if (name === this.curRoute.name && arr.length > 0) {
                    this.$router.push(arr[arr.length - 1].name);
                } else if (name === this.curRoute.name && arr.length <= 0) {
                    this.$router.push("/Home");
                }
            }
        },
        destroyed() {
            // 取消订阅
            PubSub.unsubscribe(this.subscriber);
            PubSub.unsubscribe(this.closeTabScriber);
        }
    }
</script>
<style>
    .layout {
        overflow: hidden;
    }

    .el-aside {
        box-shadow: 0 0 1em #999999;
    }

    .layout-header {
        padding: 0;
        width: 100%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }

    .layout-header > * {
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
        width: auto;
    }

    .layout-header .el-dropdown {
        margin: 0 1em;
    }

    .layout-header .header-icon {
        margin: 0 .7em;
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
        border-radius: 5px 5px 0 0;
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
        box-sizing: border-box;
        height: calc(100% - 2.5rem);
        position: relative;
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
