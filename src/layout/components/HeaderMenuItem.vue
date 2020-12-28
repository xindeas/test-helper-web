<template>
    <el-submenu v-if="item.children && item.children.length > 0" :index="item.index">
        <template slot="title">
            <i v-if="item.icon" :class="item.icon"></i>
            <span slot="title">{{item.label}}</span>
        </template>
        <template v-for="(child, index) of item.children">
            <HeaderMenuItem :item="child" :key="index"></HeaderMenuItem>
        </template>
    </el-submenu>
    <el-menu-item v-else :index="item.index" @click="linkTo()">
        <i v-if="item.icon" :class="item.icon"></i>
        <template slot="title">{{item.label}}</template>
    </el-menu-item>
</template>

<script>
    import {
        MenuItem,
        Submenu
    } from 'element-ui'
    export default {
        name: 'HeaderMenuItem',
        components: {
            'el-menu-item': MenuItem,
            'el-submenu': Submenu,
        },
        props: {
            item: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        methods: {
            linkTo() {
                this.$router.push(this.item.index)
            }
        }
    }
</script>

<style scoped>

</style>
