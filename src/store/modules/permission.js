// API
import { GetPermission } from "@a/account";
// utils
import { formatTree } from "@/utils/format";
/** 格式化菜单数据生成路由 */
const formatRouterMenu = (data) => {
    // 检测数据是否存在
    if(data && (!Array.isArray(data) || data.length === 0)) {
        return false
    }
    // 监听存储数据
    const router = [];
    // 遍历菜单
    data.forEach(item => {
        const router_obj = {};
        // id
        router_obj.menu_id = item.menu_id;
        router_obj.parent_id = item.parent_id;
        // path
        router_obj.path = item.menu_path;
        // name
        router_obj.name = item.menu_router;
        // hidden
        if(item.menu_hidden === "1") { router_obj.hidden = true; }
        // redirect
        if(item.menu_redirect) { router_obj.redirect = item.menu_redirect; }
        // meta
        router_obj.meta = {
            // 菜单名称
            title: item.menu_name,
            // 菜单图标
            icon: item.menu_icon,
            // 是否缓存页面
            keepAlive: item.menu_keep === "1" ? true : false
        }
        // component
        router_obj.component = require(`@/${item.menu_component}`).default;
        // 添加至router数组
        router.push(router_obj);
    })
    // 树状格式化
    const tree_data = formatTree(router, "menu_id", "parent_id", "children", 0);
    // 返回数据
    return tree_data;
}
const state = {
    async_router: [],
    elem: "",
    user_type: ""
};
const getters = {
    async_router: state => state.async_router,
    elem: state => state.elem,
    user_type: state => state.user_type,
}
const mutations = {
    SET_ROUTER(state, value){
        state.async_router = value;
    },
    SET_ELEM(state, value){
        state.elem = value;
    },
    SET_USERTYPE(state, value){
        state.user_type = value;
    }
}
const actions = {
    getRouterAction(context) {
        return new Promise((resolve, reject) => {
            GetPermission().then((response) => {
                const data = response.data.router_menu;
                // 格式化菜单数据生成路由
                const menu = formatRouterMenu(data);
                // 存储路由
                context.commit("SET_ROUTER", menu);
                // 存储元素权限 
                context.commit("SET_ELEM", response.data.elem_data);
                // 更新用户类型
                context.commit("SET_USERTYPE", response.data.user);
                resolve(response);
            }).catch(error => {
                reject(error);
            })
        })
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
    