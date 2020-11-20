<template>
    <div class="base-table full-content" ref="tableContent">
        <el-table
                :data="tableData"
                stripe
                :max-height="tableHeight"
                style="width: 100%">
            <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {
        Table,
        TableColumn
    } from 'element-ui'
    export default {
        name: 'BaseTable',
        components: {
            'el-table': Table,
            'el-table-column': TableColumn
        },
        data() {
            return {
                tableHeight: 0,
                tableData: []
            }
        },
        mounted() {
            const vm = this
            // 改变表格流体高度
            this.$nextTick(() => {
                vm.tableHeight =  vm.$refs.tableContent.offsetHeight
                window.onresize = () => {
                    vm.tableHeight =  vm.$refs.tableContent.offsetHeight
                }
            })
        },
    }
</script>

<style scoped>

</style>
