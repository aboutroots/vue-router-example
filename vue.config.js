const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/",
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       "@": require("path").resolve(__dirname, "src"),
  //     },
  //   },
  // },
});
