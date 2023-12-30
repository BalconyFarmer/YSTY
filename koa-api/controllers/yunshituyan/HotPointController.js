const {initSequelize, sessionApp} = require('../../app');
const koaBody = require('koa-body')
const Minio = require('minio');
const fs = require('fs');
const config = {
    url: '47.108.186.214',
    port: 9000,
    buckets: 'yunshituyan'
}

const HotPointController = {

    getHotById: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.hotPointModel.getHotById(postData)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = null
        }
    },

    addHot: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.hotPointModel.addHot(postData)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = null
        }
    },

    updateHot: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.hotPointModel.updateHot(postData)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = null
        }
    },

    deleteHot: async ctx => {
        let postData = ctx.request.body
        const result = await initSequelize.hotPointModel.deleteHot(postData)
        if (result) {
            ctx.body = result
        } else {
            ctx.body = null
        }
    },

    uploadHeadMinioBefore: koaBody({
        multipart: true,
        formidable: {
            maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
        }
    }),
    uploadHeadMinio: async ctx => {
        // 创建一个 Minio 客户端
        const minioClient = new Minio.Client({
            endPoint: config.url,
            port: config.port,
            useSSL: false,
            accessKey: 'minioadmin123',
            secretKey: 'minioadmin123'
        });
        const file = ctx.request.files.file; // 获取上传文件
        const reader = fs.createReadStream(file.path); // 创建可读流
        const fileName = Date.now() + '-' + file.name;
        const size = fs.statSync(file.path).size;

        try {
            const etag = await minioClient.putObject(
                config.buckets,
                fileName,
                reader,
                // size,
                // {contentType: file.type}
            );
            console.log('File uploaded successfully. Etag:', etag);
        } catch (err) {
            console.log(err);
        }

        ctx.body = {
            filename: 'http://' + config.url + ':' + config.port + '/' + config.buckets + '/' + fileName // 返回文件名
        };

    }


}


module.exports = {
    HotPointController
};
