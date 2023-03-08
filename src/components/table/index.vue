<template>
    <SearchForm v-if="config.search" @callbackSearch="getList" />
    <el-table :row-key="config.row_key" :default-expand-all="config.expand_all" :data="table_data.data" v-loading="table_data.loading" element-loading-text="加载中，请稍候" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column v-if="config.selection" type="selection" width="40"></el-table-column>
        <template v-for="header in data.render_header" :key="header.prop">
            <!-- switch -->
            <el-table-column v-if="header.type === 'switch'" :label="header.label" :width="header.width">
                <template #default="scope">
                    <Switch :data="scope.row" :config="header" />
                </template>
            </el-table-column>
            <!-- function -->
            <el-table-column v-else-if="header.type === 'function'" :label="header.label" :width="header.width">
                <template #default="scope">
                    <div v-html="header.callback && header.callback(scope.row)"></div>
                </template>
            </el-table-column>
            <!-- slot -->
            <el-table-column v-else-if="header.type === 'slot'" :label="header.label" :width="header.width">
                <template #default="scope">
                    <slot :name="header.slot_name" :data="scope.row"></slot>
                    <el-button v-if="header.delete_elem" @click="handlerDelete('delete', scope.row)" v-has-button="config.has_button_delete">删除</el-button>
                </template>
            </el-table-column>
            <!-- text -->
            <el-table-column v-else :prop="header.prop" :label="header.label" :width="header.width"></el-table-column>
        </template>
    </el-table>
    <el-row class="margin-top-20">
        <el-col :span="6">
            <el-button v-if="config.batch_delete" :disabled="!table_data.data_id" @click="handlerDelete('batch')" v-has-button="config.has_button_batch_delete">批量删除</el-button>
        </el-col>
        <el-col :span="18">
            <Pagination 
            v-if="config.pagination"
            @sizeChange="getList" 
            @currentChange="getList" 
            :total="table_data.total" 
            :current="table_data.current_page" />
        </el-col>
    </el-row>
</template>

<script>
import { reactive, getCurrentInstance, onBeforeMount, watch } from 'vue';
// store
import { useStore } from "vuex";
// components
import SearchForm from "@c/search";
import Pagination from "@c/pagination";
import Switch from "@c/control/switch";
// hook
import { configHook } from "./configHook";
import { requestHook } from "./requestHook";
export default {
    name: 'TableComponents',
    components: { Pagination, Switch, SearchForm },
    props: {
        columns: {
            type: Array,
            default: () => ([])
        },
        config: {
            type: Object,
            default: () => ({})
        },
        request: {
            type: Object,
            default: () => ({})
        },
        search: {
            type: Boolean,
            default: true
        }
    },
    emits: ["onload"],
    setup(props, { emit }){
        // store
        const store = useStore();
        // 获取实例上下文
        const { proxy } = getCurrentInstance();
        const { config, configInit } = configHook();
        const { requestData, table_data, handlerDeleteComfirm, saveDataId } = requestHook();
        const data = reactive({
            table_data: [],
            render_header: props.columns,
            row_data_id: [],
            currentPage: 0,
            total: 0
        })
        onBeforeMount(() => {
            // 默认配置项处理
            configInit(props.config);
            // 请求数据
            getList(props.request)
        })
        
        const getList = (params, type) => {
            requestData(params, type).then(response => {
                emit("onload", table_data);
            });
        }
        /** 删除动作 */
        const handlerDelete = (type, val) => {
            if(type === "delete") { saveDataId(val); }
            handlerDeleteComfirm();
        }
        /** 复选框事件 */
        const handleSelectionChange = (val) => {
            saveDataId(val);
        }
        watch(() => store.state.app.table_action_request, () => {
            config.action_request && getList();
        })
        return { data, config, table_data, requestData, getList, handlerDelete, handleSelectionChange }
    }
}
</script>
<style lang='scss' scoped>
.margin-top-20 { margin-top: 20px; }
</style>