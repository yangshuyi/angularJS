//Step1: 导入相关模块
//Step1.1: 模块依赖库
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
var fs = require('fs');
//Step1.2: 加载路由
var index = require('./routes/index');
var users = require('./routes/users');


//Step1.3: 创建项目实例
//在express内部，有一个函数的数组，暂时叫这个数组tasks，每来一个请求express内部会依次执行这个数组中的函数
//function(req,res，next){//...}
//next，是指下一个函数
var app = express();

//Step2: 执行过 var app = express() 后

//Step2.1: 使用app.set 设置express内部的一些参数（options）
// 环境变量
// view engine setup
// 定义模板引擎和模板文件位置 Jade EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Step2.2: 使用app.use 来注册函数，可以简单的认为是向那个（被我叫做）tasks的数组进行push操作
//app.use 加载用于处理http請求的middleware（中间件），当一个请求来的时候，会依次被这些 middlewares处理。
//执行的顺序是你定义的顺序
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // 定义icon图标
app.use(logger('dev')); //定义日志和输出级别
app.use(bodyParser.json()); // 定义数据解析器
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser()); //定义cookie解析器 用法：在请求的req里获取cookies：JSON.stringify(req.cookies);

app.use(function (req, res, next) {
    console.log("111");
    //数据库连接Filter
    //mysql.createClient('localhost:3306', function (err, db) {
    //    if (err) return next(err);
    //    req.db = db;
    //    next();
    //})

    //结束一个请求响应的生命周期( 比如写下res.end('...') )

    next();
})
app.use(function (req, res, next) {
    //authentication
    console.log("authentication");
    if (!req.session.user) {
        req.session.error = '请先登陆';
        return res.redirect('/');
    }
    next();
})

//因为路由后或请求静态资源后，一次请求响应的生命周期实质上已经结束，加在这后面进行请求处理，没有任何意义。

//路由处理 - app.use(app.router);
//express内部有个map，对于每一种请求方法(get,post...)都有映射，每个都映射到一个 路由对象的数组
app.use('/', index);
app.use('/users', users);

app.use('/module1', require('./routes/module1.js'));
app.use('/module2', require('./routes/module2.js'));
app.use('/module3', require('./routes/module3.js'));


//处理静态资源
app.use(express.static(path.join(__dirname, 'public')));



// 通用error处理
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// 开发模式
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


//Step3: 通过http.createServer 用app来处理请求
//由bin/www实现