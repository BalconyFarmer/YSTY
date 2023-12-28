const {app} = require("../app.js")
const {createServer} = require("http");
const {Server} = require("socket.io");

debugger

const runSocket = function () {
    const httpServer = createServer(app.callback());
    //在线用户
    let onlineUsers = {};
    //当前在线人数
    let onlineCount = 0;

    const io = new Server(httpServer, {
        cors: {
            // origin: "http://localhost:8080",
            // credentials: true
        }
    });

    io.on("connection", (socket) => {

        //监听新用户加入
        socket.on('login', function (obj) {
            //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
            socket.name = socket.id;

            //检查在线列表，如果不在里面就加入
            //查询
            if (!onlineUsers.hasOwnProperty(socket.id)) {
                // 添加
                onlineUsers[socket.id] = obj.username;
                //在线人数+1
                onlineCount++;
            }

            //向所有客户端广播用户加入
            io.emit('login', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj});
            console.log(obj.username + '加入了聊天室');
        });

        //监听用户退出
        socket.on('disconnect', function () {
            //将退出的用户从在线列表中删除
            if (onlineUsers.hasOwnProperty(socket.id)) {
                console.log(onlineUsers[socket.id] + '退出了聊天室');
                //删除
                delete onlineUsers[socket.id];
                //在线人数-1
                onlineCount--;

                //向所有客户端广播用户退出
                io.emit('logout', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: "11"});
            }
        });

        //监听用户发布聊天内容
        socket.on('message', function (obj) {
            //向所有客户端广播发布的消息
            io.emit('message', obj);
            // console.log(obj.username + '说：' + obj.content);
        });

        // setInterval(function () {
        //     console.log("在线的用户", onlineUsers, "数量", onlineCount)
        // }, 1000)
    });

    const port = 8085
    console.log("Socket端口监听在:http://localhost:" + port)
    httpServer.listen(port);
}

runSocket()
module.exports = {runSocket}
