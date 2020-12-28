<template>
    <div class="project full-content router-view">
        <div class="page-header">缺陷管理</div>
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
                       @click="handleOper"
                       icon="el-icon-check">
                一键操作
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
                       style="height: calc(100% - 32px);">
            </BaseTable>
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
    import BaseTablePage from "@/base/BaseTablePage";
    import { queryDefect } from '@/service/DefectService'
    import {ColumnType, OrderType} from "@/constant/ColumnItem";
    export default {
        name: 'WorkBench',
        mixins: [BaseTablePage],
        components: {
            'el-button': Button,
            'el-pagination': Pagination
        },
        data() {
            return {
                columnItems: [
                    {
                        key: "defectNo",
                        label: "缺陷编号"
                    },
                    {
                        key: "targetVer",
                        label: "目标版本"
                    },
                    {
                        key: "module",
                        label: "所属模块"
                    },
                    {
                        key: "title",
                        label: "标题"
                    },
                    {
                        key: "remark",
                        label: "详细描述",
                        width: "300px"
                    },
                    {
                        key: "createDate",
                        label: "创建日期",
                        width: "200px",
                        type: ColumnType.DATE,
                        sortAble: true,
                        sortOrder: OrderType.DESC
                    },
                    {
                        key: "modifyDate",
                        label: "修改日期",
                        width: "200px",
                        type: ColumnType.DATE
                    },
                ],
                editUrl: 'WorkBench/update'
            }
        },
        mounted() {
            this.loadTable()
        },
        activated() {
            this.loadTable()
        },
        methods: {
            loadTable(param) {
                const vm = this
                this.loading.table = true
                const sortArr = this.getSortParams();
                queryDefect({
                    pageIndex: vm.pageIndex,
                    pageSize: vm.pageSize,
                    pagination: true,
                    ...param,
                    sorts: sortArr
                }).then(res => {
                    vm.afterLoadTable(res);
                }, () => {
                    vm.loading.table = false
                })
            },
            handleOper() {
                // const vm = this;
                const arr = this.$refs.baseTable.selection;
                if (!arr || arr <= 0) {
                    this.$message.error('请选择至少一条数据');
                    return;
                }

            }
        }
    }
</script>

<style scoped>
</style>
