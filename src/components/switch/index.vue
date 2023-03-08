<template>
    <el-switch 
        v-model="init_data.value" 
        :loading="init_data.loading" 
        @change="handlerSwitch($event)"
    >
    </el-switch>
</template>

<script>
import { reactive, getCurrentInstance } from 'vue';
// requestUrl
import ApiUrl from "@/api/requestUrl";
//API
import { SwitchStatus } from "@/api/common";
export default {
    name: 'SwitchComponent',
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        config: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props){
        // 配置信息
        const config = reactive(props.config);
        // 数据
        const data = reactive(props.data);
        // 初始值
        const init_data = reactive({
            value: data[config.prop],
            loading: false
        });
        // 获取实例上下文
        const { proxy } = getCurrentInstance();
        // 事件
        const handlerSwitch = (value) => {
            // 请求参数
            const key_id = config.key_id;
            if(!key_id) { return false; }
            init_data.loading = true;
            // 参数
	        const request_data = {
	            url: config.api_url || ApiUrl[config.api_module][config.api_module_key],
	            method: config.method || "post",
                data: {
                    [key_id]: data[key_id],           // 等价于["id"]: data["id"]
                    [config.prop]: value              // 等价于["status"]: value
                }
	        }
            // 接口请求
            SwitchStatus(request_data).then(response => {
                proxy.$message.success(response.message);
                init_data.value = value;
                init_data.loading = false;
            }).catch(error => {
                init_data.loading = false; 
            })
        }
        return { config, init_data, handlerSwitch }
    }
}
</script>