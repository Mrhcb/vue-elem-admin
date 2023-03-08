<template>
  <h1 class="logo"><img :src="logo" alt=""></h1>
  <el-menu :collapse="collapse" :default-active="currentPath" background-color="#344a5f" text-color="#fff" active-text-color="#ffffff" router>
    <template v-for="item in routers" :key="item.path">
      <template v-if="!item.hidden">
        <!-- 一级菜单 -->
        <template v-if="hasOnlyChild(item.children)">
          <el-menu-item :index="item.children[0].path">
            <img class="menu-icon" :src="item.meta.icon" alt="">
            <template #title>{{ item.children[0].meta && item.children[0].meta.title }}</template>
          </el-menu-item>
        </template>
        <!-- 子级菜单 -->
        <template v-else>
          <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path" >
            <template #title>
              <img class="menu-icon" :src="item.meta && item.meta.icon" alt="">
              <span>{{ item.meta && item.meta.title }}</span>
            </template>
            <template v-for="child in item.children" :key="child.path">
              <el-menu-item v-if="!child.hidden" :index="child.path">{{ child.meta && child.meta.title }}</el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </template>
    </template>
  </el-menu>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { reactive, computed, toRefs } from "vue";
import { useStore } from "vuex";
export default {
  name: "Aside",
  components: {},
  props: {},
  setup(){
    const { options } = useRouter();
    const { path } = useRoute();
    const store = useStore();
    const routers = options.routes;
    /**
     * 数据
     */
    const data = reactive({
      logo: computed(() => {
        return store.state.app.collapse ? require("@/assets/images/logo-min.png") : require("@/assets/images/logo.png")
      }),
      collapse: computed(() => store.state.app.collapse)
    })

    /**
     * 判断是否只有一个子级菜单
     */
    const hasOnlyChild = (children) => {
      
      if(!children) { return false; }
      // 存储路由
      if(!children) { return false; }
      const childRouter = children.filter(item => {
        return item.hidden ? false : true;
      })
      
      // 只有一个子级路由
      if(childRouter.length === 1) {
        return true;
      }
      // 否则
      return false;
    }
    /**
     * 获取当前路由路径
     */
    const currentPath = computed(() => path);
    return {
      ...toRefs(data),
      routers,
      hasOnlyChild,
      currentPath
    }
  }
};
</script>
<style lang="scss" scoped>
.logo {
  padding: 20px 0;
  border-bottom: 1px solid #2d4153;
  img { margin: auto; }
}
.menu-icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  margin:0 5px 0 0;
}
</style>