<template>
    <el-dialog
            title="提示"
            :visible.sync="tempVisible"
            width="50%">
        <template>这是一段信息</template>
        <el-form ref="form"
                 :rules="rules"
                 :model="form"
                 label-width="100px"
                 size="mini"
                 class="form-content">
            <template v-for="(item, index) of formConfig">
                <el-row :key="index">
                    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                        <el-form-item :label="item.label" :prop="item.key">
                            <el-input v-model="form[item.key]" placeholder="请输入" maxlength="50"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
        </el-form>
        <template slot="footer" class="dialog-footer">
            <el-button @click="tempVisible = false">取 消</el-button>
            <el-button type="primary" @click="tempVisible = false">确 定</el-button>
        </template>
    </el-dialog>
</template>

<script>
    export default {
        name: "DialogForm",
        props: {
            visible: {
                type: Boolean
            },
            formConfig: {
                type: Array
            }
        },
        data() {
            return {
                form: {},
                rules: []
            }
        },
        computed: {
            tempVisible: {
                get() {
                    return this.visible;
                },
                set(val) {
                    this.$emit("cancel", val);
                }
            }
        },
        mounted() {

        },
        methods: {
            initForm() {

            }
        }
    }
</script>

<style scoped>

</style>
