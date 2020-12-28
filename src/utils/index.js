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
