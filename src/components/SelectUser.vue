<template>
    <el-dialog
            :title="title"
            :visible.sync="visibleChild"
            width="50%">
        <div class="table-content">
            <BaseTable ref="baseTable"
                       :column-items="columnItems"
                       :table-data="tableData"
                       :page-total="pageTotal"
                       :table-loading="loading.table"
                       show-check-box
                       @loadTable="loadTable"
                       style="height: calc(100% - 32px);"></BaseTable>
            <el-pagination
                    @size-change="loadTable"
                    @current-change="loadTable"
                    :current-page="pageIndex"
                    :page-sizes="sizeOptions"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageTotal">
            </el-pagination>
        </div>
        <template slot="footer" class="dialog-footer">
            <el-button @click="visibleChild = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="confirmAdd" size="mini">确 定</el-button>
        </template>
    </el-dialog>
</template>

<script>
    import {
        Dialog,
        Button,
        Pagination
    } from "element-ui";
    import BaseTablePage from "@/base/BaseTablePage";
    import {queryUser} from "@/service/UserService";
    import {ColumnType} from "@/constant/ColumnItem";

    export default {
        name: "SelectUser",
        mixins: [BaseTablePage],
        components: {
            'el-dialog': Dialog,
            'el-button': Button,
            'el-pagination': Pagination
        },
        props: {
            title: {
                type: String,
                default: "选择用户"
            },
            visible: {
                type: Boolean,
                default: false
            },
            selectedUserId: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data() {
            return {
                columnItems: [
                    {
                        key: "avatar",
                        label: "头像",
                        type: ColumnType.PIC
                    },
                    {
                        key: "name",
                        label: "用户名"
                    },
                    {
                        key: "login",
                        label: "账号"
                    },
                    {
                        key: "mobile",
                        label: "手机号"
                    },
                    {
                        key: "email",
                        label: "邮箱"
                    },
                    {
                        key: "createDate",
                        label: "创建日期",
                        width: "200px",
                        type: ColumnType.DATE
                    }
                ],
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
        mounted() {
            this.loadTable();
        },
        methods: {
            loadTable() {
                const vm = this
                this.loading.table = true
                queryUser({
                    pageIndex: vm.pageIndex,
                    pageSize: vm.pageSize,
                    pagination: true,
                    filter: {
                        idNotIn: vm.selectedUserId
                    }
                }).then(res => {
                    vm.afterLoadTable(res);
                }, () => {
                    vm.loading.table = false
                })
            },
            confirmAdd() {
                const arr = this.$refs.baseTable.selection || [];
                this.$emit("confirmAdd", arr)
            }
        }
    }
</script>

<style scoped>
.table-content {
    height: 40vh;
}
</style>
