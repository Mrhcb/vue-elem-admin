<template>
    <el-dialog v-model="dialogVisible" :title="title" :width="width" :close-on-click-modal="false" :close-on-press-escape="false" @close="dialogClose" @open="dialogOpen">
        <BasisForm ref="basisFormRef" label-width="100px" 
            :item="form_config.form_item" 
            :button="form_config.form_button" 
            :field="form_config.form_data"
            :loading="form_config.form_loading"
            @callback="handlerSubmit">
            <template v-slot:permit>
                <el-tree 
                    ref="treeRef"
                    :data="datas.tree_data"
                    node-key="menu_id"
                    :props="{label: 'menu_name', class: customNodeClass}"
                    :expand-on-click-node="false"
                    show-checkbox
                    default-expand-all
                />
            </template>
        </BasisForm>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, defineProps, watch, defineEmits, nextTick } from "vue";
// store
import { useStore } from "vuex";
// components
import BasisForm from "@c/form";
// 全局数据
import globalData from "@/js/data";
// API
import { RoleCreate, RoleDetailed, RoleUpdate } from "@/api/role";
import { MenuListTree } from "@/api/menu";
// utils
import { formatRequestData } from "@/utils/format";
const store = useStore();
// props对象
const props = defineProps({
    flag: {
        type: Boolean,
        default: false
    },
    width: {
        type: String,
        default: "30%"
    },
    title: {
        type: String,
        default: "消息"
    },
    rowId: { 
        type: [String, Number], 
        default: ""
    }
})

// 变量
const dialogVisible = ref(props.flag);
const width = ref(props.width);
const title = ref(props.title);
const datas = reactive({
    tree_data: []
})
const basisFormRef = ref(null);
const treeRef = ref(null);
// emit对象
const emit = defineEmits(["update:flag", "update:rowId"])
// 角色form表单配置
const form_config = reactive({
    form_item: [
        { type: "input", label: "角色名称", prop: "role_name", required: true },
        { type: "input", label: "角色标识", prop: "role_value", required: true },
        { 
            type: "radio", 
            label: "是否超管", 
            prop: "has_admin",
            options: globalData.whether,
            relation_hidden: [
                ['role_name', {"1":true, "0": false}],
                ['role_value', {"1":true, "0": false}]
            ]
        },
        { type: "radio", label: "是否启用", prop: "role_disabled", options: globalData.whether },
        { type: "slot", label: "角色权限", prop: "role_permit", slot_name: "permit" }
    ],
    form_button: [
        { label: "确认提交", type: "danger", key: "submit" }
    ],
    form_data: { role_name: "", role_value: "", role_disabled: "1", has_admin: "0" },
    form_loading: false,
    form_hidden: {}
})

// 函数
const dialogOpen = async () => {
    try {
        await getMenuList();
    }catch {
        console.log("权限数据请求失败")
    }
    props.rowId && getDetailed();
    title.value = props.rowId ? "编辑角色" : "添加角色";
}
const handlerSubmit = () => {
    props.rowId ? handlerEdit() : handlerAdd();
}

/** 角色新增函数接口 */
const handlerAdd = () => {
    const request_data = formatRequest();
    form_config.form_loading = true;
    RoleCreate(request_data).then(response => {
        form_config.form_loading = false;
        store.commit("app/SET_TABLE_REQUEST");
        dialogClose();
    }).catch(error => {
        form_config.form_loading = false;
    })
}
/** 角色编辑函数接口 */
const handlerEdit = () => {
    const request_data = formatRequest();
    form_config.form_loading = true;
    RoleUpdate(request_data).then(response => {
        form_config.form_loading = false;
        store.commit("app/SET_TABLE_REQUEST");
        dialogClose();
    }).catch(error => {
        form_config.form_loading = false;
    })
}

/** 接口参数格式化 */
const formatRequest = () => {
    const id = treeRef.value.getCheckedKeys().concat(treeRef.value.getHalfCheckedKeys());
    const request_data = {
        ...form_config.form_data,
        menu_id: id,
    }
    // 编辑状态
    if(props.rowId) { request_data.role_id = props.rowId; }
    return request_data;
}
const dialogClose = () => {
    basisFormRef.value.handlerFormReset();
    treeRef.value.setCheckedKeys([]);
    dialogVisible.value = false;
    emit("update:flag", false);
}
const getMenuList = () => {
    if(datas.tree_data.length !== 0) { return false; }
    return new Promise((resolve, reject) => {
        MenuListTree().then(response => {
            resolve()
            datas.tree_data = response.data.data;
        })
    })
}
const getDetailed= () => {
    form_config.form_loading = true;
    RoleDetailed({role_id: props.rowId}).then(response => {
        // 响应报文数据
        const response_data = response.data;
        // 表单数据赋值
        form_config.form_data = formatRequestData(response_data, form_config.form_data);
        // 菜单复选框赋值
        nextTick(() => {
        const menu_id = response_data.menu_id || [];
            menu_id.length > 0 && menu_id.forEach(item => {
                // 获取node节点
                const node = treeRef.value.getNode(item);
                // 判断node是否为子节点，非半选状态
                node.isLeaf && treeRef.value.setChecked(node, true)
            });
        })
        form_config.form_loading = false;
    }).catch(error => {
        form_config.form_loading = false;
    })
}


const customNodeClass = (data, node) => {
    return `tree-level-${node.level}`
}

// 监听
watch(() => props.flag, (newValue, oldValue) => {
    dialogVisible.value = newValue;
})
</script>
<style lang='scss' scoped>
:deep(.tree-level-2) {
    margin-bottom: 8px;
    > .el-tree-node__children {
        display: flex;
        flex-wrap: wrap;
    }
}
:deep(.tree-level-3) {
    width: 33.33333%;
}
</style>
