<template>
    <div class="project full-content router-view">
        <div class="page-header">我的项目</div>
        <div class="oper-bar"></div>
        <div class="table-content" ref="tableContent">
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
    </div>
</template>

<script>
    import {
        Table,
        TableColumn
    } from 'element-ui'
    export default {
        name: 'Project',
        components: {
            'el-table': Table,
            'el-table-column': TableColumn
        },
        data() {
            return {
                tableHeight: 0,
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]
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
        methods: {
        }
    }
</script>

<style scoped>

</style>
