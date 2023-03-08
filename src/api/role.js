import instance from "@/utils/request";  // 引入拦截器
/** 创建角色 */
export function RoleCreate(data = {}){
    return instance.request({
        method: "post",
        url: "/role/create",
        data
    })
}

/** 角色详情 */
export function RoleDetailed(data = {}){
    return instance.request({
        method: "post",
        url: "/role/detailed",
        data
    })
}

/** 角色修改 */
export function RoleUpdate(data = {}){
    return instance.request({
        method: "post",
        url: "/role/update",
        data
    })
}

/** 角色列表 */
export function RoleListAll(data = {}){
    return instance.request({
        method: "post",
        url: "/role/all",
        data
    })
}


