import axios from "axios";
// cookies
import { getToken, getUsername, removeToken, removeUsername } from "@/utils/cookies";  // 这是封装好的方法
// ElementUI 单独引入
import { ElMessage } from 'element-plus'
// vue-router
import router from "@/router";
// 创建实例
const instance = axios.create({
    baseURL: process.env.VUE_APP_API,    // 请求地址
    timeout: 5000,  // 超时
});
// 拦截器
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if(getToken()) {
        config.headers['Token'] = getToken();        // 携带token
    }
    if(getUsername()) {
        config.headers['Username'] = getUsername();  // 携带用户名
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    const data = response.data;
    if(data.resCode === 0) {
        return Promise.resolve(data);
    }else{
        ElMessage({
            message: data.message,
            type: "error"
        })
        return Promise.reject(data);
    }
}, function (error) {
    const errorData = JSON.parse(error.request.response);
    if(errorData.message) {
        ElMessage({
            message: errorData.message,
            type: "error"
        })
    }
    // token失效自动退出
    if(errorData.resCode === 1010) {
        router.replace({
            name: "Login"
        })
        removeToken();
        removeUsername();
    }
    // 对响应错误做点什么
    return Promise.reject(errorData);
});
// 暴露instance
export default instance;
