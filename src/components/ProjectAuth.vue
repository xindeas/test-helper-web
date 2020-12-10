<template>
    <div class="project full-content router-view">
        <div class="oper-bar">
            <el-button size="mini"
                       type="primary"
                       plain
                       :loading="loading.button"
                       @click="visible.user = true"
                       icon="el-icon-plus">
                新增
            </el-button>
            <el-button size="mini"
                       type="danger"
                       plain
                       :loading="loading.button"
                       @click="deleteRow"
                       icon="el-icon-delete">
                删除
            </el-button>
        </div>
        <div class="table-content">
            <BaseTable ref="baseTable"
                       :column-items="columnItems"
                       :table-data="authData"
                       :page-total="pageTotal"
                       :table-loading="loading.table"
                       show-check-box
                       @loadTable="loadTable"
                       style="height: 100%;"></BaseTable>
        </div>
        <SelectUser :visible="visible.user"
                    v-if="visible.user"
                    :selected-user-id="selectedUserId"
                    title="选择授权用户"
                    @confirmAdd="confirmAdd"
                    @cancel="visible.user = false"></SelectUser>
    </div>
</template>

<script>
    import {
        Button,
    } from 'element-ui'
    import BaseTablePage from "@/base/BaseTablePage";
    import SelectUser from "@/components/SelectUser";
    import { queryProjectAuth } from '@/service/ProjectAuthService'
    import {ColumnType} from "@/constant/ColumnItem";
    export default {
        name: 'ProjectAuth',
        mixins: [BaseTablePage],
        components: {
            'el-button': Button,
            SelectUser
        },
        props: {
            projectId: {
                type: [Number, String]
            },
            auths: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                columnItems: [
                    {
                        key: "userAvatar",
                        label: "头像",
                        type: ColumnType.PIC
                    },
                    {
                        key: "userName",
                        label: "用户名"
                    },
                    {
                        key: "userLogin",
                        label: "账号"
                    },
                    {
                        key: "userMobile",
                        label: "手机号"
                    },
                    {
                        key: "userEmail",
                        label: "邮箱"
                    }
                ],
                visible: {
                    user: false
                }
            }
        },
        computed: {
            selectedUserId() {
                return this.authData.map(item => item.userId);
            },
            authData: {
                set(val) {
                    this.$emit("set-data", val)
                },
                get() {
                    return this.auths;
                }
            }
        },
        mounted() {
            this.loadTable();
        },
        methods: {
            loadTable() {
                const vm = this
                this.loading.table = true
                queryProjectAuth({
                    pagination: false,
                    filter: {
                        projectId: this.projectId
                    }
                }).then(res => {
                    vm.afterLoadTable(res);
                }, () => {
                    vm.loading.table = false
                })
            },
            deleteRow() {
                const arr = this.$refs.baseTable.selection;
                if (!arr || arr <= 0) {
                    this.$message.error('请选择至少一条数据');
                    return;
                }
                this.authData = this.authData.filter(item => {
                    return arr.findIndex(del => del.userId === item.userId) < 0;
                })
            },
            confirmAdd(selection) {
                this.visible.user = false;
                const arr = selection.map(item => {
                    return {
                        userId: item.id,
                        userAvatar: item.avatar,
                        userName: item.name,
                        userLogin: item.login,
                        userMobile: item.mobile,
                        userEmail: item.email
                    }
                })
                this.authData = this.authData.concat(arr);
            },
            afterLoadTable(res) {
                this.loading.table = false
                if (res && res.result) {
                    this.pageTotal = res.result.totalCount;
                    if (Array.isArray(res.result.result)) {
                        this.authData = res.result.result
                    }
                }
            },
        }
    }
</script>

<style scoped>
    .table-content {
        height: calc(100% - 2em);
    }
</style>
