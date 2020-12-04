<template>
    <div class="base-table full-content" ref="tableContent">
        <el-table
                :data="tableData"
                stripe
                :max-height="tableHeight"
                style="width: 100%;height: 100%;">
            <template v-for="(item, index) of columnItems">
                <el-table-column
                        :key="index"
                        :prop="item.key"
                        :label="item.label"
                        :width="item.width || '180px'">
                    <template slot-scope="scope">
                            {{getContent(item, scope.row[item.key])}}
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </div>
</template>

<script>
    import {
        Table,
        TableColumn
    } from 'element-ui'
    import {ColumnType} from "../constant/ColumnItem";
    import * as moment from "moment";
    export default {
        name: 'BaseTable',
        components: {
            'el-table': Table,
            'el-table-column': TableColumn
        },
        props: {
            columnItems: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            tableData: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                ColumnType: ColumnType,
                tableHeight: 0
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
        methods: {
            resize() {
                this.tableHeight =  this.$refs.tableContent.offsetHeight
            },
            loadTable() {
                this.$emit('loadTable');
            },
            getContent(columnItem, value) {
                if (columnItem.type === ColumnType.DATE) {
                    return moment(value).format("YYYY-MM-DD HH:mm:ss");
                }
                else {
                    return value;
                }
            }
        },
        destroyed() {
            window.removeEventListener("resize", this.resize)
        }
    }
</script>

<style scoped>

</style>
