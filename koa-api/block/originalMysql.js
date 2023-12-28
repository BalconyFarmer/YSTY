const mysql2 = require('mysql2')

function getDbConfig() {
    return {
        host: 'localhost', //数据库地址
        port: '3306',//端口
        user: "root", // 用户名
        password: "password", // 密码
        database: 'db_behance', //要连接的数据库
        connectionLimit: 10
    }
}

//   创建连接池
const config11 = getDbConfig()
const promisePool = mysql2.createPool(config11).promise()
const id = '104'

promisePool.query(`select * from fishes where id = ?`, [id]).then((users)=>{
    console.log(users,"++++++++++++++++++++++")
})
