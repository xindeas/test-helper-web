export const ColumnItem = {
    key: "", // 关键字
    label: "", // 字段名
    width: "180px", // 列宽度
    type: "", // 字段类型
    enumObj: {}, // 枚举类型

    sortColumn: "", // 排序字段名
    sortAble: false, // 是否可排序
    sortOrder: "ASC", // 排序规则：ASC, DESC
    sortPriority: 0, // 排序顺序
}
export const ColumnType = {
    TEXT: "TEXT",
    DATE: "DATE",
    BOOLEAN: "BOOLEAN",
    PIC: "PIC"
}
export const OrderType = {
    DESC: "DESC",
    ASC: "ASC"
}
