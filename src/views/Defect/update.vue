<template>
    <div class="full-content defect-update">
        <div class="oper-bar">
            <el-button size="mini"
                       type="success"
                       plain
                       @click="save"
                       icon="el-icon-check">
                保存
            </el-button>
        </div>
        <el-form ref="form"
                 :rules="rules"
                 :model="form"
                 label-width="100px"
                 size="mini"
                 class="form-content">
            <el-tabs tab-position="left" class="full-content" v-model="curTab">
                <el-tab-pane label="基础数据" name="basic" style="overflow: auto;">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.id">
                            <el-form-item label="缺陷编号" prop="defectNo">
                                <el-input v-model="form.defectNo" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="标题" prop="title">
                                <el-input v-model="form.title" placeholder="请输入" maxlength="255"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="所属项目" prop="projectId">
                                <el-select v-model="form.projectId" filterable placeholder="请选择" @change="projectIdChange" :disabled="form.id?true:false">
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
                    <el-row v-if="form.projectId">
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="目标版本" prop="targetVer">
                                <el-select v-model="form.targetVer" filterable placeholder="请选择">
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
                    </el-row>
                    <el-row v-if="form.projectId">
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="所属模块" prop="moduleId">
                                <el-select v-model="form.moduleId" filterable placeholder="请选择">
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
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="指派给" prop="assignTo">
                                <el-select v-model="form.assignTo" filterable placeholder="请选择" clearable>
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
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="追踪测试人" prop="testBy">
                                <el-select v-model="form.testBy" filterable placeholder="请选择">
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
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="form.id">
                            <el-form-item label="状态" prop="status">
                                <el-select v-model="form.status" placeholder="请选择">
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
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="详细描述" prop="remark">
                                <el-input v-model="form.remark"
                                          type="textarea"
                                          placeholder="请输入"
                                          maxlength="65535"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="评论" name="comment" v-if="form.id" style="overflow: auto;">
                    <el-row class="full-content" v-if="curTab === 'comment'">
                        <Comment :defect-id="form.id"></Comment>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="操作记录" name="operLog" v-if="form.id" style="overflow: auto;">
                    <el-row class="full-content" v-if="curTab === 'operLog'">
                        <OperLog targetTb="tb_defect" :targetId="form.id"></OperLog>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </div>
</template>

<script>
    import {
        Form,
        FormItem,
        Input,
        Row,
        Col,
        Tabs,
        TabPane,
        Select,
        Option,
        Button
    } from 'element-ui'
    import OperLog from '@/components/OperLog'
    import Comment from '@/components/Comment'
    import {loadDefect, addDefect, saveDefect} from '@/service/DefectService'
    import {queryUser} from '@/service/UserService'
    import {DefectStatusDesc} from "@/constant/DefectStatus"
    import {enumToOptions} from "@/utils";
    import PubSub from "pubsub-js";
    import {queryProjectForOptions} from "@/service/ProjectService";
    import {queryProjectVersion} from "@/service/ProjectVersionService";
    import {queryProjectModule} from "@/service/ProjectModuleService";
    import {OrderType} from "@/constant/ColumnItem";
    export default {
        components: {
            'el-form': Form,
            'el-form-item': FormItem,
            'el-row': Row,
            'el-col': Col,
            'el-input': Input,
            'el-tabs': Tabs,
            'el-tab-pane': TabPane,
            'el-button': Button,
            'el-select': Select,
            'el-option': Option,
            OperLog,
            Comment
        },
        data() {
            return {
                curTab: "basic",
                form: {
                    id: "",
                    projectId: "",
                    title: "",
                    defectNo: "",
                    remark: "",
                    targetVer: "",
                    moduleId: "",
                    assignTo: "",
                    testBy: "",
                    findBy: "",
                    status: "NEW",
                    createDate: "",
                    createBy: "",
                    modifyDate: "",
                    modifyBy: ""
                },
                options: {
                    status: enumToOptions(DefectStatusDesc),
                    user: [],
                    project: [],
                    projectVersion: [],
                    projectModule: []
                },
                rules: {
                    projectId: [
                        { required: true, message: '请选择项目', trigger: 'blur' },
                    ],
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' },
                        { max: 50, message: '最多输入 50 个字符', trigger: 'blur' }
                    ],
                    remark: [
                        { required: true, message: '请输入详细描述', trigger: 'blur' },
                        { max: 65535, message: '最多输入 65535 个字符', trigger: 'blur' }
                    ],
                    moduleId: [
                        { required: true, message: '请选择所属模块', trigger: 'blur' }
                    ],
                    targetVer: [
                        { required: true, message: '请选择目标版本', trigger: 'blur' }
                    ],
                    testBy: [
                        { required: true, message: '请选择追踪测试人', trigger: 'blur' }
                    ],
                }
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
        mounted() {
            this.mount();
        },
        methods: {
            projectIdChange(val) {
                this.form.targetVer = "";
                this.form.moduleId = "";
                this.queryProjectVersionOptions(val);
                this.queryProjectModuleOptions(val);
            },
            mount() {
                this.queryUserOptions();
                this.queryProjectOptions();
                if (this.$route.query &&
                    this.$route.query.id &&
                    this.form.id !== this.$route.query.id) {
                    this.form.id = this.$route.query.id;
                    this.load(this.form.id);
                }
                // 新增时，设置默认值
                if (!this.form.id) {
                    // 默认追踪测试人是自己
                    this.form.testBy = this.user.id;
                    if (this.curProject) {
                        this.form.projectId = this.curProject.id;
                        this.projectIdChange(this.form.projectId);
                    }
                }
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const project = this.initData();
                        if (this.form.id) {
                            saveDefect(project).then(res => {
                                if (res.success) {
                                    this.$message.success('保存成功');
                                    PubSub.publish("closeCurTab")
                                }
                            });
                        }
                        else {
                            addDefect(project).then(res => {
                                if (res.success) {
                                    this.$message.success('保存成功');
                                    PubSub.publish("closeCurTab")
                                }
                            });
                        }
                    } else {
                        this.$message.error('表单验证失败');
                    }
                })
            },
            initData() {
                let findBy = this.form.findBy;
                if (!this.form.id) {
                    findBy = this.user.id;
                }
                return {
                    id: this.form.id,
                    projectId: this.form.projectId,
                    title: this.form.title,
                    defectNo: this.form.defectNo,
                    remark: this.form.remark,
                    targetVer: this.form.targetVer,
                    moduleId: this.form.moduleId,
                    assignTo: this.form.assignTo,
                    testBy: this.form.testBy,
                    findBy,
                    status: this.form.status,
                    createDate: this.form.createDate,
                    createBy: this.form.createBy,
                    modifyDate: this.form.modifyDate,
                    modifyBy: this.form.modifyBy,
                }
            },
            load(id) {
                const vm = this;
                loadDefect(id).then(res => {
                    vm.form = res.result;
                    vm.queryProjectVersionOptions(vm.form.projectId);
                    vm.queryProjectModuleOptions(vm.form.projectId);
                });
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
    .defect-update {
        box-sizing: border-box;
        padding: 1em;
        overflow: hidden;
    }
    .oper-bar {
        text-align: right;
        height: 3em;
    }
    .form-content {
        height: calc(100% - 3em);
        overflow: auto;
    }
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
