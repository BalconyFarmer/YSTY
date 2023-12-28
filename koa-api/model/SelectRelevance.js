/**
 * 多表联查
 * 官网
 * https://www.sequelize.cn/core-concepts/assocs#%E5%AE%9A%E4%B9%89-sequelize-%E5%85%B3%E8%81%94
 *
 * demo
 * https://www.jianshu.com/p/bf5399fd1b69
 */


function test() {

    // 一对一
/*
    // hasOne 谁拥有一个谁 / 一个人拥有一本书
    User.hasOne(Book, {
        foreignKey: 'uId',
        sourceKey: 'id'
    });

    // belongsTo 谁属于一个谁 / 一本书属于一个人
    Book.belongsTo(User, {
        foreignKey: 'uId',
        sourceKey: 'id'
    });

    let book = await Book.findOne({
        where: {
            id: 1
        },
        include: {
            model: User
        }
    });
*/

    // 一对多
/*
    A.hasMany(B, { /!* 参数 *!/ });
    A.belongsToMany(B, { through: 'C', /!* 参数 *!/ });

    let data = await A.findAll({
        where: {
            id: 1
        },
        include: {
            model: B
        }
    })
*/

}
