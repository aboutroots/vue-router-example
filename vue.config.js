const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/vue-router-example/" // Replace with your repository name
      : "/",
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       "@": require("path").resolve(__dirname, "src"),
  //     },
  //   },
  // },
});
