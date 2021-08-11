<template>
    <div class="project full-content router-view">
        <div class="oper-bar"><el-button size="mini" @click="loadTable">查询</el-button></div>
        <div class="table-content">
            <BaseTable :column-items="columnItems"
                       :table-data="tableData"
                       @loadTable="loadTable"></BaseTable>
        </div>
    </div>
</template>

<script>
    import {
        Button
    } from 'element-ui'
    import BaseTable from "@/layout/components/BaseTable";
    import { queryProject } from '@/service/ProjectService'
    import {ColumnType} from "@/constant/ColumnItem";
    export default {
        name: 'TestCase',
        components: {
            'el-button': Button,
            BaseTable
        },
        data() {
            return {
                tableHeight: 0,
                tableData: [],
                loading: {
                    table: false
                },
                columnItems: [
                    {
                        key: "name",
                        label: "项目名"
                    },
                    {
                        key: "createDate",
                        label: "创建日期",
                        width: "200px",
                        type: ColumnType.DATE
                    }
                ]
            }
        },
        mounted() {
            this.loadTable()
        },
        methods: {
            loadTable() {
                const vm = this
                this.loading.table = true
                queryProject({
                    pageIndex: 0,
                    pageSize: 10,
                    pagination: true
                }).then(res => {
                    vm.loading.table = false
                    if (res && res.result && Array.isArray(res.result.result)) {
                        this.tableData = res.result.result
                    }
                })
            },
            handleEdit(index, row) {
                console.log(index, row)
            }
        }
    }
</script>

<style scoped>
</style>
