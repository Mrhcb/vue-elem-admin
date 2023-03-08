import { reactive, getCurrentInstance } from "vue";
// requestUrl
import ApiUrl from "@/api/requestUrl";
// API
import { TableData, CommonApi } from "@/api/common";
import { configHook } from "./configHook";
import { ElMessage } from "element-plus"
export function requestHook(){
    const { config, configInit } = configHook();
    
    // 获取实例上下文
    const { proxy } = getCurrentInstance();
    let request_config = {
        has: true,       // 是否请求
        url: "",         // 请求模块
        method: "post",  // 请求类型
        data: {},        // 请求参数
        delete_key: '',  // 删除接口的KEY
        search_params: {}
    }
    const table_data = reactive({
        data: [],
        data_id: "",
        current_page: 0,
        total: 0,
        loading: false
    })
    /**
     * @returns 列表数据请求
     */
    const loadData = () => {
        // 判断条件是否请求接口
        if(!request_config.has) { return false; }
        if(!request_config.url) { return false; }
        // 参数
        const url = ApiUrl[request_config.url]?.list?.url;
        const method  = ApiUrl[request_config.url]?.list?.method || 'post';
        const data = { ...request_config.data, ...request_config.search_params };
        if(!url) {
            console.log("请求地址不存在");
            return Promise.reject();
        }
        const request_data = {
            url,
            method,
            data
        }
        // 加载状态
        table_data.loading = true;
        return new Promise((resolve, reject) => {
            TableData(request_data).then(response => {

                let response_data = response.data.data;
                // 是否格式化数据
                if(request_config.format_data && Object.prototype.toString.call(request_config.format_data) === "[object Function]") {
                    response_data = request_config.format_data(response.data.data);
                }

                console.log(response_data)

                table_data.data = response_data;
                table_data.total = response.data.total;
                table_data.current_page = response.data.current_page;
                // 取消加载状态
                table_data.loading = false;
                resolve(response.data);
            }).catch(error => {
                reject()
                // 取消加载状态
                table_data.loading = false;
            })
        })
    }
    const requestData = (data = {}, type = 'init') => {
        // 初始化逻辑
        if(type === "init") {
            request_config = {...request_config, ...data};
        }
        // 分页逻辑
        if(type === 'page') {
            request_config.data = {...request_config.data, ...data};
        }
        // 搜索
        if(type === "search"){
            request_config.data.pageNumber = 1;
            request_config.data.pageSize = 10;
            request_config.search_params = data;
        }
        // 请求数据
        return loadData();
    }
    /**
     * 
     * @param {Object} data 
     * @description 手动请求
     */
    const handlerRequestData = (data = {}) => {
        table_data.params_data = data;
        loadData();
    }
    /**
     * 
     * @param { String、Array } value 
     * @description 存储数据ID，作用于删除接口使用
     * 删除接口
     */
    const saveDataId = (value) => {
        const isArray = Array.isArray(value);
        if(!isArray) {
            table_data.data_id = value[request_config.delete_key];
        }else{
            table_data.data_id = value.length > 0 ? value.map(item => item[request_config.delete_key]).join() : "";
        }
        console.log(table_data.data_id)
    }
    /**
     * 
     * @description 删除动作的确认弹窗
     */
     const handlerDeleteComfirm = () => {
        proxy.deleteConfirm({
            title: "删除",
            message: "确认删除当前数据吗？",
            thenFun: () => { handlerDelete(); }
        });
    }
    const handlerDelete = () => {
        const url = ApiUrl?.[request_config.url]?.delete?.url
        const method = ApiUrl?.[request_config.url]?.delete?.method || "post"
        if(!url) {
            console.log("未配置删除接口参数");
            return false;
        }
        // 参数
        const request_data = {
            url,
            method: method,
            data: { [request_config.delete_key]: table_data.data_id },
        }
        CommonApi(request_data).then(response => {
            // 成功提示
            proxy.$message({
                message: response.message,
                type: "success"
            })
            loadData();
            table_data.data_id = "";
            proxy.deleteConfirmClose();
        }).catch(error => {
            proxy.confirmButtonLoading(false);
        })
    }
    return { table_data, requestData, handlerDelete, saveDataId, handlerDeleteComfirm };
}