<template>
    <div class="full-content">
        <el-form ref="form" :model="form" label-width="80px" size="mini">
            <el-divider content-position="center">基础数据</el-divider>
            <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                    <el-form-item label="项目名称">
                        <el-input v-model="form.name" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-divider content-position="center">授权</el-divider>
            <el-row style="height: 400px;">
                <ProjectAuth></ProjectAuth>
            </el-row>
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
        Divider
    } from 'element-ui'
    import ProjectAuth from '@/components/ProjectAuth'
    export default {
        name: "ProjectUpdate",
        components: {
            'el-form': Form,
            'el-form-item': FormItem,
            'el-row': Row,
            'el-col': Col,
            'el-input': Input,
            'el-divider': Divider,
            ProjectAuth
        },
        data() {
            return {
                form: {
                    name: ""
                }
            }
        },
        mounted() {
            console.log(this.$route.params);
        },
    }
</script>

<style scoped>
.full-content {
    box-sizing: border-box;
    padding: 1em;
}
</style>
