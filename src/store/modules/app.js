//cookies
import { setToken, setUsername, getUsername, getToken, removeToken, removeUsername } from "@u/cookies";
// api
import { Login, Logout } from "@a/account";
const state = {
    collapse: JSON.parse(sessionStorage.getItem('collapse')) || false,
    token: "" || getToken(),
    username: "" || getUsername(),
    table_action_request: false
};
const getters = {}
const mutations = {
    SET_COLLAPSE(state){
        state.collapse = !state.collapse;
        sessionStorage.setItem('collapse', JSON.stringify(state.collapse));
    },
    SET_TOKEN(state, value){ // 设置 token
        state.token = value;
        value && setToken(value);
    },
    SET_USERNAME(state, value){ // 设置用户名
        state.username = value;
        value && setUsername(value);
    },
    SET_TABLE_REQUEST(state){
        state.table_action_request = !state.table_action_request
    }
}
const actions = {
    loginAction(context, repuestData) {
        return new Promise((resolve, reject) => {
            Login(repuestData).then((response) => {
                let data = response.data;
                context.commit('SET_TOKEN', data.token);
                context.commit('SET_USERNAME', data.username);
                resolve(response);
            }).catch(error => {
                reject(error);
            })
        })
    },
    // 登出
    logoutAction({ commit }){
        return new Promise((resolve, reject) => {
            Logout().then(response => {
                removeToken();
                removeUsername();
                commit('SET_TOKEN', '');
                commit('SET_USERNAME', '');
                resolve(response);
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
    