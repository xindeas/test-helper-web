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
                       @click="handleOper"
                       icon="el-icon-check">
                一键操作
            </el-button>
            <el-button size="mini"
                       type="primary"
                       plain
                       :loading="loading.button"
                       @click="openFilter"
                       icon="el-icon-setting">
                过滤条件
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
        <el-drawer
                title="过滤条件"
                :visible.sync="visible.filter"
                direction="rtl">
            <el-form ref="form"
                     :rules="rules"
                     :model="filterForm"
                     label-width="100px"
                     size="mini"
                     class="form-content">
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="缺陷编号" prop="defectNo">
                            <el-input v-model="filterForm.defectNo" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="filterForm.title" placeholder="模糊查询" maxlength="255" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="所属项目" prop="projectId">
                            <el-select v-model="filterForm.projectId" filterable placeholder="请选择" @change="projectIdChange" clearable>
                                <el-option
                                        v-for="item in options.project"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <transition name="el-zoom-in-top">
                    <el-row v-if="filterForm.projectId">
                        <el-col :span="23">
                            <el-form-item label="目标版本" prop="targetVer">
                                <el-select v-model="filterForm.targetVer" filterable placeholder="请选择" multiple clearable>
                                    <el-option
                                            v-for="item in options.projectVersion"
                                            :key="item.versionNo"
                                            :label="item.versionNo"
                                            :value="item.versionNo">
                                        <div style="display: flex;">
                                            <span>{{ item.versionNo }}</span>
                                            <span class="option-remark">{{ item.remark }}</span>
                                        </div>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="23">
                            <el-form-item label="所属模块" prop="moduleId">
                                <el-select v-model="filterForm.moduleId" filterable placeholder="请选择" multiple clearable>
                                    <el-option
                                            v-for="item in options.projectModule"
                                            :key="item.id"
                                            :label="item.moduleName"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </transition>
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="指派给" prop="assignTo">
                            <el-select v-model="filterForm.assignTo" filterable placeholder="请选择" clearable multiple >
                                <el-option
                                        v-for="item in options.user"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="追踪测试人" prop="testBy">
                            <el-select v-model="filterForm.testBy" filterable placeholder="请选择" multiple clearable>
                                <el-option
                                        v-for="item in options.user"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="发现人" prop="findBy">
                            <el-select v-model="filterForm.findBy" filterable placeholder="请选择" multiple clearable>
                                <el-option
                                        v-for="item in options.user"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="filterForm.status" placeholder="请选择" multiple clearable>
                                <el-option
                                        v-for="item in options.status"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="详细描述" prop="remark" clearable>
                            <el-input v-model="filterForm.remark"
                                      type="textarea"
                                      :rows="4"
                                      placeholder="模糊查询"
                                      maxlength="65535"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-drawer>
    </div>
</template>

