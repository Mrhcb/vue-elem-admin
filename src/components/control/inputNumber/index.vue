<template>
    <el-input-number v-model="value" :min="data.min || 0" :max="data.max || 99999999" @change="handleChange" />
</template>

<script>
import { reactive, toRefs, watchEffect } from 'vue';
export default {
    name: "InputComponent",
    props: {
        data: {
            type: Object,
            default: () => ({})
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
        
        const handleChange = (val) => {
            console.log(val)
            emit("update:value", val)
        }
        
        return {
            ...toRefs(data),
            handleChange
        }
    }
}
</script>

<style>

</style>