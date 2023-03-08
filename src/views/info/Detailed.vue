<template>
    <BasisForm @callback="handlerSubmitForm" :item="form_config.form_item" :button="form_config.form_button" label-width="120px" :field="form_config.form_data"/>
</template>
<script>
import { reactive, onBeforeMount, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
import BasisForm from "@c/form";
import { InfoCreate, GetDetailed, InfoEdit } from "@/api/info";
// 全局数据
import globalData from "@/js/data";
import dayjs from "dayjs";
export default {
    name: 'InfoDetailed',
    components: { BasisForm },
    props: {},
    setup(props){
        // 获取实例上下文
        const { proxy } = getCurrentInstance();
        // router
        const { go } = useRouter();
        const { query } = useRoute();
        const data = reactive({
            row_id: query.id,
        })
        const form_config = reactive({
            form_item: [
                { 
                    type: "cascader", 
                    label: "信息分类", 
                    prop: "category_id",
                    props: {
                        label: "category_name",
                        value: "id"
                    },
                    url: "category",
                    required: true
                },
                { 
                    type: "input", 
                    label: "信息标题", 
                    prop: "title",
                    width: "300px",
                    placeholder: "请输入标题",
                    max_length: 50,   // 最大输入长度
					min_length: 1,     // 最小输入长度
                    required: true,
                    message: "请务必填写标题"
                },
                { type: "upload", label: "缩略图", prop: "image_url" },
                { type: "date", label: "发布日期",  prop: "create_date" },
                { 
                    type: "radio", 
                    label: "是否发布", 
                    prop: "status",
                    options: globalData.whether,
                    required: true
                },
                { type: "wangeditor", label: "内容描述", prop: "content" }
            ],
            form_data: {
                image_url: "",
                category_id: "",
                title: "",
                create_date: "",
                content: "",
                status: "1",
            },
            form_button: [
                { label: "提交", type: "danger", key: "submit" },
                // { label: "重置", type: "primary", key: "reset" },
                // { label: "关闭", type: "primary", key: "close", callback: () => handlerClose() },
            ]
        })
        onBeforeMount(() => {
            // 获取详情
            data.row_id && handlerGetDetailed();
        })
        const handlerSubmitForm = (formName) => {
            data.row_id ? handlerEditInfo() : handlerAddInfo()
        }
        // 新增信息
        const handlerAddInfo = () => {
            // 深度拷贝
            const request_data = JSON.parse(JSON.stringify(form_config.form_data));
            // 日期处理
            request_data.create_date = dayjs(request_data.create_date).format("YYYY-MM-DD HH:mm:ss");
            InfoCreate(request_data).then(response => {
                // 弹窗提示
                proxy.$message.success(response.message);  
                // 重置表单
                go(-1);
            })
        }
        // 编辑信息
        const handlerEditInfo = () => {
            console.log(22222)
            // 深度拷贝
            const request_data = JSON.parse(JSON.stringify(form_config.form_data));
            InfoEdit(request_data).then(response => {
                // 弹窗提示
                proxy.$message.success(response.message);  
                // 重置表单
                go(-1);
            })
        }
        
        // 获取详情
        const handlerGetDetailed = () => {
            GetDetailed({id:data.row_id}).then(response => {
                form_config.form_data = response.data
            })
        }
        return { 
            handlerSubmitForm,
            form_config,
        }
    }
}
</script>
<style lang="scss" scoped></style>