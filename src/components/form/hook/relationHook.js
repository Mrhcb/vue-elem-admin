export function relationHook(){
    /**
     * @param { String } value 控制方的选项 value
     * @param { Array } data 关联关系的数据配置 relation_hidden
     * @param { Object } props 显示/隐藏对象集保
     */
    const HiddenItem = (value, data, props) => {
        if(data && Array.isArray(data) && data.length > 0) {
            data.forEach(item => {
                const field = item[0];
                const objValue = item[1];
                props[field] = objValue[value]
                // 选项为 1 时
                // props["title"] = objValue["1"]      => true
                // props["iamge_url"] = objValue["1"]  => true
                // 选项为 0 时
                // props["title"] = objValue["0"]      => true
                // props["iamge_url"] = objValue["0"]  => undefined
            })
        }
    }

    const DisabledItem = (value, data, props) => {
        if(data && Array.isArray(data) && data.length > 0) {
            data.forEach(item => {
                const field = item[0];
                const objValue = item[1];
                props[field] = objValue[value]
            })
        }
    }
   
    return { HiddenItem, DisabledItem };
}