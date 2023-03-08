const apiUrl = {
    // 信息模块
    info: {                      // 模块键名
        list: {                  // 列表数据接口
            url: "/news/getList/",   
            method: "post"
        },
        info_status: {
            url: "/news/status/",   
            method: "post"
        },
        delete: {
            method: "post",
            url: "/news/delete/"
        }
    },
    // 级联选择器模块
    cascader: {
        category: {
            url: "/news/getCategoryAll/",
            method: "post"
        }
    },
    // 菜单模块
    menu: {
        list: {
            url: "/menu/lists",
            method: "post"
        },
        delete: {
            method: "post",
            url: "/menu/remove"
        },
        hidden_status: {
            url: "/menu/statusHidden",
            method: "post"
        },
        disabled_status: {
            url: "/menu/statusDisabled",
            method: "post"
        }
    },
    // 角色模块
    role: {
        status: {
            url: "/role/status",
            method: "post"
        },
        delete: {
            url: "/role/delete",
            method: "post"
        },
        list: {
            url: "/role/lists",
            method: "post"
        }
    },
    // 用户模块
    user: {
        status: {
            url: "/user/status",
            method: "post"
        },
        delete: {
            method: "post",
            url: "/user/remove"
        },
        list: {
            url: "/user/lists",
            method: "post"
        }
    }
    
}
export default apiUrl;