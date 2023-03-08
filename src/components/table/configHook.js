import { reactive } from "vue";
/**
 * BasisTable组件默认配置
 * @param { Boolean } selection 多选项配置
 * @param { Boolean } batch_delete 指量删除按钮
 * @param { Boolean } pagination 分页
 */
export function configHook(){
    const config = reactive({
        selection: true,
        batch_delete: true,
        pagination: true,
        request: true,
        search: true,
        action_request: false,
        row_key: "id",
        expand_all: true,
        has_button_delete: "",
        has_button_batch_delete: ""
    })
    /**
     * 
     * @param {*} data 配置额外组件，true显示，false不显示
     */
    const configInit = (data = {}) => {
        // 无数据时不执行
        if(JSON.stringify(data) === "{}") { return false; }
        // 获取默认配置项的所有key
        const keys = Object.keys(config);
        // 循环传入的配置项
        for(let key in data) {
            // 过滤原型链的对象
            if (!data.hasOwnProperty(key)) { continue; }
            // ES6语法判断传入的key和默认配置的key相同时，则直接更新默认配置项的值
            if(keys.includes(key)) { config[key] = data[key]; }
        }
    }
    return { config, configInit };
}