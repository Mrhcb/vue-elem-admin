<template>
    <el-cascader :style="{width}" :disabled="disabled" v-model="data.value" :options="data.options" :props="data.props" @change="handlerChange"></el-cascader>
</template>

<script>
import { reactive, onBeforeMount, watch } from 'vue';
// API
import { CommonApi } from "@/api/common";
// requestUrl
import ApiUrl from "@/api/requestUrl";
export default {
    name: 'BasisCascader',
    components: {},
    props: {
        cascaderProps: {
            type: Object,
            default: () => ({})
        },
        url: {
            type: String,
            default: ""
        },
        method: {
            type: String,
            default: "post"
        },
        data: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: [String, Number],
            default: 0
        },
        width: {
            type: String,
            default: "100%"
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    emits: ["update:value", 'callback'],
    setup(props, { emit }){
        const data = reactive({
            props: props.data.props,
            options: [],
            value: 0
        })
        const handlerChange = (value) => {
            // 获取最后一项
            const val = value[value.length - 1];
            // 返回
            emit("update:value", val);
        }
        /** 获取列表 */
        const getData = () => {
            const url = ApiUrl?.cascader?.[props.url || props?.data?.url]?.url;
            const method = ApiUrl?.cascader?.[props.url]?.method || "post";
            if(!url) {
                throw new Error("url地址不存在");
            }
            // 参数
            const request_data = {
                url,
                method,
                data: props.data,
            }
            CommonApi(request_data).then(response => {
                data.options = response.data;
            })
        }
        /** 生命周期挂载之前 */
        onBeforeMount(() => {
            getData();
        })
        /** 监听 */
        watch(() => props.value, (newValue) => {
            data.value = newValue
        } )

        return { data, handlerChange }
    }
}
</script>