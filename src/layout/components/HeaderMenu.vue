<template>
    <el-menu
            :default-active="activeIndex"
            :collapse="collapse"
            unique-opened
            class="header-menu"
            background-color="#43454C"
            text-color="#fff">
        <div class="menu-title primary-txt" @click="goHome">
            <div class="img-content">
                <img src="@/assets/logo.png"/>
            </div>
            <span v-if="!collapse">测试工具</span>
        </div>
        <template v-for="(item, index) of menu">
            <HeaderMenuItem :key="index" :item="item"></HeaderMenuItem>
        </template>
    </el-menu>
</template>

<script>
    import HeaderMenuItem from './HeaderMenuItem';
    import {
        Menu
    } from 'element-ui'
    export default {
        name: 'HeaderMenu',
        components: {
            HeaderMenuItem,
            'el-menu': Menu
        },
        props: {
            menu: {
                type: Array,
                default: () => {
                    return []
                }
            },
            collapse: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
            }
        },
        computed: {
            activeIndex () {
                return this.$route.name
            }
        },
        methods: {
            goHome() {
                this.$router.push('Home')
            }
        }
    }
</script>

<style scoped>
    .el-menu {
        height: 100%;
        position: static;
    }
    .header-menu {
        height: 100%;
        box-sizing: border-box;
    }
    .header-menu:not(.el-menu--collapse) {
        width: 15em;
    }
    .menu-title {
        height: 60px;
        width: 100%;
        cursor: pointer;
        font-weight: bold;
        font-size: 1.2em;
    }
    .menu-title .img-content {
        width: 60px;
        height: 60px;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
    }
    .menu-title .img-content:after {
        content: '';
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }
    .menu-title .img-content img {
        width: 60%;
        height: 60%;
        display: inline-block;
        vertical-align: middle;
    }
</style>
