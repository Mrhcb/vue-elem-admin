import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 守卫路由
import "./router/permit";
// elementui
import ElementUI from "./plugins/elementui";
// 批量导入svg文件
import "@/components/svgIcon/svg";
// svgicon
import SvgIcon from "@/components/svgIcon/Index.vue";
// 全局方法
import Global from "@/utils/global";
// 自定义指令
import directive from "./plugins/directive";
const app = createApp(App);
app
.use(store)
.use(router)
.use(ElementUI)
.use(directive)
.use(Global)
.component("svg-icon", SvgIcon)
.mount("#app");
