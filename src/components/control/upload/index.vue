<template>
    <el-upload
        class="avatar-uploader"
        action="#"
        :http-request="handlerUpload"
        :before-upload="handlerBeforeOnUpload"
        :on-error="handlerOnError"
        :show-file-list="false"
        :disabled="disabled"
    >
        <img v-if="data.image_url" :src="data.image_url" class="avatar" />
        <span v-else>+</span>
    </el-upload>
</template>

<script>
import { reactive, getCurrentInstance, watch } from 'vue';
import { UploadFile } from "@/api/common";
export default {
    name: "BasisUpload",
    components: {},
    props: {
        value: {
            type: String,
            default: ""
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    emits: ["update:value", 'callback'],
    setup(props, { emit }){
        // 获取实例上下文
        const { proxy } = getCurrentInstance();
        const data = reactive({
            image_url: ""
        })
        const handlerOnError = (res, file) => {}
        const handlerBeforeOnUpload = async (file) => {
            const isLt2M = file.size / 1024 / 1024 < 2; // 限制文件大小不能大于 2M
            if (!isLt2M) {
                proxy.$message.error("上传图片大小不能超过 2MB!");
                return false;
            }
            return isJPG && isLt2M;
        }
        const handlerUpload = async (params) => {
            const file = params.file;
            // 实例化表单对象
            const form = new FormData();
            // 表单添加 files 字段
            form.append("files", file);
            // 上传接口
            try{
                const url = await startUpload(form)
                data.image_url = url;
                emit("update:imageUrl", url)
            }catch{
                console.log("上传失败")
            }
        }
        /**
         * 开始文件上传
         */
        const startUpload = (form) => {
            return new Promise((resolve, reject) => {
                UploadFile(form).then(response => {
                    resolve(response.data.files_path);
                })
            })
        }
        watch(() => props.value, (newValue, oldValue) => {
            data.image_url = newValue
        })
        return { 
            data,
            handlerUpload,
            handlerOnError,
            handlerBeforeOnUpload
        }
    }
}
</script>
<style lang='scss' scoped>
</style>