const {Sequelize, Model, DataTypes} = require('sequelize')
const {config} = require('../common/config')
const {HotPointModel} = require("./HotPointModel");

/**
 * 数据库操作类
 */
class initSquelize {
    constructor() {
        this.init()
    }

    async init() {
        // 链接数据库
        const sequelize = new Sequelize(config.DATABASE, config.USERNAME, config.PASSWORD, {
            host: config.sqlAdress, dialect: 'mysql', timezone: '+08:00', // 输入正确时间
            dialectOptions: {   // 输出正确时间
                charset: 'utf8mb4', dateStrings: true, typeCast: true
            }, define: {
                freezeTableName: true // 强制表名称等于模型名称,否则表名必须为复数
            }, pool: {
                // 最多有多少个连接
                max: 5, // 最少有多少个连接
                min: 0, // 当前连接多久没有操作就断开
                idle: 10000, // 多久没有获取到连接就断开
                acquire: 30000,
            }
        });

        try {
            await sequelize.authenticate();
            console.log('数据库连接成功');
        } catch (error) {
            console.error('数据库链接失败!!!!:', error);
            await sequelize.authenticate();
        }

        this.hotPointModel = new HotPointModel(sequelize)
    }


}

module.exports = {initSquelize}

