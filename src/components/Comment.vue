<template>
    <div class="comment full-content">
        <div style="height: calc(100% - 50px);" class="scroll-content">
            <div class="comm-user">
                <el-avatar size="medium" src="https://empty">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
                <div class="comm-user-info">
                    <div class="user-name">名称</div>
                    <div class="comm-date info-txt">2020-03-02</div>
                </div>
            </div>
            <div class="comm-content">这是为什么呢</div>
            <div class="info-txt comm-return"><i class="el-icon-chat-square"></i>回复</div>
        </div>
        <div style="height: 50px;">
            <el-input v-model="form.remark"
                      size="mini"
                      placeholder="请在此输入您的伟论"
                      show-word-limit
                      maxlength="500">
                <el-button slot="append" icon="el-icon-s-promotion"></el-button>
            </el-input>
        </div>
    </div>
</template>

<script>
    import {
        Input,
        Button,
        Avatar,
    } from 'element-ui'
    export default {
        name: "Comment",
        components: {
            'el-input': Input,
            'el-button': Button,
            'el-avatar': Avatar,
        },
        props: {
            defectId: {
                type: [Number, String]
            }
        },
        data() {
            return {
                form: {
                    defectId: "",
                    userId: "",
                    reactCommentId: "",
                    remark: ""
                },
            }
        }
    }
</script>

<style scoped>
    .comm-user {
        display: flex;
        align-items: center;
        margin-bottom: .5em;
    }
    .comm-user-info {
        margin-left: 1em;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .user-name {
        font-weight: bold;
    }
    .comm-date {
        font-size: .7em;
    }
    .comm-content {
        margin-bottom: .5em;
    }
    .comm-return {
        font-size: .9em;
        cursor: pointer;
    }
</style>
