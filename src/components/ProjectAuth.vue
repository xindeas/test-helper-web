<template>
    <div class="project full-content router-view">
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
                       @click="visible.user = true"
                       icon="el-icon-plus">
                新增
            </el-button>
            <el-button size="mini"
                       type="danger"
                       plain
                       :loading="loading.button"
                       @click="deleteRow"
                       icon="el-icon-delete">
                删除
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
        <SelectUser :visible="visible.user"
                    title="选择授权用户"
                    @confirmAdd="confirmAdd"
                    @cancel="visible.user = false"></SelectUser>
    </div>
</template>

<script>
    import {
        Button,
        Pagination,
    } from 'element-ui'
    import BaseTablePage from "@/base/BaseTablePage";
    import SelectUser from "@/components/SelectUser";
    import { queryProjectAuth, deleteProjectAuth } from '@/service/ProjectAuthService'
    import {ColumnType} from "@/constant/ColumnItem";
    export default {
        name: 'ProjectAuth',
        mixins: [BaseTablePage],
        components: {
            'el-button': Button,
            'el-pagination': Pagination,
            SelectUser
        },
        data() {
            return {
                columnItems: [
                    {
                        key: "avatar",
                        label: "头像",
                        type: ColumnType.PIC
                    },
                    {
                        key: "name",
                        label: "用户名"
                    },
                    {
                        key: "login",
                        label: "账号"
                    },
                    {
                        key: "mobile",
                        label: "手机号"
                    },
                    {
                        key: "email",
                        label: "邮箱"
                    },
                    {
                        key: "createDate",
                        label: "创建日期",
                        width: "200px",
                        type: ColumnType.DATE
                    }
                ],
                visible: {
                    user: false
                },
                options: {
                    user: []
                },
                user: ""
            }
        },
        mounted() {
            this.loadTable();
            this.loadOptions();
        },
        methods: {
            loadOptions() {
                this.options.user = [];
            },
            loadTable(param) {
                const vm = this
                this.loading.table = true
                queryProjectAuth({
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
            deleteRow() {
                const vm = this;
                const arr = this.$refs.baseTable.selection;
                if (!arr || arr <= 0) {
                    this.$message.error('请选择至少一条数据');
                    return;
                }
                vm.loading.button = true
                const idArr = arr.map(item => item.id);
                deleteProjectAuth(idArr).then(() => {
                }, () => {
                    vm.loading.button = false
                })
            },
            confirmAdd(selection) {
                this.visible.user = false;
                console.log(selection);
            }
        }
    }
</script>

<style scoped>
    .table-content {
        height: calc(100% - 2em);
    }
</style>
