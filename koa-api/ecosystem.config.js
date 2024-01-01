module.exports = {
    apps: [{
        name: "Yunshituyan",
        script: "./app.js",
        watch: false, // 默认关闭 false watch 可替换为 ['src'] 启用监视和重启功能，如果文件夹或子文件夹中的文件改变，你的应用程序将重新加载
        ignore_watch: ['node_modules', 'build', 'logs'],
        out_file: './logs/out.log', // 日志输出
        error_file: './logs/error.log', // 错误日志
        max_memory_restart: '2G', // 超过多大内存自动重启，仅防止内存泄露有意义，需要根据自己的业务设置
        exec_mode: 'cluster', // 开启多线程模式，用于负载均衡 fork端口不够 cluster
        instances: '1', // 启用多少个实例，可用于负载均衡
        autorestart: false // 程序崩溃后自动重启
    }]
}

// # Start all applications
// pm2 start ecosystem.config.js
//
// # Stop all
// pm2 stop ecosystem.config.js
//
// # Restart all
// pm2 restart ecosystem.config.js
//
// # Reload all
// pm2 reload ecosystem.config.js
//
// # Delete all
// pm2 delete ecosystem.config.js
// pm2 delete all

// 显示仪表盘
// pm2 monit

// 网页仪表盘
// pm2 plus

// # PM2操作记录
// 博客链接:https://juejin.cn/post/6844903710037016584
// pm2 start <xxx.js>
// pm2 stop <xxx.js>
// pm2 restart <xxx.js>
// 查看进程详情 不要加.js
// pm2 show (xxx)
// 查看所有进程列表
// pm2 list
// 可以使用 pm2 monit 功能监控所有 node 进程的运行情况，包括各种响应，错误信息。
// pm2 monit
// 显示所有进程的日志信息
// pm2 logs
// 删除所有进程/应用 ：pm2 delete all

/*
    lunix自启动
    pm2 save
    pm2 startup
    sudo reboot
*/


/*
## windows设置pm2开机服务 自启动nodejs项目

https://www.cnblogs.com/xusx2014/p/16089510.html

    1、我们一般会把 pm2 安装到全局：

    npm install pm2 -g

2、安装windows自启动包：

    npm install pm2-windows-startup -g

3、创建开机启动脚本文件：

    pm2-startup install  //取消自启动 pm2-startup uninstall

4、使用pm2启用项目：

    pm2 start ./app.js –name fuckk

5、保存pm2中的项目：

    pm2 save
*/
