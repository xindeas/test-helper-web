<template>
    <div class="full-content project-update">
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
                 label-width="80px"
                 size="mini"
                 class="form-content">
            <el-tabs tab-position="left" style="height: 100%;" v-model="curTab">
                <el-tab-pane label="基础数据" name="basic">
                    <el-row v-if="curTab === 'basic'">
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                            <el-form-item label="项目名称" prop="name">
                                <el-input v-model="form.name" placeholder="请输入" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="授权" name="auth">
                    <el-row class="full-content" v-if="curTab === 'auth'">
                        <ProjectAuth project-id="1" @set-data="setAuth" :auths="auths"></ProjectAuth>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="操作记录" name="operLog" v-if="form.id">
                    <el-row class="full-content" v-if="curTab === 'operLog'">
                        <OperLog targetTb="targetTb" targetId="targetId"></OperLog>
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
        Button
    } from 'element-ui'
    import ProjectAuth from '@/components/ProjectAuth'
    import OperLog from '@/components/OperLog'
    import {loadProject} from '@/service/ProjectService'
    export default {
        name: "ProjectUpdate",
        components: {
            'el-form': Form,
            'el-form-item': FormItem,
            'el-row': Row,
            'el-col': Col,
            'el-input': Input,
            'el-tabs': Tabs,
            'el-tab-pane': TabPane,
            'el-button': Button,
            ProjectAuth,
            OperLog
        },
        data() {
            return {
                curTab: "basic",
                // 授权
                auths: [],
                form: {
                    id: "",
                    name: "",
                    belongsTo: ""
                },
                rules: {
                    name: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' },
                        { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        mounted() {
            if (this.$route.params && this.$route.params.id) {
                this.load(this.$route.params.id);
            }
        },
        methods: {
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        console.log('成功');
                    } else {
                        this.$message.error('表单验证失败');
                    }
                })
            },
            setAuth(auths) {
                this.auths = auths;
            },
            load(id) {
                const vm = this;
                loadProject(id).then(res => {
                    vm.form = res.result;
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
</style>
