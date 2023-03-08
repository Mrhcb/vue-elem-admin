<template>
    <el-date-picker :style="`width: ${data.width}`"
        v-model="value"
        :disabled="disabled"
        :type="data.date_type || 'datetime'"
        :format="data.date_format || 'YYYY-MM-DD HH:mm:ss'"
        :placeholder="data.placeholder || '选择日期时间'"
        :start-placeholder="data.start_placeholder || '请选择开始日期'"
        :end-placeholder="data.end_placeholder || '请选择结束日期'"
        :range-separator="data.range_placeholder || '-'"
        @change="handlerChange"
    >
    </el-date-picker>
</template>

<script>
import { reactive, toRefs } from 'vue';
export default {
    name: "DateComponent",
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: [Array, String],
            default: ''
        },
        disabled: Boolean
    },
    emits: ['update:value', 'callback'],
    setup(props, { emit }){
        const data = reactive({
            value: '',
            data: props.data
        })
        
        const handlerChange = (val) => {
            emit("update:value", val)
            emit("callback", {
                type: 'date',
                value: val,
                data: props.data
            })
        }
        return {
            ...toRefs(data),
            handlerChange
        }
    }
}
</script>