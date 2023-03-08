<template>
    <div ref="editor"></div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import WangEditor from 'wangeditor';
// cookies
import { getToken } from "@/utils/cookies";  // 这是封装好的方法
export default {
    name: 'Wangeditor',
    components: {},
    props: {
        content: {
            type: String,
            default: ""
        }
    },
    emits: ["update:content"],
    setup(props, { emit }){
        let html = ref(null)
        // 内容
        let content = ref();
        // 富文本DOM元素
        const editor = ref();
        // 富文本对象
        let editor_instance = null;
        // 生命周期
        onMounted(() => {
            // 创建富文本对象
            editor_instance = new WangEditor(editor.value);
            // 图片上传配置
            editor_instance.config.uploadImgServer = process.env.VUE_APP_DEV_TARGET + '/upload' // 上传图片的接口地址
            editor_instance.config.uploadFileName = 'files' // formdata中的name属性
            editor_instance.config.uploadImgHeaders = {
                Token: getToken() // 设置请求头
            }
            editor_instance.config.uploadImgHooks = {
                // 图片上传并返回结果，但图片插入错误时触发
                fail: function (xhr, editor, result) {
                    console.log(result)
                },
                // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
                customInsert: function(insertImgFn, result) {
                    // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
                    insertImgFn(result.data.files_path)
                }
            }
            // 配置change事件
            Object.assign(editor_instance.config, {
                onchange(value) {
                    content.value = value;
                    emit("update:content", value);
                },
            });
            // 创建
            editor_instance.create();
        })
        watch(() => props.content, (newContent, oldContent) => {
            editor_instance.txt.html(newContent);
        })
        return { editor }
    }
}
</script>
<style lang='scss' scoped>
</style>