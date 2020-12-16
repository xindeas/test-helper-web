<template>
    <div class="project full-content router-view">
        <div class="table-content">
            <BaseTable ref="baseTable"
                       :column-items="columnItems"
                       :table-data="tableData"
                       :page-total="pageTotal"
                       :table-loading="loading.table"
                       show-check-box
                       @loadTable="loadTable"
                       style="height: calc(100% - 32px);"></BaseTable>
            <el-pagination
                    @size-change="loadTable"
                    @current-change="loadTable"
                    :current-page="pageIndex"
                    :page-sizes="sizeOptions"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageTotal">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import BaseTablePage from "@/base/BaseTablePage";
    import {Pagination} from "element-ui";
    import {ColumnType} from "@/constant/ColumnItem";
    import {queryLog} from "@/service/LogService";

    export default {
        name: "OperLog",
        mixins: [BaseTablePage],
        components: {
            'el-pagination': Pagination
        },
        props: {
            targetTb: {
                type: String,
            },
            targetId: {
                type: [String, Number],
            }
        },
        data() {
            return {
                columnItems: [
                    {
                        key: "remark",
                        label: "描述",
                        width: "500px"
                    },
                    {
                        key: "createBy",
                        label: "操作人",
                    },
                    {
                        key: "createDate",
                        label: "操作日期",
                        width: "200px",
                        type: ColumnType.DATE
                    }
                ],
            }
        },
        mounted() {
            this.loadTable();
        },
        activated() {
            this.loadTable();
        },
        methods: {
            loadTable() {
                const vm = this
                this.loading.table = true
                queryLog({
                    pageIndex: vm.pageIndex,
                    pageSize: vm.pageSize,
                    pagination: true,
                    filter: {
                        targetTb: this.targetTb,
                        targetId: this.targetId
                    },
                    sorts: [{
                        column: 'createDate',
                        order: 'DESC'
                    }]
                }).then(res => {
                    vm.afterLoadTable(res);
                }, () => {
                    vm.loading.table = false
                })
            },
        }
    }
</script>

<style scoped>
.table-content {
    height: 100%;
}
</style>
