<template>
    <BasisTable 
        :columns="table_config.table_header" 
        :config="table_config.config" 
        :request="table_config.request"
    >
        <template v-slot:operation="slotData">
            <el-button type="danger" @click="handlerDialog(slotData.data.id)" v-has-button="'user:edit'">编辑</el-button>
            <el-button type="danger" @click="handlerPassword(slotData.data.id)" v-has-button="'user:password'">修改密码</el-button>
        </template>
    </BasisTable>
    <DialogUser v-model:flag="dialogFlag" v-model:row-id="row_id" />
    <DialogPass v-model:flag="dialogPassFlag" v-model:row-id="row_id" title="修改密码" />
</template>

<script>
import { reactive, provide, toRefs } from "vue";
// components
import BasisTable from "@c/table";
import DialogUser from "./components/dialogUser";
import DialogPass from "./components/dialogPassword";
// 全局数据
import globalData from "@/js/data";
export default {
    name: "SystemUser",
    components: { BasisTable, DialogUser, DialogPass },
    props: {},
    setup(props){
        const data = reactive({
            dialogFlag: false,
            dialogPassFlag: false,
            row_id: ""
        })
        // 列表表格配置
        const table_config = reactive({
            table_header: [
                { label: "用户名", prop: "username" },
                { label: "真实姓名", prop: "truename" },
                { label: "角色类型", prop: "role_type" },
                { 
                    label: "帐号状态", 
                    prop: "user_disabled", 
                    type: "switch",
                    key_id: "id",
                    api_module: "user",
                    api_key: "status"
                },
                { label: "创建时间", prop: "user_createtime" },
                { label: "操作", type: "slot", slot_name: "operation", width: "280", delete_elem: true }
            ],
            config: {
                action_request: true,
                has_button_delete: "user:delete",
                has_button_batch_delete: "user:batch_delete"
            },
            request: {
                url: "user",
                data: {
                    pageSize: 10,
                    pageNumber: 1
                },
                delete_key: "id"
            }
        })
        // 搜索项配置
        const search_config = reactive({
            label_width: "70px",
            form_button_group: [
                { label: "添加用户", type: "danger", callback: () => handlerDialog() },
            ],
            form_button: {
                reset_button: true
            },
            form_item: [
                { 
                    type: "select", 
                    label: "禁启用", 
                    prop: "user_disabled",
                    width: "100px",
                    options: globalData.whether
                },
                { 
                    type: "keyword", 
                    label: "关键字", 
                    prop: "keyword",
                    options: [
                        { label: "用户名", value: "username" },
                        { label: "真实姓名", value: "truename" },
                        { label: "角色类型", value: "role_type" }
                    ]
                },
            ],
            form_data: {
                user_disabled: ""
            }
        })
        provide("search_config", search_config);
        const handlerDialog = (id = '') => {
            data.row_id = id;
            data.dialogFlag = true;
        }
        const handlerPassword = (id) => {
            data.row_id = id;
            data.dialogPassFlag = true;
        }
        return {
            table_config,
            handlerDialog,
            handlerPassword,
            ...toRefs(data)
        }
    }
}
</script>
<style lang="scss" scoped></style>