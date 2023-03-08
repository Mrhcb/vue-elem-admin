<template>
    <el-input 
        v-model="value" 
        :type="data.value_type || 'text'" 
        v-on:input="handlerEnter" 
        debounce 
        :placeholder="placeholder" 
        :maxlength="prop.maxlength" 
        :minlength="prop.minlength || 0"
    />
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
            prop: props.data,
            placeholder: props.data.placeholder
        })
        
        const handlerEnter = (val) => {
            emit("update:value", val)
        }
        
        return {
            ...toRefs(data),
            handlerEnter
        }
    }
}
</script>

<style>

</style>