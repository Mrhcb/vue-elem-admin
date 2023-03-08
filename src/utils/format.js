/**
 * @param { responseData } Object 请求参数数据
 * @param { formData } Object Form表单字段
 * @returns 枚举匹配key
 */
export function formatRequestData(responseData, formData){
    // 判断是否有值存在
    if(JSON.stringify(responseData) === "{}") { return false; }
    // 获取form表单字段的所有key
    const keys = Object.keys(responseData);
    // 空JSON对象，存储过滤出来的数据
    const data_json = {};
    // 执行字段匹配
    for(let key in formData) {
        if(keys.includes(key) && formData.hasOwnProperty(key)) {
            data_json[key]= responseData[key];
        }
    }
    // 返回处理后的数据
    return data_json;
}

/**
 * 
 * @returns 递归函数格式化树状菜单
 */
 export function formatTree(data, id = "id", pid = "parent_id", child = "children", root){
    const tree = [];
    if(data && data.length > 0) {
        data.forEach(item => {
            // 获取顶层菜单，parent_id === 0
            if(item[pid] === root) {
                const children = formatTree(data, id, pid, child, item[id]);
                if(children) {
                    item[child] = children;
                }
                tree.push(item);
            }
        })
    }
    return tree;
}