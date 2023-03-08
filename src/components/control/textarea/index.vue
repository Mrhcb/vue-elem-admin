<template>
    <el-input 
    v-model="value" 
    type="textarea" 
    debounce
    :rows="data.rows || 5" 
    :disabled="form_disabled[data.prop]" 
    :style="`width: ${data.width || '100%'}`" 
    :placeholder="data.placeholder" 
    @change="handlerChange"
    />
</template>

<script>
import { reactive, toRefs } from 'vue';
export default {
    name: "TextareaComponent",
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: String,
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