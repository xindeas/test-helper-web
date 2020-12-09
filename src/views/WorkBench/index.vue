<template>
    <div class="project full-content router-view">
        <div class="page-header">工作台</div>
        <div class="oper-bar">
            <el-button size="mini"
                       plain
                       :loading="loading.button"
                       @click="loadTable"
                       icon="el-icon-search">
                查询
            </el-button>
            <el-button size="mini"
                       type="primary"
                       plain
                       :loading="loading.button"
                       @click="loadTable"
                       icon="el-icon-plus">
                新增
            </el-button>
            <el-button size="mini"
                       type="primary"
                       plain
                       :loading="loading.button"
                       @click="enabled"
                       icon="el-icon-check">
                启用
            </el-button>
            <el-button size="mini"
                       type="danger"
                       plain
                       :loading="loading.button"
                       @click="disabled"
                       icon="el-icon-close">
                禁用
            </el-button>
        </div>
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
    import {
        Button,
        Pagination
    } from 'element-ui'
    import BaseTable from "@/layout/components/BaseTable";
    import { queryProject, enableProject, disableProject } from '@/service/ProjectService'
    import {ColumnType} from "@/constant/ColumnItem";
    import BaseTablePage from "@/base/BaseTablePage";
    export default {
        name: 'WorkBench',
        mixins: [BaseTablePage],
        components: {
            'el-button': Button,
            'el-pagination': Pagination,
            BaseTable
        },
        data() {
            return {
                columnItems: [
                    {
                        key: "name",
                        label: "项目名"
                    },
                    {
                        key: "enabled",
                        label: "启用状态",
                        type: ColumnType.BOOLEAN,
                        enumObj: {
                            true: "启用",
                            false: "禁用"
                        }
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
            loadTable(param) {
                const vm = this
                this.loading.table = true
                queryProject({
                    pageIndex: vm.pageIndex,
                    pageSize: vm.pageSize,
                    pagination: true,
                    ...param
                }).then(res => {
                    vm.afterLoadTable(res);
                }, () => {
                    vm.loading.table = false
                })
            },
            handleEdit(index, row) {
                console.log(index, row)
            },
            enabled() {
                const vm = this;
                const arr = this.$refs.baseTable.selection;
                if (!arr || arr <= 0) {
                    this.$message.error('请选择至少一条数据');
                    return;
                }
                vm.loading.button = true
                const idArr = arr.map(item => item.id);
                enableProject(idArr).then(res => {
                    vm.afterEnabled(res);
                }, () => {
                    vm.loading.button = false
                })
            },
            disabled() {
                const vm = this;
                const arr = this.$refs.baseTable.selection;
                if (!arr || arr <= 0) {
                    this.$message.error('请选择至少一条数据');
                    return;
                }
                vm.loading.button = true
                const idArr = arr.map(item => item.id);
                disableProject(idArr).then(res => {
                    vm.afterDisabled(res);
                }, () => {
                    vm.loading.button = false
                })
            }
        }
    }
</script>

<style scoped>
</style>
