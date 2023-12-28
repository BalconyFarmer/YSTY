const {Sequelize, Model, DataTypes} = require('sequelize')

class VideoModelM {
    constructor(sequelize) {
        // 视频
        this.VideoModel = sequelize.define('APIvideos', {
            videoid: {
                type: DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true,
            },
            userid: DataTypes.INTEGER(),
            videoname: DataTypes.STRING,
            videopath: DataTypes.STRING,
            type: DataTypes.STRING
        }, {
            timestamps: true // 开启/关闭事件戳
        })
    }

    async getMyProfile(postData) {
        const result = await this.VideoModel.findAll({
            where: {
                userid: postData.userid,
                type: postData.type
            }
        })
        if (result) {
            return result
        } else {
            return
        }
    }

    async delMyProfile(msID) {

        const result = await this.VideoModel.destroy({
            where: {
                videoid: msID
            }
        })
        return result
    }


    async updateMyProfile(params) {

        const result = await this.VideoModel.update(
            {
                'videoname': params.msg
            },
            {
                'where': {'videoid': params.msgid}
            })
        return result
    }


    async saveVideo(postData) {
        const result = await this.VideoModel.create({
            userid: postData.userid,
            videoname: postData.videoname,
            videopath: postData.videopath,
            type: postData.type
        })
        return result
    }

    async saveBigImg(postData) {
        const result = await this.VideoModel.create({
            userid: postData.userid,
            videoname: postData.videoname,
            videopath: postData.videopath,
            type: "img"
        })
        return result
    }

    async getVideoList(postData) {
        const result = await this.VideoModel.findAll(
            {
                'order': [['timestamp', 'DESC']],
                limit: postData.limit,
                offset: postData.pageIndex
            }
        )
        return result
    }

    async getVideoListLength() {
        const result = await this.VideoModel.findAndCountAll(
            {
                'order': [['timestamp', 'DESC']],
            }
        )
        return result
    }

}

module.exports = {
    VideoModelM
};
