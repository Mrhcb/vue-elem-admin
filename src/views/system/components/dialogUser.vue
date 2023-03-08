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
        <BasisForm ref="basisFormRef" @callback="handlerSubmit" label-width="100px" :item="form_config.form_item" :button="form_config.form_button" :field="form_config.form_data" :loading="form_config.form_loading" :hidden="form_config.form_hidden" />
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, defineProps, defineEmits, getCurrentInstance } from "vue";
// API
import { RoleListAll } from "@/api/role";
// components
import BasisForm from "@c/form";
// 全局数据
import globalData from "@/js/data";
// 验证
import { validate_email, validate_password } from "@/utils/validate";
// hook
import { propsType, dialogHook } from "@/hook/dialogHook.js";
// API
import { UserCreate, UserDetailed, UserUpdate } from "@/api/user";
// sha1
import sha1 from "js-sha1";
// vuex
import { useStore } from "vuex";
// store
const store = useStore();
// props 对象
const props =  defineProps({
    ...propsType,
    rowId: {
        type: [String, Number],
        default: ""
    }
})
// emit 对象
const emit = defineEmits(["update:flag", "update:rowId"])
// dialoghook
const { close } = dialogHook(emit);
// 获取实例上下文
 const { proxy } = getCurrentInstance();
// 变量
const dialogVisible = ref(props.flag);
const width = ref(props.width);
const title = ref(props.title);
const basisFormRef = ref(null);
const form_config = reactive({
    form_item: [
        { 
            type: "input",
            value_type: "username",
            label: "用户名", 
            prop: "username",
            width: "300px",
            required: true
        },
        { type: "input", label: "真实姓名", prop: "truename" },
        { 
            type: "input",
            value_type: "password",
            label: "密码",
            prop: "password",
            width: "300px",
            required: true
        },
        { type: "radio", label: "是否启用", prop: "user_disabled", options: globalData.whether, required: true },
        { 
            type: "radio", 
            label: "角色类型", 
            prop: "role_type", 
            required: true,
            key_label: "role_name",
            key_value: "role_id",
            callback: async (row) => {
                let result = []
                try {
                    result = await getRoleList();
                } catch (error) {
                    console.log("角色数据获取失败")
                }
                row.options = result
            }
        }
    ],
    form_button: [
        { label: "确认提交", type: "danger", key: "submit" }
    ],
    form_data: { username: "", password: "", truename: "", role_type: "", user_disabled: "1" },
    form_loading: false,
    form_hidden: {}
})

/** dialog关闭 */
const dialogClose = () => {
    close(basisFormRef);
    emit("update:rowId", "");
}
/** dialog打开 */
const dialogOpen = async () => {
    form_config.form_hidden.password = !!props.rowId;
    props.rowId && getUserDetailed();
}
/** 监听 */
watch(() => props.flag, (newValue, oldValue) => {
    dialogVisible.value = newValue;
})

// 获取角色列表
const getRoleList = () => {
    return new Promise((resolve, reject) => {
        RoleListAll().then(response => {
            resolve(response.data)
        })
    }) 
}

/** 表单提交 */
const handlerSubmit = () => {
    props.rowId ? handlerEdit() : handlerAdd();
}

const handlerAdd= () => {
    // 表单加载遮罩
    form_config.form_loading = true;
    // 拷贝数据
    const request_data = Object.assign({}, form_config.form_data);
    // 密码加密
    request_data.password = sha1(request_data.password);
    // 调用创建用户接口
    UserCreate(request_data).then(response => {
        userResponse(response);
    }).catch(error => {
        // 清除表单遮罩
        form_config.form_loading = false;
    })
}
/** 修改用户 */
const handlerEdit = () => {
    // 表单加载遮罩
    form_config.form_loading = true;
    // 拷贝数据
    const request_data = Object.assign({}, form_config.form_data);
    // 删除密码参数
    delete request_data.password;
    // 调用修改用户接口
    UserUpdate({...request_data, id: props.rowId}).then(response => {
        userResponse(response);
    }).catch(error => {
        // 清除表单遮罩
        form_config.form_loading = false;
    })
}
/** 获取用户详情 */
const getUserDetailed = () => { 
    form_config.form_loading = true;              // 表单加载遮罩
    UserDetailed({id: props.rowId}).then(response => { 
        form_config.form_loading = false;         // 清除表单遮罩 
        form_config.form_data = response.data;   // 表单赋值
     }).catch(error => { 
        form_config.form_loading = false;         // 清除表单遮罩
    })
}

/** 接口响应结果  */
const userResponse = (params) => {
    // 清除表单遮罩
    form_config.form_loading = false;
    // 获取报文
    const response_data = params;
    // 判断状态
    if(!response_data.data.user) {
        // 失败弹窗提示
        proxy.$message.error(response_data.message);
        return false;
    }
    // 成功弹窗提示
    proxy.$message.success(response_data.message);
    // 刷新列表
    store.commit("app/SET_TABLE_REQUEST");
    // 关闭弹窗
    dialogClose();
}


</script>
<style lang='scss' scoped></style>