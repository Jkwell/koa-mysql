const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/User')

let db = mongoose.connection

db.on('error', function() {
    console.log('数据库连接错误')
})

db.on('connected', function() {
    console.log('数据库连接成功')
})

// 声明Schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String }, // 用户名
  password: { type: String }, // 密码
  age: { type: Number }, // 年龄
});

// 根据Schema生成Model
const User = mongoose.model('user', userSchema)

module.exports = User