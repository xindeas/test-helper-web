<template>
    <div class="project full-content router-view">
        <div class="page-header">代码生成</div>
        <div class="oper-bar">
            <el-select v-model="tableName" placeholder="请选择" style="width: 200px;" size="mini" filterable clearable>
                <el-option
                        v-for="item in options.table"
                        :key="item.tableName"
                        :label="item.tableName"
                        :value="item.tableName">
                    <div style="display: flex;">
                        <span>{{ item.tableName }}</span>
                        <span class="option-remark">{{ item.tableComment }}</span>
                    </div>
                </el-option>
            </el-select>
            <el-button size="mini"
                       type="primary"
                       plain
                       :disabled="!tableName"
                       :loading="loading.button"
                       @click="createCode"
                       icon="el-icon-plus">
                生成
            </el-button>
        </div>
    </div>
</template>

<script>
    import {
        Button,
        Select,
        Option
    } from 'element-ui'
    import BaseTablePage from "@/base/BaseTablePage";
    import { getAllTable, createCode } from '@/service/TableService'
    import {ColumnType, OrderType} from "@/constant/ColumnItem";
    export default {
        name: 'Defect',
        mixins: [BaseTablePage],
        components: {
            'el-button': Button,
            'el-select': Select,
            'el-option': Option,
        },
        data() {
            return {
                tableName: "",
                options: {
                    table: []
                },
                columnItems: [
                    {
                        key: "defectNo",
                        label: "缺陷编号"
                    },
                    {
                        key: "targetVer",
                        label: "目标版本"
                    },
                    {
                        key: "module",
                        label: "所属模块"
                    },
                    {
                        key: "title",
                        label: "标题"
                    },
                    {
                        key: "remark",
                        label: "详细描述",
                        width: "300px"
                    },
                    {
                        key: "createDate",
                        label: "创建日期",
                        width: "200px",
                        type: ColumnType.DATE,
                        sortAble: true,
                        sortOrder: OrderType.DESC
                    },
                    {
                        key: "modifyDate",
                        label: "修改日期",
                        width: "200px",
                        type: ColumnType.DATE
                    },
                ],
                editUrl: 'Defect/update'
            }
        },
        mounted() {
            this.queryOptions();
        },
        methods: {
            loadTable(param) {
                const vm = this
                this.loading.table = true
                const sortArr = this.getSortParams();
                getAllTable({
                    pageIndex: vm.pageIndex,
                    pageSize: vm.pageSize,
                    pagination: true,
                    ...param,
                    sorts: sortArr
                }).then(res => {
                    vm.afterLoadTable(res);
                }, () => {
                    vm.loading.table = false
                })
            },
            createCode() {
                createCode(this.tableName).then(res => {
                    if (res.success) {
                        this.$message.success('代码生成成功，请到D盘codeCreator文件夹下查看')
                    }
                })
            },
            queryOptions() {
                getAllTable().then(res => {
                    this.options.table = res.result;
                })
            }
        }
    }
</script>

<style scoped>

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
