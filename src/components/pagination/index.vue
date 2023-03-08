<template>
    <el-pagination
        class="pull-right" 
        sizs="small" 
        background 
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:current-page="current_page"
        :page-size="10"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
</template>

<script>
import { ref, watchEffect, watch } from 'vue';
export default {
    name: 'Pagination',
    props: {
        total: {
            type: [Number, String],
            default: 0
        },
        current: {
            type: [Number, String],
            default: 0
        },
        flag: {
            type: Boolean,
            default: false
        },
    },
    emits: ["sizeChange", "currentChange", "update:flag"],
    setup(props, { emit }){
        // 当前页码
        const current_page = ref(1);
        // 总条数统计
        const total = ref(props.total);
        const page_status = ref(false);
        // 监听props.total发生变化时更新total
        watchEffect(() => { 
            total.value = props.total;
            current_page.value = props.current;
        })
        watch(() => props.flag, (newValue) => {
            page_status.value = newValue
        })
        // 页码事件
        const handleSizeChange = (val) => {
            page_status.value = true
            emit("update:flag", true)
            const params = {
                pageNumber: 1,
                pageSize: val
            }
            emit("sizeChange", params, 'page')
        }
        const handleCurrentChange = (val) => {
            if(page_status.value) { return false }
            const params = {
                pageNumber: val
            }
            emit("currentChange", params, 'page')
        }
        return { total, current_page, handleSizeChange, handleCurrentChange }
    }
}
</script>