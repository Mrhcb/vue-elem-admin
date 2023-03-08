<template>
    <el-form ref="formDom" v-loading="loading" element-loading-text="加载中，请稍候" :label-width="label_width" :model="field">
        <el-row>
        <template v-for="item in form_item" :key="item.prop">
            <el-col v-if="!form_hidden[item.prop]" :span="item.col || 24">
                <el-form-item v-if="item.type !== 'slot'" :label="item.label" :prop="item.prop" :rules="item.rules">
                    <component 
                        v-model:value="field[item.prop]" 
                        :is="item.type + 'Component'" 
                        :data="item" 
                        :disabled="disabled[item.prop]"
                        @callback="componentCallback"
                    />
                </el-form-item>
                <el-form-item v-else :label="item.label" :prop="item.prop" :rules="item.rules">
                    <slot :name="item.slot_name"></slot>
                </el-form-item>
            </el-col>
        </template>
        </el-row>
        <!-- button -->
        <el-form-item v-if="form_button && form_button.length > 0">
            <el-button 
                v-for="item in form_button" 
                :key="item.key" 
                :type="item.type" 
                @click="item.callback ? item.callback() : handlerFormActive(item)"
            >
                {{ item.label }}
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { reactive, ref } from 'vue';
// hook
import { rulesHook } from "./hook/rulesHook";
import { relationHook } from "./hook/relationHook";
// require import components
const files = require.context('@c/control', true, /\index.vue$/);
const modules = {}
files.keys().forEach(key => {
    const name = key.split("/")
    modules[name[1]+'Component'] = files(key).default || files(key)
})
export default {
    name: 'BasisForm',
    components: modules,
    props: {
        item: {
            type: Array,
            default: () => ([])
        },
        button: {
            type: Array,
            default: () => ([])
        },
        labelWidth: {
            type: [String, Number],
            default: "100px"
        },
        field: {
            type: Object,
            default: () => ({})
        },
        hidden: {
            type: Object,
            default: () => ({})
        },
        disabled: {
            type: Object,
            default: () => ({})
        },
        loading: {
            type: Boolean,
            default: false
        },
        hidden: {
            type: Object,
            default: () => ({})
        },
        disabled: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ["callback"],
    setup(props, { emit }){
        const { InitRules } = rulesHook();
        const { HiddenItem, DisabledItem } = relationHook();
        // 校验规则处理
        const form_item = reactive(InitRules(props.item));
        const label_width = ref(props.labelWidth);
        const form_button = reactive(props.button);
        const form_hidden  = reactive(props.hidden);
        const form_disabled  = reactive(props.disabled);
        // 表单提交验证
        const formDom = ref(null);
        // form表单动作
        const handlerFormActive = (data) => {
            // 提交表单事件
            if(data.key === 'submit') {
                formDom.value.validate((valid) => valid && emit("callback"));
            }
            // 重置表单事件
            if(data.key === 'reset') { handlerFormReset(); }
        }
        /**
         * 重置表单
         */
        const handlerFormReset = () => {
            formDom.value.resetFields();
        }
        // change 事件
        const componentCallback = (params) => {
            if(params.formItem.relation_hidden) {
                HiddenItem(params.value, params.formItem.relation_hidden, form_hidden)
            }
            if(params.formItem.relation_disabled) {
                DisabledItem(params.value, params.formItem.relation_hidden, form_disabled)
            }
        }
        return { formDom, form_item, label_width, form_button, form_hidden, form_disabled, formDom, handlerFormActive, componentCallback, handlerFormReset }
    }
}
</script>
<style lang="scss" scoped></style>