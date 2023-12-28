const {initSequelize} = require("../../app.js")
const moveFile = require('../../common/utils/moveFile');
const {sessionApp} = require("../../app.js")
const fs = require('fs')
const koaBody = require('koa-body')
const path = require('path')
const getUploadFileExt = require('../../common/utils/getUploadFileExt');
const getUploadFileName = require('../../common/utils/getUploadFileName');
const checkDirExist = require('../../common/utils/checkDirExist');

const UploadFile = {
    saveVideoBefore: koaBody({
        multipart: true,
        formidable: {
            uploadDir: path.join(__dirname, './uploadDefault'),
            keepExtensions: true,
            maxFieldsSize: 2000 * 1024 * 1024,  // 1000 M
            onFileBegin: (name, file) => {
                const fileType = "videos"
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
    // 保存视频
    saveVideo: async ctx => {
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
                videopath: item.realPath,
                type: "video"
            }
            initSequelize.videoModelM.saveVideo(postData)
            result.push(postData)
        })
        ctx.body = result;
    },

    saveBigImgBefore: koaBody({
        multipart: true,
        formidable: {
            uploadDir: path.join(__dirname, './uploadDefault'),
            keepExtensions: true,
            maxFieldsSize: 2000 * 1024 * 1024,  // 1000 M
            onFileBegin: (name, file) => {
                const fileType = "pictures"
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
    saveBigImg: async ctx => {

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
            initSequelize.videoModelM.saveBigImg(postData)
            result.push(postData)
        })
        ctx.body = result;
    },

    getVideoList: async ctx => {
        let postData = {
            pageIndex: ctx.request.body.pageIndex,
            limit: ctx.request.body.limit
        }
        const result = await initSequelize.videoModelM.getVideoList(postData)
        const allCount = await initSequelize.videoModelM.getVideoListLength()
        const res = {
            list: result,
            allCnt: allCount.count
        }
        if (result) {
            ctx.body = res
        } else {
            ctx.body = ''
        }

    },

    getMyProfile: async ctx => {
        // const userid = sessionApp.judgeSession(ctx)
        let postData = ctx.request.body
        const result = await initSequelize.videoModelM.getMyProfile(postData)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = null
        }
    },

    delMyProfile: async ctx => {
        // 判断文件是否存在再删除
        const deleteRecursive = (url) => {
            // 判断给定的路径是否存在
            if (fs.existsSync(url)) {
                fs.unlinkSync(url);
            } else {
                ctx.body = '给定的路径不存在，请给出正确的路径'
                console.log('给定的路径不存在，请给出正确的路径');
            }
        };

        let postData = ctx.request.body
        const dir = path.join(__dirname, "../../static" + postData.path);
        deleteRecursive(dir)

        const result = await initSequelize.videoModelM.delMyProfile(postData.id)

        if (result) {
            ctx.body = '删除成功!'
        } else {
            ctx.body = '删除失败!'
        }
    },

    updateMyProfile: async ctx => {
        let postData = ctx.request.body
        const params = {
            msgid: postData.msgid,
            msg: postData.msg
        }
        const result = await initSequelize.videoModelM.updateMyProfile(params)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = '获取失败'
        }
    }

}


module.exports = {
    UploadFile
};
