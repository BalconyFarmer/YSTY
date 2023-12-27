const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

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
