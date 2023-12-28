const {Sequelize, Model, DataTypes} = require('sequelize')

class NormalUsersM {
    constructor(sequelize) {
        // 定义用户模型
        this.UserModel = sequelize.define('APInormalusers', {
            id: {
                type: DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING,
            password: DataTypes.STRING,
            headIcon: DataTypes.STRING
        }, {
            timestamps: false // 开启/关闭事件戳
        })
    }

    async handleRegist(postData) {
        let result = await this.handleLogin(postData)
        if (result) {
            return null
        } else {
            const result = await this.UserModel.create({
                name: postData.name,
                password: postData.password,
                headIcon: './static/2userStatic/defaultPortrait.png'
            })
            return result
        }
    }

    async handleLogin(postData) {
        const self = this
        const result = await this.UserModel.findAll({
            where: {
                name: postData.name
            }
        })
        if (result[0]) {
            return result[0].dataValues
        } else {
            return
        }
    }

    async getUserById(postData) {
        const self = this
        const result = await this.UserModel.findAll({
            where: {
                id: postData
            }
        })
        if (result[0]) {
            return result[0].dataValues
        } else {
            return
        }
    }

    // 改
    async uploadHead(params) {

        const result = await this.UserModel.update(
            {
                'headIcon': params.videopath
            },
            {
                'where': {'id': params.userid}
            })
        return result
    }
}

module.exports = {
    NormalUsersM
};
