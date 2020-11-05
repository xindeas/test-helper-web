<template>
    <el-menu
            :default-active="activeIndex"
            class="header-menu"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
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
            }
        },
        data () {
            return {
            }
        },
        computed: {
            activeIndex () {
                return 'Home'
            }
        }
    }
</script>

<style scoped>

</style>
