<template>
    <el-dialog
            :title="title"
            :visible.sync="visibleChild"
            :close-on-click-modal="false"
            width="30%">
        <el-form ref="versionForm"
                 :model="versionForm"
                 label-width="80px"
                 size="mini"
                 class="form-content">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="版本号" prop="versionNo" :rules="versionRules.versionNo">
                        <el-input v-model="versionForm.versionNo" placeholder="请输入" maxlength="15"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="版本说明" prop="remark" :rules="versionRules.remark">
                        <el-input v-model="versionForm.remark"
                                  type="textarea"
                                  :rows="4"
                                  placeholder="请输入"
                                  maxlength="255"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template slot="footer" class="dialog-footer">
            <el-button @click="visibleChild = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="handleConfirm" size="mini">确 定</el-button>
        </template>
    </el-dialog>
</template>

<script>
    import {Button, Col, Dialog, Form, FormItem, Input, Row} from 'element-ui'
    import {checkUniqueNo} from "@/service/ProjectVersionService";

    export default {
        name: "EditVersion",
        props: {
            title: {
                type: String,
                default: ""
            },
            visible: {
                type: Boolean,
                default: false
            },
            projectVersion: {
                type: Object
            }
        },
        components: {
            'el-form': Form,
            'el-form-item': FormItem,
            'el-row': Row,
            'el-col': Col,
            'el-input': Input,
            'el-button': Button,
            'el-dialog': Dialog,
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
            const checkUnqNo = (rule, value, callback) => {
                checkUniqueNo(this.versionForm.projectId, value, this.versionForm.id).then(res => {
                    if (res.success) {
                        return callback()
                    }
                    return callback(new Error(value + '已存在'))
                })
            }
            return {
                versionForm: {
                    id: "",
                    projectId: "",
                    versionNo: "",
                    remark: ""
                },
                versionRules: {
                    versionNo: [
                        { required: true, message: '请输入版本号', trigger: 'blur' },
                        { validator: checkVersionNo, trigger: 'blur'},
                        { validator: checkUnqNo, trigger: 'blur'}
                    ],
                    remark: [
                        { required: true, message: '请输入版本说明', trigger: 'blur' },
                    ]
                },
            }
        },
        computed: {
            visibleChild: {
                get() {
                    return this.visible;
                },
                set(val) {
                    this.$emit("cancel", val);
                }
            }
        },
        watch: {
            projectVersion(val) {
                this.versionForm = val;
            }
        },
        mounted() {
            this.versionForm = this.projectVersion;
        },
        methods: {
            handleConfirm() {
                const vm = this;
                this.$refs.versionForm.validate((valid) => {
                    if (valid) {
                        vm.$emit("confirm", this.versionForm)
                    } else {
                        this.$message.error('表单验证失败');
                    }

                });
            }
        }
    }
</script>

<style scoped>

</style>
