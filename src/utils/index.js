// 枚举类型转换下拉框选项数组
export function enumToOptions(enumObj) {
    const optionList = [];
    for (const value of Object.keys(enumObj)) {
        optionList.push({
            value,
            label: enumObj[value],
        });
    }
    return optionList;
}

// 获取输入的过滤条件生成过滤参数
export function getFilterParams(form) {
    const result = {};
    for(const key of Object.keys(form)) {
        if (form[key]) {
            result[key] = form[key];
        }
    }
    return result;
}
