// api
import { GetPermission } from "@a/account";
// store
import { useStore } from "vuex";
/** 自定义hook */
export function permissionHook(){
    
    console.log(store)
    /** 获取分类 */
    const getPermission = () => {
        
        GetPermission().then(response => {
            store.dispatch("permission/getPermissionAction")
        })
    };
    return { getPermission }
}