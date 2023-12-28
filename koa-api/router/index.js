const Router = require('koa-router')
const router = new Router()

const {NormalUsers} = require("../controllers/sub/NormalUsers")
const {UploadFile} = require("../controllers/sub/UploadFile")

const routeList = [

    /**
     * JWT
     */
    {
        method: 'post',
        path: '/gettoken',
        controller: NormalUsers.gettoken
    },
    {
        method: 'post',
        path: '/showInfo',
        controller: NormalUsers.showInfo
    },

    /**
     * 用户管理
     */
    {
        method: 'post',
        path: '/register',
        controller: NormalUsers.register
    },
    {
        method: 'post',
        path: '/login',
        controller: NormalUsers.login
    },
    {
        method: 'post',
        path: '/getUserById',
        controller: NormalUsers.getUserById
    },
    {
        method: 'post',
        path: '/uploadHead',
        before: NormalUsers.uploadHeadBefore,
        controller: NormalUsers.uploadHead
    },
    {
        method: 'post',
        path: '/testSession',
        controller: NormalUsers.testSession
    },
    /**
     * 文件上传
     */
    {
        method: 'post',
        path: '/saveVideo',
        before: UploadFile.saveVideoBefore,
        controller: UploadFile.saveVideo
    },
    {
        method: 'post',
        path: '/saveBigImg',
        before: UploadFile.saveBigImgBefore,
        controller: UploadFile.saveBigImg
    },
    {
        method: 'post',
        path: '/getVideoList',
        controller: UploadFile.getVideoList
    },
    {
        method: 'post',
        path: '/getMyProfile',
        controller: UploadFile.getMyProfile
    },
    {
        method: 'post',
        path: '/delMyProfile',
        controller: UploadFile.delMyProfile
    },

    {
        method: 'post',
        path: '/updateMyProfile',
        controller: UploadFile.updateMyProfile
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
