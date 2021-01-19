<template>
    <div class="full-content project-update"
         :loading="loading.page">
        <div class="oper-bar">
            <el-button size="mini"
                       type="success"
                       plain
                       @click="save"
                       :loading="loading.button"
                       icon="el-icon-check">
                保存
            </el-button>
        </div>
        <el-form ref="form"
                 :model="form"
                 label-width="80px"
                 size="mini"
                 class="form-content">
            <el-tabs tab-position="left" class="full-content" v-model="curTab">
                <el-tab-pane label="基础数据" name="basic" style="overflow: auto;">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="项目名称" prop="name" :rules="rules.name">
                                <el-input v-model="form.name" placeholder="请输入" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <template v-if="!form.id">
                        <el-row>
                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item label="版本号" prop="versionNo" :rules="versionNoRules">
                                    <el-input v-model="form.versionNo" placeholder="请输入" maxlength="15"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item label="版本说明" prop="versionDesc" :rules="versionDescRules">
                                    <el-input v-model="form.versionDesc"
                                              type="textarea"
                                              placeholder="请输入"
                                              maxlength="255"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                    <template v-else>
                        <el-row>
                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item label="版本号" prop="versionNo" :rules="versionNoRules">
                                    <div style="display: flex;">
                                        <el-select v-model="form.versionNo" placeholder="请选择" style="flex: 1;">
                                            <el-option
                                                    v-for="item in options.version"
                                                    :key="item.versionNo"
                                                    :label="item.versionNo"
                                                    :value="item.versionNo">
                                                <div style="display: flex;">
                                                    <span>{{ item.versionNo }}</span>
                                                    <span class="option-remark">{{ item.remark }}</span>
                                                </div>
                                            </el-option>
                                        </el-select>
                                        <el-button icon="el-icon-plus" size="mini" plain @click="visible.version=true">添加新版本</el-button>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </el-tab-pane>
                <el-tab-pane label="授权" name="auth" style="overflow: auto;">
                    <el-row class="full-content" v-if="curTab === 'auth'">
                        <ProjectAuth project-id="1" @set-data="setAuth" :auths="auths"></ProjectAuth>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="操作记录" name="operLog" v-if="form.id" style="overflow: auto;">
                    <el-row class="full-content" v-if="curTab === 'operLog'">
                        <OperLog targetTb="tb_project" :targetId="form.id"></OperLog>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <EditVersion
                title="添加新版本"
                :visible="visible.version"
                :project-version="versionForm"
                @cancel="visible.version = false"
                @confirm="handleConfirm"></EditVersion>
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
        Button,
    } from 'element-ui'
    import ProjectAuth from '@/components/ProjectAuth'
    import OperLog from '@/components/OperLog'
    import {loadProject, addProject, saveProject} from '@/service/ProjectService'
    import {queryProjectVersion, addProjectVersion} from '@/service/ProjectVersionService'
    import {OrderType} from "@/constant/ColumnItem";
    import PubSub from "pubsub-js";
    import EditVersion from "@/components/EditVersion";
    export default {
        // name: "ProjectUpdate",
        components: {
            EditVersion,
            'el-form': Form,
            'el-form-item': FormItem,
            'el-row': Row,
            'el-col': Col,
            'el-input': Input,
            'el-tabs': Tabs,
            'el-tab-pane': TabPane,
            'el-select': Select,
            'el-option': Option,
            'el-button': Button,
            ProjectAuth,
            OperLog
        },
        data() {
            const checkVersionNo = (rule, value, callback) => {
                let patter = /^([0-9]+(.[0-9]+)*)$/;
                if (!patter.test(value)) {
                    return callback(new Error('只能输入数字和小数点，例如：1.0.0'))
                } else {
                    callback()
                }
            }
            return {
                curTab: "basic",
                // 授权
                auths: [],
                options: {
                    version: []
                },
                loading: {
                    button: false,
                    page: false
                },
                visible: {
                    version: false
                },
                form: {
                    id: "",
                    name: "",
                    versionNo: "0.0.0",
                    versionDesc: "初版",
                    belongsTo: "",
                    enabled: "",
                    createDate: "",
                    createBy: "",
                    modifyDate: "",
                    modifyBy: ""
                },
                rules: {
                    name: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' },
                        { max: 50, message: '最多输入 50 个字符', trigger: 'blur' }
                    ]
                },
                versionForm: {
                    id: "",
                    projectId: "",
                    versionNo: "",
                    remark: ""
                },
                checkVersionNo,
            }
        },
        computed: {
            user() {
                return this.$cookies.get('user')
            },
            versionNoRules() {
                return this.form.id ? [
                    { required: true, message: '请输入版本号', trigger: 'blur' }
                ] : [
                    { required: true, message: '请输入版本号', trigger: 'blur' },
                    { validator: this.checkVersionNo}
                ];
            },
            versionDescRules() {
                return this.form.id ? [] : [
                    { required: true, message: '请输入版本说明', trigger: 'blur' }
                ];
            }
        },
        mounted() {
            if (this.$route.query &&
                this.$route.query.id &&
                this.form.id !== this.$route.query.id) {
                this.form.id = this.$route.query.id;
                this.versionForm.projectId = this.$route.query.id;
            }
        },
        activated() {
            if (this.$route.query &&
                this.$route.query.id &&
                this.form.id !== this.$route.query.id) {
                this.form.id = this.$route.query.id;
                this.versionForm.projectId = this.$route.query.id;
            }
        },
        watch: {
            "form.id"(val) {
                this.load(val);
                this.queryVersion(val);
            }
        },
        methods: {
            save() {
                this.loading.button = true;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const project = this.initData();
                        if (this.form.id) {
                            saveProject(project).then(res => {
                                this.loading.button = false;
                                if (res.success) {
                                    this.$message.success('保存成功');
                                    PubSub.publish("closeCurTab")
                                }
                            });
                        }
                        else {
                            addProject(project).then(res => {
                                this.loading.button = false;
                                if (res.success) {
                                    this.$message.success('保存成功');
                                    PubSub.publish("closeCurTab")
                                }
                            });
                        }
                    } else {
                        this.loading.button = false;
                        this.$message.error('表单验证失败');
                    }
                })
            },
            initData() {
                let belongsTo = this.form.belongsTo;
                let projectVersions = [];
                if (!this.form.id) {
                    belongsTo = this.user.id;
                    projectVersions = [{
                        versionNo: this.form.versionNo,
                        remark: this.form.versionDesc
                    }];
                }
                return {
                    project: {
                        id: this.form.id,
                        name: this.form.name,
                        versionNo: this.form.versionNo,
                        belongsTo,
                        enabled: this.form.enabled,
                        createDate: this.form.createDate,
                        createBy: this.form.createBy,
                        modifyDate: this.form.modifyDate,
                        modifyBy: this.form.modifyBy
                    },
                    projectVersions,
                    auths: this.auths
                }
            },
            setAuth(auths) {
                this.auths = auths;
            },
            load(id) {
                const vm = this;
                loadProject(id).then(res => {
                    vm.form = res.result.project;
                    vm.auths = res.result.authUsers;
                });
            },
            queryVersion(projectId) {
                queryProjectVersion({
                    pagination: false,
                    sorts: [
                        {
                            column: "versionNo",
                            order: OrderType.DESC
                        }
                    ],
                    filter: {
                        projectId
                    }
                }).then(res => {
                    this.options.version = res.result.result;
                    this.versionForm.versionNo = this.options.version[0].versionNo;
                });
            },
            handleConfirm(versionForm) {
                const vm = this;
                vm.loading.page = true;
                vm.visible.version = false;
                addProjectVersion(versionForm).then(() => {
                    vm.loading.page = false;
                    vm.queryVersion(versionForm.projectId);
                    vm.form.versionNo = versionForm.versionNo;
                });
            }
        }
    }
</script>

<style scoped>
    .project-update {
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
