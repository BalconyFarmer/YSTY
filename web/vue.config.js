const path = require("path");
const fs = require("fs");
const webpack = require("webpack");


// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === "production" ? "/3DEditor/" : "/";
// const BASE_URL = process.env.NODE_ENV === "production" ? "/hh" : "/";

module.exports = {
    publicPath: "/3DEditor/",
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: 8082
    },
    transpileDependencies: [
        "vue-echarts",
        "resize-detector"
    ],

};
