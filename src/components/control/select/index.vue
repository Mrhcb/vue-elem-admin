<template>
    <el-select v-model="value" :disabled="disabled" :style="`width: ${data.width || '100%'}`" @change="handlerChange">
        <el-option v-for="select in data.options" :key="select.value" :label="select.label" :value="select.value"></el-option>
    </el-select>
</template>

<script>
import { reactive, toRefs } from 'vue';
export default {
    name: "SelectComponent",
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: [Number, String],
            default: ''
        }
    },
    emits: ['update:value', 'callback'],
    setup(props, { emit }){
        const data = reactive({
            value: '',
            data: props.data
        })
        
        const handlerChange = (val) => {
            emit("update:value", val)
        }
        return {
            ...toRefs(data),
            handlerChange
        }
    }
}
</script>