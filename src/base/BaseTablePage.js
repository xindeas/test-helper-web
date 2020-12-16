import BaseTable from "@/layout/components/BaseTable";

export default {
    name: "BaseTablePage",
    components: {
        BaseTable
    },
    data() {
        return {
            tableData: [],
            pageIndex: 0,
            pageSize: 10,
            pageTotal: 0,
            loading: {
                table: false,
                button: false,
            },
            sizeOptions: [10, 100, 200, 300]
        }
    },
    methods: {
        loadTable() {
        },
        afterLoadTable(res) {
            this.loading.table = false
            if (res && res.result) {
                this.pageTotal = res.result.totalCount;
                if (Array.isArray(res.result.result)) {
                    this.tableData = res.result.result
                }
            }
        },
        afterEnabled(res) {
            this.loading.button = false
            const l = res.filter(item => item.success).length
            if (l > 0) {
                this.$message.success(l + '条数据启用成功')
            }
            this.loadTable();
        },
        afterDisabled(res) {
            this.loading.button = false
            const l = res.filter(item => item.success).length
            if (l > 0) {
                this.$message.info(l + '条数据禁用成功')
            }
            this.loadTable();
        },
        add(title, url, params) {
            this.$router.selfAdd(
                {
                    path: '/' + this.$options.name + 'Add',
                    name: this.$options.name + 'Add',
                    meta: {
                        title
                    },
                    component: {
                        components: {
                          com: () => import('@/views/' + url)
                        },
                        name: this.$options.name + 'Add',
                        render: h => h('com')
                    }
                })
            this.$router.push({
                name: this.$options.name + 'Add',
                params
            });
        },
        edit(title, url, params) {
            this.$router.selfAdd(
                {
                    path: '/' + this.$options.name + 'Edit',
                    name: this.$options.name + 'Edit',
                    meta: {
                        title
                    },
                    component: {
                        components: {
                            com: () => import('@/views/' + url)
                        },
                        name: this.$options.name + 'Edit',
                        render: h => h('com')
                    }
                })
            this.$router.push({
                name: this.$options.name + 'Edit',
                params
            });
        }
    }
}
