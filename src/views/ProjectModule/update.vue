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
            <el-tabs tab-position="left" style="height: 100%;" v-model="curTab">
                <el-tab-pane label="基础数据" name="basic">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="所属项目" prop="projectId">
                                <el-select v-model="form.projectId" filterable placeholder="请选择">
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
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <el-form-item label="模块名" prop="moduleName">
                                <el-input v-model="form.moduleName" placeholder="请输入" maxlength="255"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="操作记录" name="operLog" v-if="form.id">
                    <el-row class="full-content" v-if="curTab === 'operLog'">
                        <OperLog targetTb="tb_project_module" :targetId="form.id"></OperLog>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </div>
</template>

<script>
    import {Button, Col, Form, FormItem, Input, Option, Row, Select, TabPane, Tabs} from 'element-ui'
    import OperLog from '@/components/OperLog'
    import {addProjectModule, loadProjectModule, saveProjectModule} from '@/service/ProjectModuleService'
    import {DefectStatusDesc} from "@/constant/DefectStatus"
    import {enumToOptions} from "@/utils";
    import PubSub from "pubsub-js";
    import {queryProjectForOptions} from "@/service/ProjectService";

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
            OperLog
        },
        data() {
            return {
                curTab: "basic",
                form: {
                    id: "",
                    projectId: "",
                    moduleName: "",
                    createDate: "",
                    createBy: "",
                    modifyDate: "",
                    modifyBy: ""
                },
                options: {
                    status: enumToOptions(DefectStatusDesc),
                    user: [],
                    project: [],
                    projectVersion: []
                },
                rules: {
                    projectId: [
                        {required: true, message: '请选择项目', trigger: 'blur'},
                    ],
                    moduleName: [
                        {required: true, message: '请输入模块名', trigger: 'blur'},
                        {min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur'}
                    ]
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
        activated() {
            this.mount();
        },
        methods: {
            mount() {
                if (this.curProject) {
                    this.form.projectId = this.curProject.id;
                }
                this.queryProjectOptions();
                if (this.$route.params &&
                    this.$route.params.id &&
                    this.form.id !== this.$route.params.id) {
                    this.form.id = this.$route.params.id;
                    this.load(this.form.id);
                }
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const projectModule = this.initData();
                        if (this.form.id) {
                            saveProjectModule(projectModule).then(res => {
                                if (res.success) {
                                    this.$message.success('保存成功');
                                    PubSub.publish("closeCurTab")
                                }
                            });
                        } else {
                            addProjectModule(projectModule).then(res => {
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
                return {
                    id: this.form.id,
                    projectId: this.form.projectId,
                    moduleName: this.form.moduleName,
                    createDate: this.form.createDate,
                    createBy: this.form.createBy,
                    modifyDate: this.form.modifyDate,
                    modifyBy: this.form.modifyBy
                }
            },
            load(id) {
                const vm = this;
                loadProjectModule(id).then(res => {
                    vm.form = res.result;
                });
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
            }
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
