<template>
    <el-checkbox-group v-model="value" :disabled="form_disabled[data.prop]" @change="handlerChange">
        <el-checkbox v-for="checkbox in data.options" :label="checkbox.value" :key="checkbox.value">{{ checkbox.label }}</el-checkbox>
    </el-checkbox-group>

</template>

<script>
import { reactive, toRefs } from 'vue';
export default {
    name: "CheckboxComponent",
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: Array,
            default: () => ([])
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
            emit("callback", {
                type: 'checkbox',
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