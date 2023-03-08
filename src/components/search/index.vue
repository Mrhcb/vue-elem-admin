<template>
    <div v-if="button_group.length > 0" class="form-search-button-group">
        <el-button v-for="item in button_group" :key="item.id" :type="item.type" @click="item.callback && item.callback()">{{ item.label }}</el-button>
    </div>
    <el-form ref="searchForm" inline :label-width="label_width" :model="field">
        <template v-if="form_item && form_item.length > 0">
                <el-form-item v-for="item in form_item" :key="item.prop" :label="item.label" :prop="item.prop" :label-width="item.label_width || label_width">
                    <component :ref="componentDom" :key="item.type" v-model:value="field[item.prop]" :is="item.type + 'Component'" :data="item" @callback="componentCallback" />
                </el-form-item>
            <!-- button -->
                <el-form-item>
                    <div class="pull-right">
                        <el-button type="danger" @click="handlerSearch">搜索</el-button>
                    <el-button v-if="button.reset_button" @click="handlerReset">重置</el-button>
                    </div>
                </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { reactive, ref, inject, toRefs, nextTick } from 'vue';
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
        labelWidth: {
            type: [String, Number],
            default: "100px"
        },
        field: {
            type: Object,
            default: () => ({})
        },
        button: {
            type: Object,
            default: () => ({})
        },
        button_group: {
            type: Array,
            default: () => ([])
        },
        button_col: {
            type: Number,
            default: 24
        }
    },
    emits: ["callbackSearch"],
    setup(props, { emit }){
        const data = reactive({ key: "", value: "" });
        // 获取父组件provide数据
        const search_config = inject("search_config");
        // label占位宽度
        const label_width = ref(search_config?.label_width || props.labelWidth);
        // 组件元素配置
        const form_item = reactive(search_config?.form_item || props.item);
        // 字段配置
        const field = reactive(search_config?.form_data || props.field);
        // 按钮配置
        const button = reactive(search_config?.form_button || props.button);
        // 按钮组配置
        const button_group = reactive(search_config?.form_button_group || props.button_group);
        // 按钮占位 col
        const button_col = reactive(search_config?.button_col || props.button_col);
        /**
         * 获取动态组件的dom
         */
        const keyword = ref(null)
        const componentDom = el => {
            console.log(el)
            if(el && el.data.type === 'keyword') {
                keyword.value = el
            }
        }
        // 搜索
        const handlerSearch = () => {
            const data = formatRequest();
            // 回调父组件方法
            emit("callbackSearch", data, "search");
        }
        // 重置
        const searchForm = ref(null);
        const handlerReset = () => {
            searchForm.value.resetFields();
            // 调用关键字组件的clear方法
            keyword.value && keyword.value.handlerClear()
            emit("callbackSearch", {}, "search");
        }
        /** 参数格式化 */
        const formatRequest = () => {
            // 声明空的JSON对象临时存储数据
            const request_data = {};
            // 过滤在值存在的数据
            for(let key in field) {
                if(field[key] !== "") { request_data[key] = field[key]; }
            }
            // 判断关键字下拉选择是否有值存在
            if(data.key && data.value) { request_data[data.key] = data.value; }
            // 返回参数
            return request_data;
        }
        // 回调
        const componentCallback = (params) => {
            if(params.type === 'keyword') {
                data.key = params.value.key
                data.value = params.value.value
            }
        }
        return {
            ...toRefs(data),
            form_item, field, label_width, button, componentCallback, handlerSearch, handlerReset, componentDom, searchForm, button_group, button_col
        }

    }
}
</script>
<style lang="scss" scoped>
.form-search-button-group { margin-bottom: 20px; }
</style>