/** props */
export const propsType = {
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
    }
}
/** 自定义hook */
export function dialogHook(emit){
    /** dialog关闭 */
    const close = (form) => {
        emit("update:flag", false) 
        // 重置表单
        form && form.value.handlerFormReset();
    };
    return {
        close
    };
}