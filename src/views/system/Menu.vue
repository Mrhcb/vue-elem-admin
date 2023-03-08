<template>
    <BasisTable 
        :columns="table_config.table_header" 
        :config="table_config.config" 
        :request="table_config.request"
    >
        <template v-slot:operation="slotData">
            <el-button type="danger" @click="handlerMenu('edit', slotData.data.menu_id)" v-has-button="'menu:edit'">编辑</el-button>
            <el-button type="danger" @click="handlerMenu('add_sub', slotData.data.menu_id)" v-has-button="'menu:add_sub'">添加子菜单</el-button>
        </template>
    </BasisTable>
    <el-dialog :title="data.title" @closed="dislogClose" @open="dialogOpen" v-model="dialogVisible" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
        <BasisForm 
            ref="basisFormRef"
            label-width="100px" 
            :item="form_config.form_item" 
            :button="form_config.form_button" 
            :field="form_config.form_data"
            :loading="form_config.form_loading"
            @callback="handlerSubmit"
        >
            <template v-slot:menu_function>
                <el-row :gutter="10">
                    <el-col :span="9">页面元素</el-col>
                    <el-col :span="9">标识符</el-col>
                    <el-col :span="4">操作</el-col>
                </el-row>
                <el-row :gutter="10" v-for="(item, index) in form_config.page_item" :key="item.id">
                    <el-col :span="9"><el-input v-model.trim="item.label" size="small" /></el-col>
                    <el-col :span="9"><el-input v-model.trim="item.value" size="small" /></el-col>
                    <el-col :span="4"><el-button size="small" @click="handlerDel(index)">删除</el-button></el-col>
                </el-row>
                <el-button type="primary" @click="handlerPush">添加功能</el-button>
            </template>
        </BasisForm>
    </el-dialog>
</template>

