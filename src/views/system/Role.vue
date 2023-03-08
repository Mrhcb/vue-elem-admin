<template>
    <BasisTable :columns="table_config.table_header" :config="table_config.config" :request="table_config.request">
        <template v-slot:operation="slotData">
            <el-button type="danger" @click="handlerRole(slotData.data.role_id)">编辑</el-button>
        </template>
    </BasisTable>
    <DialogRole v-model:flag="data.dialogFlag" v-model:row-id="data.row_id" />
</template>

<script>
import{ reactive, provide } from "vue";
// components
import BasisTable from "@c/table";
import DialogRole from "./components/dialogRole";
// 全局数据
import globalData from "@/js/data";
export default {
    name: 'InfoIndex',
    components: { BasisTable, DialogRole },
    props: {},
    setup(props){
        const data = reactive({
            dialogFlag: false,
            row_id: ""
        })
        const table_config = reactive({
            table_header: [
                { label: "角色名称", prop: "role_name" },
                { 
                    label: "是否禁用", 
                    prop: "role_disabled",
                    type: "switch",
                    key_id: "role_id",
                    api_module: "role",
                    api_key: "status"
                },
                { 
                    label: "操作", 
                    type: "slot",
                    slot_name: "operation",
                    width: "200",
                    delete_elem: true
                }
            ],
            config: {
                action_request: true,
                has_button_delete: "role:delete",
                has_button_batch_delete: "role:batch_delete"
            },
            request: {
                url: "role",
                data: {
                    pageNumber: 1,
                    pageSize: 10,
                },
                delete_key: "role_id"
            }
        })
        const search_config = reactive({
            label_width: "80px",
            form_button_group: [
                { label: "添加角色", type: "danger", callback: () => handlerRole() },
            ],
            form_button: {
                reset_button: true
            },
            form_item: [
                { 
                    type: "input", 
                    label: "角色名称", 
                    prop: "role_name",
                    placeholder: "请输入角色名称"
                },
                { 
                    type: "select", 
                    label: "禁用状态", 
                    prop: "role_disabled",
                    width: "100px",
                    options: globalData.whether
                },
            ],
            form_data: {
                role_name: "",
                role_disabled: ""
            }
        })
        provide("search_config", search_config);
        const handlerRole = (id = "") => {
            data.row_id = id;
            data.dialogFlag = true;
        }
        return {
            table_config,
            data,
            handlerRole
        }
    }
}
</script>
<style lang="scss" scoped></style>