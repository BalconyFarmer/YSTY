const {Sequelize, Model, DataTypes} = require('sequelize')

class HotPointModel {
    constructor(sequelize) {
        // 定义用户模型
        this.HotModel = sequelize.define('a_hotPoint', {
            id: {
                type: DataTypes.INTEGER(), autoIncrement: true, primaryKey: true,
            }, d3ModelId: DataTypes.STRING, hotData: DataTypes.TEXT, files: DataTypes.TEXT
        }, {
            timestamps: false // 开启/关闭事件戳
        })
    }

    async getHotById(postData) {
        const self = this
        const result = await this.HotModel.findAll({
            where: {
                d3ModelId: postData.d3ModelId
            }
        })
        if (result[0]) {
            return result[0].dataValues
        } else {
            return null
        }
    }

}

module.exports = {
    HotPointModel: HotPointModel
};
