<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>
<script>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
export default {
  name: "App",
  setup() {
    // 切换为中文
    let locale = zhCn
    return {
      locale
    }
  }
}
</script>
<style lang="scss">
#app{}
</style>