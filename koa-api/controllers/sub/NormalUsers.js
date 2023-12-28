/**
 * 用户接口
 */
const fs = require('fs')
const {initSequelize} = require("../../app.js")
const {sessionApp} = require("../../app.js")
const moveFile = require('../../common/utils/moveFile');
const koaBody = require('koa-body')
const path = require('path')
const getUploadFileExt = require('../../common/utils/getUploadFileExt');
const getUploadFileName = require('../../common/utils/getUploadFileName');
const checkDirExist = require('../../common/utils/checkDirExist');
const {config} = require("../../common/config");
const jsonwebtoken = require("jsonwebtoken");

let index = 1

const NormalUsers = {
    register: async ctx => {
        let postData = ctx.request.body
        let result = await initSequelize.normalUsersM.handleRegist(postData)

        if (result === null) {
            ctx.body = '该账户已注册'
        } else {
            const folderAddress = `./static/uploadDefault/${result.id}`
            const folderAddressObj = `./static/uploadDefault/${result.id}/objs`
            const folderAddressPic = `./static/uploadDefault/${result.id}/pictures`
            const folderAddressvideo = `./static/uploadDefault/${result.id}/videos`
            const folderAddressScene = `./static/uploadDefault/${result.id}/scenes`
            const headIcon = `./static/uploadDefault/${result.id}/headIcon`
            fs.mkdirSync(folderAddress); // 创建用户文件夹
            fs.mkdirSync(folderAddressObj);
            fs.mkdirSync(folderAddressPic);
            fs.mkdirSync(folderAddressvideo);
            fs.mkdirSync(folderAddressScene);
            fs.mkdirSync(headIcon);
            ctx.body = '注册成功'
        }
    },

    login: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.normalUsersM.handleLogin(postData)
        if (result) {
            if (result.password === postData.password) {
                sessionApp.setSession(ctx, result)
                ctx.body = result
            } else {
                ctx.body = '密码错误'
            }
        } else {
            ctx.body = '请先注册'
        }
    },

    testSession: async ctx => {
        let postData = ctx.request.body
        const userid = sessionApp.judgeSession(ctx)
        ctx.body = "用户id:" + userid
    },

    /**
     * headers my-token tokenValue
     * @param ctx
     * @param next
     * @returns {Promise<void>}
     */
    gettoken: async (ctx, next) => {
        //模拟数据
        let user = {userId: index, name: index};
        index += 1
        //使用jsonwebtoken加密
        let token = jsonwebtoken.sign(user, config.JWTSecret);
        //响应token
        ctx.response.set('my-token', token);
        ctx.body = "token写回成功:" + token;
    },

    /**
     * 客户端访问http://localhost:8888/showInfo并在请求头上携带authorization:bearer tokenValue时，可获取用户数据
     * @param ctx
     * @param next
     * @returns {Promise<void>}
     */
    showInfo: async (ctx, next) => {
        //jwt中为了获取之前加密的数据,可以使用ctx.state.user来拿
        console.log(ctx.state.user, "+++")
        ctx.body = "登录成功:" + ctx.state.user.name
    },

    getUserById: async ctx => {
        let postData = ctx.request.body
        const params = postData.id
        const result = await initSequelize.normalUsersM.getUserById(params)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = '获取失败'
        }
    },

    uploadHeadBefore: koaBody({
        multipart: true,
        formidable: {
            uploadDir: path.join(__dirname, './uploadDefault'),
            keepExtensions: true,
            maxFieldsSize: 2000 * 1024 * 1024,  // 1000 M
            onFileBegin: (name, file) => {
                const fileType = "headIcon"
                // 获取文件后缀
                const ext = getUploadFileExt(file.name);
                const staticPath = '../../static'
                const dir = path.join(__dirname, `${staticPath}/uploadDefault/${name}/${fileType}`);
                checkDirExist(dir);
                const fileName = getUploadFileName(ext);

                // 真实写入路径
                file.path = `${dir}/${fileName}`;

                // 数据库存储路径
                const realPath = `/uploadDefault/${name}/${fileType}/${fileName}`
                file.realPath = realPath
            },
            patchKoa: true
        }
    }),

    uploadHead: async ctx => {
        // const userid = sessionApp.judgeSession(ctx)
        const files = ctx.request.files

        let userid = null
        for (let i in files) {
            userid = i
        }

        const isArr = Array.isArray(files[userid])
        let fileList = []
        if (isArr) {
            fileList = [...files[userid]]
        } else {
            fileList = [files[userid]]
        }

        let result = []
        fileList.forEach((item) => {
            const postData = {
                userid: userid,
                videoname: ctx.request.body.videoIntroduce,
                videopath: item.realPath
            }
            initSequelize.normalUsersM.uploadHead(postData)
            result.push(postData)
        })
        ctx.body = result;

    }
}


module.exports = {
    NormalUsers
};
