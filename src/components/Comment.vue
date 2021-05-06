<template>
    <div class="comment full-content">
        <div style="height: calc(100% - 50px);" class="scroll-content">
            <template v-for="(item, index) of comments">
                <div class="comm-target" :key="index">
                    <div class="refer-comm" v-if="item.referDefectComment">张三说：{{item.referDefectComment.remark}}</div>
                    <div class="comm-user">
                        <el-avatar size="medium" :src="item.user.avatar">
                            <img src="@/assets/pic.png"/>
                        </el-avatar>
                        <div class="comm-user-info">
                            <div class="user-name">{{item.user.name}}</div>
                            <div class="comm-date info-txt">{{item.defectComment.createDate | dateTimeFormatter}}</div>
                        </div>
                    </div>
                    <div class="comm-content">{{item.defectComment.remark}}</div>
                    <div class="info-txt comm-return"><i class="el-icon-chat-square"></i>回复</div>
                </div>
            </template>
        </div>
        <div style="height: 50px;">
            <el-input v-model="form.remark"
                      size="mini"
                      placeholder="请在此输入您的伟论"
                      show-word-limit
                      maxlength="500">
                <el-button slot="append" icon="el-icon-s-promotion" @click="addComment"></el-button>
            </el-input>
        </div>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
            <template>这是一段信息</template>
            <template slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {
        Input,
        Button,
        Avatar,
        Dialog,
        Message
    } from 'element-ui'
    import {addDefectComment, queryDefectComment} from '@/service/DefectCommentService'
    import {OrderType} from "@/constant/ColumnItem";

    export default {
        name: "Comment",
        components: {
            'el-input': Input,
            'el-button': Button,
            'el-avatar': Avatar,
            'el-dialog': Dialog
        },
        props: {
            defectId: {
                type: [Number, String]
            }
        },
        data() {
            return {
                pageIndex: 0,
                pageSize: 10,
                form: {
                    defectId: "",
                    userId: "",
                    reactCommentId: "",
                    remark: ""
                },
                dialogVisible: false,
                comments: []
            }
        },
        computed: {
            user() {
                return this.$cookies.get('user')
            }
        },
        mounted() {
            this.form.defectId = this.defectId;
            this.form.userId = this.user.id;
            this.queryComment();
        },
        methods: {
            addComment() {
                if (!this.form.remark) {
                    Message.error('请输入评论内容！')
                    return;
                }
                addDefectComment({
                    defectComment: this.form
                }).then(() => {
                    Message.success('评论发表成功！')
                    this.queryComment();
                });
            },
            queryComment() {
                const vm = this;
                queryDefectComment({
                    pageIndex: vm.pageIndex,
                    pageSize: vm.pageSize,
                    pagination: true,
                    filter: {
                        defectId: vm.defectId
                    },
                    sorts: [{
                        column: 'createDate',
                        order: OrderType.DESC
                    }]
                }).then(res => {
                    vm.comments = res.result.result.reverse();
                });
            }
        }
    }
</script>

<style scoped>
    .comm-target {
        margin-bottom: 2em;
    }

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
        margin-left: 2rem;
    }

    .comm-return {
        font-size: .9em;
        cursor: pointer;
        margin-left: 2rem;
    }

    .refer-comm {
        background-color: #dcdfe6;
        border-radius: .5em;
        font-size: .5em;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 50%;
        padding: 1em;
    }
</style>