<script>
import { useRouter } from "vue-router";
import{ reactive, provide, ref } from "vue";
// store
import { useStore } from "vuex";
// components
import BasisTable from "@c/table";
import BasisForm from "@c/form";
// 全局数据
import globalData from "@/js/data";
// API
import { MenuCreate, MenuDetailed, MenuUpdate } from "@/api/menu";
// utils
import { formatRequestData, formatTree } from "@/utils/format";
export default {
    name: 'MenuIndex',
    components: { BasisTable, BasisForm },
    props: {},
    setup(props){
        const dialogVisible = ref(false);
        // router
        const { push } = useRouter();
        // store
        const store = useStore();
        // 页面功能初始参数
        const page_fun_json = { value: "", label: "" };
        const data = reactive({
            menu_handler_flag: "",
            row_id: 0,
            title: "",
            title_item: {
                add: "添加一级菜单",
                edit: "编辑菜单",
                add_sub: "添加子级菜单"
            }
        })
        // 列表表格配置
        const table_config = reactive({
            table_header: [
                { label: "菜单名称", prop: "menu_name" },
                { label: "菜单路径", prop: "menu_path" },
                { label: "映射组件", prop: "menu_component" },
                { label: "重定向", prop: "menu_redirect" },
                {
                    label: "是否隐藏", 
                    prop: "menu_hidden", 
                    type: "switch",
                    key_id: "menu_id",
                    api_module: "menu",
                    api_key: "hidden_status",
                },
                { 
                    label: "是否禁用", 
                    prop: "menu_disabled", 
                    type: "switch",
                    key_id: "menu_id",
                    api_module: "menu",
                    api_key: "disabled_status",
                },
                { label: "操作", type: "slot", slot_name: "operation", width: "280", delete_elem: true }
            ],
            config: {
                selection: false,
                batch_delete: false,
                pagination: false,
                action_request: true,
                row_key: "menu_id" 
            },
            request: {
                url: "menu",
                data: {},
                delete_key: "menu_id",
                format_data: (data) => formatTree(data, "menu_id", "parent_id", "children", 0)
            }
        })
        const search_config = reactive({
            label_width: "70px",
            form_button_group: [
                { label: "新增一级菜单", type: "danger", callback: () => handlerMenu('add') },
            ],
            form_button: {
                reset_button: true
            },
            form_item: [
                { 
                    type: "select", 
                    label: "禁启用", 
                    prop: "menu_disabled",
                    width: "100px",
                    options: globalData.whether
                },
                { 
                    type: "keyword", 
                    label: "关键字", 
                    prop: "keyword",
                    options: [
                        { label: "菜单名称", value: "menu_name" },
                        { label: "菜单路径", value: "menu_path" },
                        { label: "组件名称", value: "menu_component" }
                    ]
                },
            ],
            form_data: {
                menu_disabled: ""
            }
        })
        provide("search_config", search_config);
        const form_config = reactive({
            form_item: [
                { 
                    type: "input", 
                    label: "菜单名称", 
                    prop: "menu_name",
                    width: "300px",
                    required: true
                },
                { 
                    type: "input", 
                    label: "菜单路径", 
                    prop: "menu_path",
                    width: "300px",
                    required: true
                },
                { 
                    type: "input", 
                    label: "路由名称", 
                    prop: "menu_router",
                    width: "300px",
                    required: true
                },
                { 
                    type: "input", 
                    label: "映射组件", 
                    prop: "menu_component",
                    width: "300px",
                    required: true
                },
                { type: "upload", label: "图标", prop: "menu_icon" },
                { type: "inputNumber", label: "排序", prop: "menu_sort", required: true },
                { 
                    type: "radio", 
                    label: "是否禁用", 
                    prop: "menu_disabled",
                    options: globalData.whether
                },
                { 
                    type: "radio", 
                    label: "是否隐藏", 
                    prop: "menu_hidden",
                    options: globalData.whether
                },
                { 
                    type: "radio", 
                    label: "是否缓存", 
                    prop: "menu_keep",
                    options: globalData.whether
                },
                { 
                    type: "input", 
                    label: "重定向", 
                    prop: "menu_redirect",
                    width: "300px"
                },
                { 
                    type: "slot", 
                    label: "页面功能", 
                    slot_name: "menu_function"
                }
            ],
            form_button: [
                { label: "确认提交", type: "danger", key: "submit" }
            ],
            form_data: {
                menu_name: "",
                menu_path: "",
                menu_router: "",
                menu_component: "",
                menu_sort: 0,
                menu_disabled: "2",
                menu_hidden: "2",
                menu_keep: "2",
                menu_redirect: "",
                menu_icon: ""
            },
            form_loading: false,
            page_item: [JSON.parse(JSON.stringify(page_fun_json))]
        })
        
        const handlerSubmit = (value) => {
            if(data.menu_handler_flag === "edit" && data.row_id) { 
                handlerMenuEdit();
            }
            if(data.menu_handler_flag === "add" || data.menu_handler_flag === "add_sub") { 
                handlerMenuCreate();
            }
        }
        const basisFormRef = ref(null);
        const dislogClose = () => {
            form_config.page_item = [JSON.parse(JSON.stringify(page_fun_json))];
            data.row_id = "";
            data.menu_handler_flag = "";
            basisFormRef.value && basisFormRef.value.handlerFormReset();
            dialogVisible.value = false;
        }
        const dialogOpen = () => {
            if(data.menu_handler_flag === "edit" && data.row_id) { 
                handlerMenuDetailed();
            }
        }
        const handlerPush = () => {
            form_config.page_item.push(JSON.parse(JSON.stringify(page_fun_json)));
        }
        const handlerDel = (index) => {
            form_config.page_item.splice(index, 1);
        }
        const formatPageItem = () => {
            const data = Object.assign([], form_config.page_item);
            const dataItem = data.filter(item => item.label && item.value);
            return JSON.stringify(dataItem);
        }
        const handlerMenu = (type, id = "") => {
            data.menu_handler_flag = type;
            data.row_id = id;
            dialogVisible.value = true;
            // 更新标题
            data.title = data.title_item[type];
        }
        const handlerMenuDetailed = () => {
            form_config.form_loading = true;
            MenuDetailed({menu_id: data.row_id}).then(response => {
                form_config.form_loading = false;
                // form表单赋值
                form_config.form_data = formatRequestData(response.data, form_config.form_data);
                // 页面功能选值还原
                const pageItemInit = response.data.menu_fun;
                pageItemInit && (form_config.page_item = JSON.parse(pageItemInit));
            }).catch(error => {
                form_config.form_loading = false;
            })
        }
        const handlerMenuEdit = () => {
            form_config.form_loading = true;
            MenuUpdate({
                ...form_config.form_data,
                menu_fun: formatPageItem(),
                menu_id: data.row_id
            }).then(response => {
                form_config.form_loading = false;
                dislogClose();
                store.commit("app/SET_TABLE_REQUEST");
            }).catch(error => {
                form_config.form_loading = false;
            })
        }
        const handlerMenuCreate = () => {
            form_config.form_loading = true;
            const request_data = {
                ...form_config.form_data,
                menu_fun: formatPageItem()
            }
            if(data.menu_handler_flag === "add_sub") { request_data.parent_id = data.row_id; }
            MenuCreate(request_data).then(response => {
                form_config.form_loading = false;
                dislogClose();
                store.commit("app/SET_TABLE_REQUEST");
            }).catch(error => {
                form_config.form_loading = false;
            })
        }
        return {
            table_config,
            dialogVisible,
            form_config,
            basisFormRef,
            handlerSubmit,
            dislogClose,
            dialogOpen,
            handlerDel,
            handlerPush,
            handlerMenu,
            data
        }
    }
}
</script>
<style lang="scss" scoped></style>