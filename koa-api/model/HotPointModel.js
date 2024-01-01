const {Sequelize, Model, DataTypes} = require('sequelize')

class HotPointModel {
    constructor(sequelize) {
        // 定义用户模型
        this.HotModel = sequelize.define('a_hotPoint', {
                id: {
                    type: DataTypes.INTEGER(), autoIncrement: true, primaryKey: true,
                },
                d3ModelId: DataTypes.STRING,
                hotData: DataTypes.TEXT,
                files: DataTypes.TEXT
            },
            {
                timestamps: false // 开启/关闭事件戳
            }
        )
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

    async addHot(postData) {
        const result = await this.HotModel.create({
            d3ModelId: postData.d3ModelId,
            hotData: postData.hotData,
            files: ''
        })
        return result
    }

    async updateHot(postData) {
        const result = await this.HotModel.update(
            {
                'hotData': postData.hotData
            },
            {
                'where': {d3ModelId: postData.d3ModelId}
            }
        )
        return result
    }

    async deleteHot(postData) {
        const result = await this.HotModel.destroy(
            {
                where: {
                    d3ModelId: postData.d3ModelId
                }
            },
        )
        return result
    }

}

module.exports = {
    HotPointModel: HotPointModel
};
