<template>
    <template v-if="!data.options && data.callback && data.callback(data)"></template>
    <el-radio-group v-else v-model="value" :disabled="disabled" @change="handlerChange">
        <el-radio 
        v-for="radio in data.options" 
        :key="radio[data.key_value] || radio.value" 
        :label="radio[data.key_value] || radio.value">
        {{ radio[data.key_label] || radio.label }}
        </el-radio>
    </el-radio-group>
</template>

<script>
import { reactive, toRefs, watch } from 'vue';
// API
import { RoleListAll } from "@/api/role";
export default {
    name: "DateComponent",
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: [Number, String],
            default: ''
        },
        disabled: Boolean
    },
    emits: ['update:value', 'callback'],
    setup(props, { emit }){
        const dataa = reactive({
            value: '',
            data: props.data
        })
        watch(() => props.data, () => {
            RoleListAll().then(response => {
                console.log(111)
            }, {
                deep: true,
                immediate: true
            })
        })
        const handlerChange = (val) => {
            emit("update:value", val)
            emit("callback", {
                type: 'radio',
                value: val,
                formItem: props.data
            })
        }
        return {
            handlerChange
        }
    }
}
</script>