<template>
    <el-switch 
        v-model="init_data.value" 
        :loading="init_data.loading" 
        :before-change="handlerSwitch"
    >
    </el-switch>
</template>

<script>
import { reactive, getCurrentInstance, watch } from 'vue';
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
    emits: ['update:value', 'callback'],
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
        // 监听数据
        watch(() => props.data, (newValue, oldValue) => {
            init_data.value = newValue[config.prop]
        })
        // 获取实例上下文
        const { proxy } = getCurrentInstance();
        // 事件
        const handlerSwitch = (value) => {
            init_data.loading = true;
            // 请求参数
            const url = config.api_url || ApiUrl?.[config.api_module]?.[config.api_key]?.url;
            const method = config.method || ApiUrl?.[config.api_module]?.[config.api_key]?.method || "post";
            if(!url) {
                console.log("请求接口不存在");
                return false
            }
            // 请求参数
            const key_id = config.key_id || 'id'
	        const request_data = {
	            url,
	            method,
                data: {
                    [key_id]: data[key_id],  // 等价于["id"]: data["id"]
                    [config.prop]: !init_data.value      // 等价于["status"]: value
                }
	        }
            return new Promise((resolve, reject) => {
                SwitchStatus(request_data).then(response => {
                    proxy.$message.success(response.message);
                    data.status = value;
                    init_data.loading = false;
                    resolve(true)
                }).catch(error => {
                    init_data.loading = false;
                    reject(false)
                })
            })
        }
        return { config, init_data, handlerSwitch }
    }
}
</script>