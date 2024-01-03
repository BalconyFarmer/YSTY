const Router = require('koa-router')
const router = new Router()
const {HotPointController} = require("../controllers/yunshituyan/HotPointController")

const routeList = [

    // yunshituyan

    {
        method: 'post',
        path: '/getHotById',
        controller: HotPointController.getHotById
    },
    {
        method: 'post',
        path: '/uploadHeadMinio',
        before: HotPointController.uploadHeadMinioBefore,
        controller: HotPointController.uploadHeadMinio
    },
    {
        method: 'post',
        path: '/addHot',
        controller: HotPointController.addHot
    },
    {
        method: 'post',
        path: '/updateHot',
        controller: HotPointController.updateHot
    },
    {
        method: 'post',
        path: '/deleteHot',
        controller: HotPointController.deleteHot
    },
];

routeList.forEach(item => {
    if (item.before) { // 文件上传处理
        const {method, path, before, controller} = item;
        router[method](path, before, controller);
    } else {
        const {method, path, controller} = item;
        router[method](path, controller);
    }
});


module.exports = {router};
