<template>
    <el-select v-model="key" placeholder="请选择" class="key-word-select" @change="handlerChange">
        <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
    <el-input v-model="value" class="width-200" :placeholder="placeholder" v-on:input="callback"></el-input>
</template>

<script>
import { reactive, toRefs, watch } from "vue";
export default {
    name: "KeyWord",
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
    },
    emits: ["callback"],
    setup(props, { emit }){
        const data = reactive({
            key: "",
            value: "",
            placeholder: "请输入搜索的关键字",
            options: props.data.options
        })

        /** 下拉事件 */
        const handlerChange = (value) => {
            // 清除input输入框文本
            data.value = "";
            // 更新input输入框占位文本
            updatePlaceholder();
            // 回调
            callback()
        }

        /** 事件回调 */
        const callback = () => {
            emit("callback", {
                type: 'keyword',
                value: { key: data.key, value: data.value },
                formItem: props.data
            })
        }

        /** update Placeholder */
        const updatePlaceholder =() => {
            const item = data.options.filter(item => item.value === data.key)[0];
            data.placeholder = `请输入${item.label}`;
        }

        /** 清除 */
        const handlerClear = () => {
            data.key = "";
            data.value = "";
        }

        return {
            ...toRefs(data),
            handlerChange,
            handlerClear,
            callback
        }
    }
}
</script>

<style lang="scss" scoped>
.key-word-select {
    width: 100px;
    margin-right: 10px;
}
.width-200 { width: 200px; }
</style>