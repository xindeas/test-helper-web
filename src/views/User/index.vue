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
    import { queryUser } from '@/service/UserService'
    import {ColumnType, OrderType} from "@/constant/ColumnItem";
    export default {
        name: 'User',
        mixins: [BaseTablePage],
        components: {
            'el-button': Button,
            'el-pagination': Pagination
        },
        computed: {
            curProject() {
                return this.$store.state.project.curProject;
            }
        },
        data() {
            return {
                columnItems: [
                    {
                        key: 'name',
                        label: "用户名"
                    },
                    {
                        key: 'login',
                        label: "账号"
                    },
                    {
                        key: 'mobile',
                        label: "手机"
                    },
                    {
                        key: 'email',
                        label: "邮箱"
                    },
                    {
                        key: "moduleName",
                        label: "模块名"
                    },
                    {
                        key: "createDate",
                        label: "创建日期",
                        width: "200px",
                        type: ColumnType.DATE,
                        sortColumn: "createDate",
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
                editUrl: 'User/update'
            }
        },
        mounted() {
            this.loadTable()
        },
        activated() {
            this.loadTable()
        },
        watch: {
            curProject() {
                this.loadTable()
            }
        },
        methods: {
            loadTable(param) {
                const vm = this
                this.loading.table = true
                const sortArr = this.getSortParams();
                const filter = {};
                if (vm.curProject && vm.curProject.id) {
                    filter.projectId = vm.curProject.id
                }
                queryUser({
                    pageIndex: vm.pageIndex,
                    pageSize: vm.pageSize,
                    pagination: true,
                    ...param,
                    filter,
                    sorts: sortArr
                }).then(res => {
                    vm.afterLoadTable(res);
                }, () => {
                    vm.loading.table = false
                })
            },
            handleAdd() {
                this.add({
                    title: '新增用户',
                    url: this.editUrl
                });
            },
            handleEdit(scope) {
                this.edit({
                    title: '编辑用户',
                    url: this.editUrl,
                    query: {
                        id: scope.row.id
                    }
                });
            }
        }
    }
</script>

<style scoped>
</style>