<script>
    import {
        Button,
        Pagination,
        Drawer,
        Form,
        FormItem,
        Input,
        Row,
        Col,
        Select,
        Option
    } from 'element-ui'
    import BaseTablePage from "@/base/BaseTablePage";
    import { queryDefect } from '@/service/DefectService'
    import {ColumnType, OrderType} from "@/constant/ColumnItem";
    import {DefectStatusDesc} from "@/constant/DefectStatus";
    import {enumToOptions, getFilterParams} from "@/utils";
    import {queryUser} from "@/service/UserService";
    import {queryProjectForOptions} from "@/service/ProjectService";
    import {queryProjectModule} from "@/service/ProjectModuleService";
    import {queryProjectVersion} from "@/service/ProjectVersionService";
    export default {
        name: 'WorkBench',
        mixins: [BaseTablePage],
        components: {
            'el-button': Button,
            'el-pagination': Pagination,
            'el-drawer': Drawer,
            'el-form': Form,
            'el-form-item': FormItem,
            'el-row': Row,
            'el-col': Col,
            'el-input': Input,
            'el-select': Select,
            'el-option': Option,
        },
        data() {
            return {
                columnItems: [
                    {
                        key: ["defect", "defectNo"],
                        sortColumn: "defectNo",
                        label: "缺陷编号"
                    },
                    {
                        key: ["project", "name"],
                        label: "项目名称"
                    },
                    {
                        key: ["defect", "targetVer"],
                        sortColumn: "defectNo",
                        label: "目标版本"
                    },
                    {
                        key: ["defect", "module"],
                        sortColumn: "module",
                        label: "所属模块"
                    },
                    {
                        key: ["defect", "status"],
                        sortColumn: "status",
                        label: "状态",
                        type: ColumnType.BOOLEAN,
                        enumObj: DefectStatusDesc
                    },
                    {
                        key: ["defect", "title"],
                        sortColumn: "title",
                        label: "标题"
                    },
                    {
                        key: ["defect", "remark"],
                        sortColumn: "remark",
                        label: "详细描述",
                        width: "300px"
                    },
                    {
                        key: ["defect", "createDate"],
                        sortColumn: "createDate",
                        label: "创建日期",
                        width: "200px",
                        type: ColumnType.DATE,
                        sortAble: true,
                        sortOrder: OrderType.DESC
                    },
                    {
                        key: ["defect", "modifyDate"],
                        sortColumn: "modifyDate",
                        label: "修改日期",
                        width: "200px",
                        type: ColumnType.DATE
                    },
                ],
                editUrl: 'WorkBench/update',
                filterForm: {
                    projectId: "",
                    title: "",
                    defectNo: "",
                    remark: "",
                    targetVer: "",
                    moduleId: "",
                    assignTo: "",
                    testBy: "",
                    findBy: "",
                    status: ["NEW", "SOLVING", "REOPEN"],
                },
                rules: {},
                visible: {
                    filter: false
                },
                options: {
                    status: enumToOptions(DefectStatusDesc),
                    user: [],
                    project: [],
                    projectVersion: [],
                    projectModule: []
                },
            }
        },
        computed: {
            user() {
                return this.$cookies.get('user')
            },
            curProject() {
                return this.$store.state.project.curProject;
            }
        },
        watch: {
            curProject(val) {
                if (val) {
                    this.filterForm.projectId = val.id;
                    this.projectIdChange(val.id);
                }
                this.loadTable();
            }
        },
        mounted() {
            this.mount()
        },
        activated() {
            this.mount()
        },
        methods: {
            mount() {
                this.queryUserOptions();
                this.queryProjectOptions();
                this.loadTable()
            },
            loadTable(param) {
                const vm = this
                this.loading.table = true
                const sortArr = this.getSortParams();
                queryDefect({
                    pageIndex: vm.pageIndex,
                    pageSize: vm.pageSize,
                    pagination: true,
                    ...param,
                    sorts: sortArr,
                    filter: getFilterParams(vm.filterForm)
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

            },
            openFilter() {
                this.visible.filter = true;
            },
            projectIdChange(val) {
                this.filterForm.targetVer = "";
                this.filterForm.moduleId = "";
                this.queryProjectVersionOptions(val);
                this.queryProjectModuleOptions(val);
            },
            queryUserOptions() {
                queryUser({
                    pagination: false
                }).then(res => {
                    this.options.user = res.result.result
                })
            },
            queryProjectOptions() {
                const vm = this;
                queryProjectForOptions({
                    userId: vm.user.id
                }).then(res => {
                    if (res && res.result && Array.isArray(res.result)) {
                        vm.options.project = res.result
                    }
                })
            },
            queryProjectModuleOptions(projectId) {
                const vm = this;
                vm.options.projectModule = [];
                if (!projectId) {
                    return;
                }
                queryProjectModule({
                    pagination: false,
                    filter: {
                        projectId
                    }
                }).then(res => {
                    if (res && res.result && res.result.result && Array.isArray(res.result.result)) {
                        vm.options.projectModule = res.result.result.map(item => item.projectModule)
                    }
                })
            },
            queryProjectVersionOptions(projectId) {
                const vm = this;
                vm.options.projectVersion = [];
                if (!projectId) {
                    return;
                }
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
                    if (res && res.result && res.result.result && Array.isArray(res.result.result)) {
                        vm.options.projectVersion = res.result.result
                    }
                })
            },
        }
    }
</script>

<style scoped>

    .option-remark {
        flex: 1;
        color: #8492a6;
        font-size: 13px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: right;
        width: 10em;
    }
</style>
