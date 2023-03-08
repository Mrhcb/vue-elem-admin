import instance from "@/utils/request";  // 引入拦截器
/** 创建用户 */
export function UserCreate(data = {}){
    return instance.request({
        method: "post",
        url: "/user/create",
        data
    })
}

/** 用户详情 */
export function UserDetailed(data = {}){
    return instance.request({
        method: "post",
        url: "/user/detailed",
        data
    })
}

/** 用户修改 */
export function UserUpdate(data = {}){
    return instance.request({
        method: "post",
        url: "/user/update",
        data
    })
}

/** 修改密码 */
export function UpdatePass(data = {}){
    return instance.request({
        method: "post",
        url: "/user/password",
        data
    })
}