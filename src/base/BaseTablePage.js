export default {
    name: "BaseTablePage",
    data() {
        return {
            tableData: [],
            pageIndex: 0,
            pageSize: 10,
            pageTotal: 0,
            loading: {
                table: false
            },
            sizeOptions: [10, 100, 200, 300]
        }
    },
    methods: {
        afterLoadTable(res) {
            this.loading.table = false
            if (res && res.result) {
                this.pageTotal = res.result.totalCount;
                if (Array.isArray(res.result.result)) {
                    this.tableData = res.result.result
                }
            }
        }
    }
}
