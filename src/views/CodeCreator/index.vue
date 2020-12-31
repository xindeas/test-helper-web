<template>
    <div>
        <el-button @click="createCode">测试</el-button>
    </div>
</template>

<script>
    import {createCode} from "@/service/TableService"
    import {Button} from "element-ui";

    export default {
        name: "CodeCreator",
        components: {
            'el-button': Button,
        },
        methods: {
            createCode() {
                createCode('tb_project');
            }
        }
    }
</script>

<style scoped>

</style>
