<template>
    <div class="project full-content router-view">
        <div class="page-header">我的项目</div>
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
                       style="height: calc(100% - 32px);">
                <template slot="editBtn" slot-scope="scope">
                    <el-button size="mini"
                               icon="el-icon-edit"
                               @click="handleEdit(scope)">编辑</el-button>
                    <el-button size="mini"
                               icon="el-icon-date"
                               @click="openVersion(scope)">版本记录</el-button>
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
        <el-drawer
                :loading="loading.button"
                :title="version.title"
                :visible.sync="visible.version"
                direction="rtl">
            <div class="full-content scroll-content drawer-body">
                <el-steps direction="vertical">
                    <template v-for="(item, index) of version.versions">
                        <el-step :key="index"
                                 :title="item.versionNo"
                                 :status="item.versionNo === version.curVer ? 'process' : 'wait'"
                                 :description="item.remark"></el-step>
                    </template>
                </el-steps>
            </div>
        </el-drawer>
    </div>
</template>

<script>
    import {
        Button,
        Pagination,
        Steps,
        Step,
        Drawer
    } from 'element-ui'
    import BaseTablePage from "@/base/BaseTablePage";
    import { queryProject, enableProject, disableProject, deleteProject } from '@/service/ProjectService'
    import { queryProjectVersion } from '@/service/ProjectVersionService'
    import {ColumnType, OrderType} from "@/constant/ColumnItem";
    import {EnableStatus} from "@/constant/StatusIcon";
    import PubSub from "pubsub-js"
    export default {
        name: 'Project',
        mixins: [BaseTablePage],
        components: {
            'el-button': Button,
            'el-pagination': Pagination,
            'el-steps': Steps,
            'el-step': Step,
            'el-drawer': Drawer,
        },
        data() {
            return {
                visible: {
                    version: false
                },
                version: {
                    title: "",
                    curVer: "",
                    versions: []
                },
                columnItems: [
                    {
                        key: ["project", "name"],
                        label: "项目名"
                    },
                    {
                        key: ["project", "versionNo"],
                        label: "当前版本"
                    },
                    {
                        key: ["project", "enabled"],
                        label: "启用状态",
                        type: ColumnType.BOOLEAN,
                        enumObj: EnableStatus
                    },
                    {
                        key: "userCount",
                        label: "授权用户数"
                    },
                    {
                        key: ["project", "createDate"],
                        label: "创建日期",
                        width: "200px",
                        type: ColumnType.DATE,
                        sortColumn: "createDate",
                        sortAble: true,
                        sortOrder: OrderType.DESC
                    },
                    {
                        key: ["project", "modifyDate"],
                        label: "修改日期",
                        width: "200px",
                        type: ColumnType.DATE
                    },
                ],
                editUrl: 'Project/update'
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
                queryProject({
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
            handleAdd() {
                this.add('新增项目', this.editUrl);
            },
            handleEdit(scope) {
                this.edit('编辑项目', this.editUrl, {
                    id: scope.row.project.id
                });
            },
            enabled() {
                const vm = this;
                const arr = this.$refs.baseTable.selection;
                if (!arr || arr <= 0) {
                    this.$message.error('请选择至少一条数据');
                    return;
                }
                vm.loading.button = true
                const idArr = arr.map(item => item.project.id);
                enableProject(idArr).then(res => {
                    vm.afterEnabled(res);
                    PubSub.publish("flushProject")
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
                const idArr = arr.map(item => item.project.id);
                disableProject(idArr).then(res => {
                    vm.afterDisabled(res);
                    PubSub.publish("flushProject")
                }, () => {
                    vm.loading.button = false
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
                const idArr = arr.map(item => item.project.id);
                deleteProject(idArr).then(res => {
                    vm.afterDelete(res);
                    PubSub.publish("flushProject")
                }, () => {
                    vm.loading.button = false
                })
            },
            openVersion(scope) {
                this.loading.button = true;
                queryProjectVersion({
                    pagination: false,
                    filter: {
                        projectId: scope.row.project.id
                    },
                    sorts: [
                        {
                            column: "versionNo",
                            order: OrderType.DESC
                        }
                    ]
                }).then(res => {
                    this.visible.version = true;
                    this.loading.button = false;
                    this.version.title = scope.row.project.name + "版本记录";
                    this.version.curVer = scope.row.project.versionNo;
                    this.version.versions = res.result.result;
                });
            }
        }
    }
</script>

<style scoped>
    .drawer-body {
        padding: 1em;
    }
</style>
