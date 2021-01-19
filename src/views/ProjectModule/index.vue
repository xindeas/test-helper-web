<template>
    <div class="project full-content router-view">
        <div class="page-header">项目模块</div>
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
                       @click="handleAdd"
                       icon="el-icon-plus">
                新增
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
                <template slot="editBtn" slot-scope="scope">
                    <el-button size="mini"
                               icon="el-icon-edit"
                               @click="handleEdit(scope)">编辑</el-button>
                </template>
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
    import { queryProjectModule } from '@/service/ProjectModuleService'
    import {ColumnType, OrderType} from "@/constant/ColumnItem";
    export default {
        name: 'ProjectModule',
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
                        key: ["project", "name"],
                        label: "项目"
                    },
                    {
                        key: ["projectModule", "moduleName"],
                        label: "模块名"
                    },
                    {
                        key: ["projectModule", "createDate"],
                        label: "创建日期",
                        width: "200px",
                        type: ColumnType.DATE,
                        sortColumn: "createDate",
                        sortAble: true,
                        sortOrder: OrderType.DESC
                    },
                    {
                        key: ["projectModule", "modifyDate"],
                        label: "修改日期",
                        width: "200px",
                        type: ColumnType.DATE
                    },
                ],
                editUrl: 'ProjectModule/update'
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
                queryProjectModule({
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
                    title: '新增模块',
                    url: this.editUrl
                });
            },
            handleEdit(scope) {
                this.edit({
                    title: '编辑模块',
                    url: this.editUrl,
                    query: {
                        id: scope.row.projectModule.id
                    }
                });
            }
        }
    }
</script>

<style scoped>
</style>
