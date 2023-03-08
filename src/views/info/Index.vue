<template>
    <BasisTable :search="false" :columns="table_config.table_header" :config="table_config.config" :request="table_config.request">
        <template v-slot:operation="slotData">
            <el-button type="danger" @click="handlerDetailed(slotData.data.id)" v-has-button="'init:edit'">编辑</el-button>
        </template>
    </BasisTable>
</template>

<script>
import { useRouter } from "vue-router";
import{ reactive, provide } from "vue";
import { getDate } from "@/utils/common";
import { categoryHook } from "@/hook/infoHook";
// components
import BasisTable from "@c/table";
// 全局数据`
import globalData from "@/js/data";
export default {
    name: 'InfoIndex',
    components: { BasisTable },
    props: {},
    setup(props){
        const search_config = reactive({
            label_width: "100px",
            form_button_group: [
                { label: "新增", type: "danger", callback: () => addInfo() },
                { label: "其他按钮",  callback: () => {} }
            ],
            form_button: {
                reset_button: true
            },
            form_item: [
                { 
                    type: "cascader", 
                    label: "类别", 
                    prop: "category_id",
                    props: {
                        label: "category_name",
                        value: "id"
                    },
                    url: "category",
                    label_width: 80,
                    col: 6
                },
                { 
                    type: "select", 
                    label: "发布状态", 
                    prop: "status",
                    options: globalData.whether,
                    col: 4
                },
                { 
                    type: "keyword", 
                    label: "关键字", 
                    prop: "keyword",
                    options: [
                        { label: "ID", value: "id" },
                        { label: "标题", value: "title" }
                    ],
                    col: 8
                },
            ],
            button_col: 6,
            form_data: {
                category_id: "",
                status: ""
            }
        })
        provide("search_config", search_config);

        // router
        const { push } = useRouter();
        // hook
        const { infoData: category_data, handlerGetCategory: getList } = categoryHook();
        const data = reactive({
            category: 0,
            keyword_options: [
                { label: "ID", value: "id" },
                { label: "标题", value: "title" }
            ],
        });
        const request_data = reactive({
            pageNumber: 1,
            pageSize: 10,
            category_id: [],
            key: "",
            keyword: ""
        })
        const table_config = reactive({
            table_header: [
                { label: "标题", prop: "title", width: "500" },
                { 
                    label: "类别", 
                    prop: "category_name",
                    width: "200",
                    type: "function",
                    callback: (row) => {
                        return `<a href="http://www.web-jshtml.cn" title="手把手撸码前端">${row.category_name}</a>`;
                    }
                },
                { 
                    label: "日期", 
                    prop: "createDate",
                    type: "function", 
                    callback: (row) => {
                        return getDate({ value: row.createDate * 1000 });
                    }
                },
                { 
                    label: "发布状态", 
                    prop: "status",
                    type: "switch",
                    key_id: "id",
                    api_module: "info",
                    api_key: "info_status",
                    options: globalData.whether
                },
                { 
                    label: "操作", 
                    type: "slot",
                    slot_name: "operation",
                    width: "200",
                    delete_elem: true
                }
            ],
            config: {},
            request: {
                url: "info",
                data: {
                    pageNumber: 1,
                    pageSize: 10,
                },
                delete_key: "id"
            }
        })
        // 详情页
        const handlerDetailed = (id) => {
            push({
                path: "/newsDetailed",
                query: { id }
            })
        }
        const addInfo = () => {
            push({
                path: "/newsDetailed"
            })
        }

        const handlerOnload = (data) => {
            console.log(data)
        }

        return {
            data,
            category_data,
            request_data,
            table_config,
            handlerDetailed,
            handlerOnload,
            addInfo
        }
    }
}
</script>
<style lang="scss" scoped>
.width-160 { width: 160px; }
.width-100 { width: 100px; }
.width-180 { width: 180px; }
</style>