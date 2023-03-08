<template>
    <el-dialog 
        v-model="dialogVisible" 
        :title="title" 
        :width="width" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false"
        @close="dialogClose"
        @open="dialogOpen"
    >
        <BasisForm @callback="handlerSubmit" ref="basisFormRef" label-width="100px" :item="form_config.form_item" :button="form_config.form_button" :field="form_config.form_data" :loading="form_config.form_loading">
        </BasisForm>
    </el-dialog>
</template>

<script setup>
import { ref, watch, reactive, getCurrentInstance, defineProps, defineEmits } from "vue";
// components
import BasisForm from "@c/form";
// validate
import { checkPassword } from "@/utils/validate";
// hook
import { propsType, dialogHook } from "@/hook/dialogHook.js";
// sha1
import sha1 from "js-sha1";
// API
import { UpdatePass } from "@/api/user";
// store
import { useStore } from "vuex";
// Props对象
const props = defineProps({
    ...propsType,
    rowId: {
        type: [String, Number],
        default: ""
    }
})
const emit = defineEmits(["update:flag"])
// 变量
const dialogVisible = ref(props.flag);
const width = ref(props.width);
const title = ref(props.title);
const basisFormRef = ref(null);
// 获取实例上下文
const { proxy } = getCurrentInstance();
// dialog
const { close } = dialogHook(emit);
// store
const store = useStore();
// form表单配置
const form_config = reactive({
    form_item: [
        { 
            type: "input",
            label: "密码",
            prop: "password",
            width: "300px",
            value_type: "password",
            required: true
        }
    ],
    form_button: [
        { label: "确认修改", type: "danger", key: "submit" }
    ],
    form_data: {
        password: "",
    },
    form_loading: false
})

const dialogClose = () => {
    dialogVisible.value = false;
    close(basisFormRef);
}
const dialogOpen = () => {}
watch(() => props.flag, (newValue, oldValue) => {
    dialogVisible.value = newValue;
})
/** 表单提交 */
const handlerSubmit = () => {
    if(!props.rowId) { return false; }                // 不存在ID
    form_config.form_loading = true;                  // 添加表单遮罩
    UpdatePass({
        password: sha1(form_config.form_data.password),
        id: props.rowId
    }).then(response => { 
        form_config.form_loading = false;             // 清除表单遮罩 
        proxy.$message.success(response.message);   // 成功弹窗提示 
        dialogClose();   // 关闭弹窗
    }).catch(error => { 
        form_config.form_loading = false;             // 清除表单遮罩
     })
}
</script>
<style lang='scss' scoped></style>