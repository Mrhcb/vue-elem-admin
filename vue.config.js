const path = require("path");
// webpack.config.js
// const ElementPlus = require("unplugin-element-plus/webpack").default;
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 输出文件目录
  outputDir: process.env.NODE_ENV === "production" ? "dist" : "devdist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  /** vue3.0内置了webpack所有东西，
   * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
   **/
  chainWebpack: (config) => {
    // svg 图标解析
    const svgRule = config.module.rule("svg");  //默认规则赋给 subRule 变量  
    svgRule.uses.clear();  // 清除已有的所有规则。
    svgRule  // 添加要替换的规则
    .use("svg-sprite-loader")
    .loader("svg-sprite-loader")
    .options({ 
      symbolId: "icon-[name]",
      include: ["./src/components/svgIcon/icon"] // 特别注意的目录路径
    });
    // 配置base64转换规则
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 1 }))

    // 载入项目分析工具
    // config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
  configureWebpack: (config) => {
    config.resolve = { // 配置解析别名
    extensions: ['.js', '.json', '.vue'],  // 自动添加文件名后缀
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@u': path.resolve(__dirname, './src/utils'),
        '@a': path.resolve(__dirname, './src/api'),
        '@c': path.resolve(__dirname, './src/components')
      }
    }
    config.externals = {
      vue: "Vue",
      "element-plus": "ElementPlus"
    }
    //关闭 webpack 的性能提示
    config.performance = {
      hints:false
    }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      scss: {
        prependData: `@import "./src/styles/main.scss";`,
      },
    },
    requireModuleExtension: true,
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  /**
   *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
   */
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: false, // 编译完成是否打开网页
    host: '0.0.0.0', // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
    port: 8081, // 访问端口
    https: false, // 编译失败时刷新页面
    hot: true, // 开启热加载
    hotOnly: false,
    proxy: {
      [process.env.VUE_APP_API]: {
          target: process.env.VUE_APP_DEV_TARGET, //API服务器的地址  http://www.web-jshtml.cn/api/v3
          changeOrigin: true,
          pathRewrite: {
            [`^${process.env.VUE_APP_API}`]: ''
          }
      }
    }
  },
  /**
   * 第三方插件配置
   */
  pluginOptions: {},
};
