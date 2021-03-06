var express = require('express');
var router = express.Router();

//express内部有个map，对于每一种请求方法(get,post...)都有映射，每个都映射到一个 路由对象的数组

//'*' 是通配符，所以访问任何一个路径
//localhost:3000/ 或 localhost:3000/nopage
//app.get('*',function(req,res,next){}

/* GET home page. */
// app.route方法会返回一个Route实例，它可以继续使用所有的HTTP方法，包括get,post,all,put,delete,head等。
router.get('/', function(req, res, next) {
  //终结一个请求响应周期 res.end || res.render
  //res.render('index', { title: 'Express' });
  res.json({users: {id:1,name:'name'}});
});

module.exports = router;

//
//exports.index=function(req, res) {
//  res.render('index', { title: 'index' });
//};
//
//exports.indexData=function(req, res) {
//  res.json({users: users});
//};
//
//exports.login=function(req,res){
//  res.render('login',{title: '用户登录'});
//};
//exports.doLogin=function(req,res){
//  var user = {
//    username:"admin",
//    password:"admin"
//  }
//  if(req.body.username==user.username && req.body.password==user.password){
//    res.redirect('/home');
//  }
//  res.redirect('/login');
//};
//exports.logout = function(req,res){
//  res.redirect('/');
//};
//exports.home = function(req,res){
//  var user = {
//    username:'admin',
//    password:'admin'
//  }
//  res.render('home',{title:'Home',user:user});
//};