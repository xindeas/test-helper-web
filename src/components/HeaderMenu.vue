<template>
    <el-menu
            :default-active="activeIndex"
            :collapse="collapse"
            unique-opened
            class="header-menu"
            background-color="#43454C"
            text-color="#fff">
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
</style>
