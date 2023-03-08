import instance from "@/utils/request";  // 引入拦截器
/** 获取验证码 */
export function GetCode(data = {}){
    return instance.request({
        method: "post",
        url: "/getCode/",
        data
    })
}

/** http 状态码异常演示接口 */
export function ErrorHttp(data = {}){
    return instance.request({
        method: "post",
        url: "/error/",
        data
    })
}


/**
 * BasisTable组件公共接口 
 * @param { String } method 请求类型 
 * @param { String } url 请求地址 
 * @param { Object } data 请求参数 
 */
export function TableData(params = {}){
    return instance.request({
        method: params.method,
        url: params.url,
        data: params.data
    })
}

/**
 * 
 * @param { method } String 请求类型 
 * @param { url } String 请求地址 
 * @param { data } Object 请求参数 
 * @description BasisTable组件公共接口 
 */
 export function SwitchStatus(params = {}){
    return instance.request({
        method: params.method,
        url: params.url,
        data: params.data
    })
}

/**
 * 
 * @param { method } String 请求类型 
 * @param { url } String 请求地址 
 * @param { data } Object 请求参数 
 * @description BasisTable组件公共接口 
 */
 export function CommonApi(params = {}){
    return instance.request({
        method: params.method,
        url: params.url,
        data: params.data
    })
}

/** 文件上传 */
export function UploadFile(data = {}){
    return instance.request({
        method: "post",
        url: "/upload",
        data
    })
}