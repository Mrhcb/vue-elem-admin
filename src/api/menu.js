import instance from "@/utils/request";  // 引入拦截器
/** 创建菜单 */
export function MenuCreate(data = {}){
    return instance.request({
        method: "post",
        url: "/menu/create",
        data
    })
}

/** 获取菜单详情 */
export function MenuDetailed(data = {}){
    return instance.request({
        method: "post",
        url: "/menu/detailed",
        data
    })
}


/** 菜单编辑 */
export function MenuUpdate(data = {}){
    return instance.request({
        method: "post",
        url: "/menu/update",
        data
    })
}

/** 菜单列表 */
export function MenuList(data = {}){
    return instance.request({
        method: "post",
        url: "/menu/listsTree",
        data
    })
}

/** 菜单列表树状数据 */
export function MenuListTree(data = {}){
    return instance.request({
        method: "post",
        url: "/menu/listsTree",
        data
    })
}