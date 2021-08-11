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
                               plain
                               @click="handleEdit(scope)">编辑</el-button>
                    <el-button size="mini"
                               icon="el-icon-date"
                               plain
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
            <div class="full-content drawer-body">
                <div class="drawer-tool-bar">
                    <el-button size="mini"
                               plain
                               type="primary"
                               icon="el-icon-plus"
                               @click="addVersion">新增版本</el-button>
                </div>
                <el-steps direction="vertical"
                          class="scroll-content drawer-step-body">
                    <template v-for="(item, index) of version.versions">
                        <el-step :key="index"
                                 :title="item.versionNo"
                                 :status="item.versionNo === version.curVer ? 'process' : 'wait'"
                                 :description="item.remark">
                            <template slot="icon"><i class="el-icon-menu"></i></template>
                            <template slot="title">
                                {{item.versionNo}}
                                <el-button size="mini"
                                           plain
                                           icon="el-icon-edit"
                                           @click="editVersion(item)">编辑</el-button>
                                <el-popconfirm
                                        v-if="item.versionNo !== version.curVer"
                                        title="确定切换吗？"
                                        @confirm="switchVer(item)"
                                >
                                    <el-button slot="reference"
                                               size="mini"
                                               plain
                                               icon="el-icon-right">切换</el-button>
                                </el-popconfirm>
                                <el-popconfirm
                                        v-if="item.versionNo !== version.curVer"
                                        title="确定删除吗？"
                                        @confirm="deleteVersion(item)"
                                >
                                    <el-button slot="reference"
                                               size="mini"
                                               type="danger"
                                               plain
                                               icon="el-icon-delete">删除</el-button>
                                </el-popconfirm>
                            </template>
                            <template slot="description">
                                <div style="margin-bottom: 10px;">{{item.remark}}</div>
                            </template>
                        </el-step>
                    </template>
                </el-steps>
            </div>
        </el-drawer>
        <EditVersion
                :title="versionForm.id ? '修改版本' + versionForm.versionNo : '添加新版本'"
                :visible="visible.versionEdit"
                :project-version="versionForm"
                @cancel="visible.versionEdit = false"
                @confirm="handleConfirm"></EditVersion>
    </div>
</template>

<script>
    import {Button, Drawer, Pagination, Popconfirm, Step, Steps} from 'element-ui'
    import BaseTablePage from "@/base/BaseTablePage";
    import {deleteProject, disableProject, enableProject, queryProject, switchVersion} from '@/service/ProjectService'
    import {queryProjectVersion, saveProjectVersion, deleteProjectVersion, addProjectVersion} from '@/service/ProjectVersionService'
    import {ColumnType, OrderType} from "@/constant/ColumnItem";
    import {EnableStatus} from "@/constant/StatusIcon";
    import PubSub from "pubsub-js"
    import EditVersion from "@/components/EditVersion";

    export default {
        name: 'MyProject',
        mixins: [BaseTablePage],
        components: {
            EditVersion,
            'el-button': Button,
            'el-pagination': Pagination,
            'el-steps': Steps,
            'el-step': Step,
            'el-drawer': Drawer,
            'el-popconfirm': Popconfirm,
        },
        data() {
            return {
                visible: {
                    version: false,
                    versionEdit: false
                },
                version: {
                    projectId: "",
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
                versionForm: {
                    id: "",
                    projectId: "",
                    versionNo: "",
                    remark: ""
                },
                editUrl: 'MyProject/update'
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
                this.add({
                    title: '新增项目',
                    url: this.editUrl
                });
            },
            handleEdit(scope) {
                this.edit({
                    title: '编辑项目',
                    url: this.editUrl,
                    query: {
                        id: scope.row.project.id
                    }
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
                this.version.title = scope.row.project.name + "版本记录";
                this.version.curVer = scope.row.project.versionNo;
                this.version.projectId = scope.row.project.id;
                this.queryVersion(scope.row.project.id);
            },
            queryVersion(projectId) {
                queryProjectVersion({
                    pagination: false,
                    filter: {
                        projectId
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
                    this.version.versions = res.result.result;
                });
            },
            deleteVersion(item) {
                const vm = this;
                deleteProjectVersion([item.id]).then(() => {
                    vm.$message.info('删除成功');
                    vm.queryVersion(item.projectId);
                });
            },
            switchVer(item) {
                const vm = this;
                switchVersion(item.projectId, item.versionNo).then(() => {
                    this.visible.version = false;
                    vm.loadTable();
                });
            },
            editVersion(item) {
                this.versionForm = JSON.parse(JSON.stringify(item));
                this.visible.versionEdit = true;
            },
            addVersion() {
                this.versionForm = {
                    projectId: this.version.projectId
                };
                this.visible.versionEdit = true;
            },
            handleConfirm(versionForm) {
                const vm = this;
                vm.visible.versionEdit = false;
                if (versionForm.id) {
                    saveProjectVersion(versionForm).then(() => {
                        if (vm.versionForm.versionNo === vm.version.curVer) {
                            this.visible.version = false;
                            vm.loadTable();
                        } else {
                            vm.queryVersion(versionForm.projectId);
                        }
                    });
                } else {
                    addProjectVersion(versionForm).then(() => {
                        if (vm.versionForm.versionNo === vm.version.curVer) {
                            this.visible.version = false;
                            vm.loadTable();
                        } else {
                            vm.queryVersion(versionForm.projectId);
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .drawer-body {
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .drawer-step-body {
        padding: 0 1em;
    }
    .drawer-tool-bar {
        padding: 1em;
    }
</style>
