<template>
    <div class="base-table full-content"
         ref="tableContent">
        <el-table
                ref="baseTable"
                stripe
                :data="tableData"
                :max-height="tableHeight"
                v-loading="tableLoading"
                class="full-content">
            <el-table-column
                    v-if="showCheckBox"
                    type="selection"
                    width="55">
            </el-table-column>
            <template v-for="(item, index) of columnItems">
                <el-table-column
                        :key="index"
                        :prop="item.key"
                        :label="item.label"
                        :width="item.width || '180px'">
                    <template slot-scope="scope">
                        <div v-html="getContent(item, scope.row[item.key])"></div>
                    </template>
                </el-table-column>
            </template>
            <el-table-column fixed="right" v-if="this.$scopedSlots.editBtn">
                <template slot-scope="scope">
                    <slot name="editBtn" :index="scope.$index" :row="scope.row"></slot>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {
        Table,
        TableColumn
    } from 'element-ui'
    import {ColumnType} from "@/constant/ColumnItem";
    import * as moment from "moment";
    export default {
        name: 'BaseTable',
        components: {
            'el-table': Table,
            'el-table-column': TableColumn
        },
        props: {
            // 列配置对象
            columnItems: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            // 表格数据
            tableData: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            // 是否展示多选框
            showCheckBox: {
                type: Boolean,
                default: false
            },
            // 表格加载状态
            tableLoading: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // 列类型
                ColumnType: ColumnType,
                // 表格高度
                tableHeight: 0
            }
        },
        computed: {
            selection() {
                return this.$refs.baseTable.selection;
            }
        },
        mounted() {
            const vm = this
            // 改变表格流体高度
            this.$nextTick(() => {
                vm.tableHeight =  vm.$refs.tableContent.offsetHeight
                window.addEventListener('resize', vm.resize, false)
            })
        },
        destroyed() {
            // 移除监听
            window.removeEventListener("resize", this.resize)
        },
        activated() {
            const vm = this
            // 改变表格流体高度
            this.$nextTick(() => {
                vm.tableHeight =  vm.$refs.tableContent.offsetHeight
                window.addEventListener('resize', vm.resize, false)
            })
        },
        deactivated() {
            // 移除监听
            window.removeEventListener("resize", this.resize)
        },
        methods: {
            /**
             * 重设窗口大小触发事件
             */
            resize() {
                this.tableHeight =  this.$refs.tableContent.offsetHeight
            },
            /**
             * 表格查询方法
             */
            loadTable() {
                this.$emit('loadTable');
            },
            /**
             * 表格内容渲染
             * @param columnItem 列对象
             * @param value 值
             * @returns {string|*} 返回结果
             */
            getContent(columnItem, value) {
                if (columnItem.type === ColumnType.DATE) {
                    return moment(value).format("YYYY-MM-DD HH:mm:ss");
                }
                else if (columnItem.type === ColumnType.BOOLEAN) {
                    if (columnItem.enumObj) {
                        return columnItem.enumObj[value];
                    }
                    return value;
                }
                else if (columnItem.type === ColumnType.PIC) {
                    if (value) {
                        return `<img style="width: 45px;height: 45px;border-radius: 50%;" src="${value}"/>`
                    }
                    return "暂无图片";
                }
                else {
                    return value;
                }
            }
        }
    }
</script>

<style scoped>

</style>
