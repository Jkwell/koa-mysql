const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/User')

let db = mongoose.connection

db.on('error', function() {
    console.log('数据库连接错误')
})

db.on('open', function() {
    console.log('数据库连接成功')
})

// 声明Schema
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    create_time: Date
})

// 根据Schema生成Model
const User = mongoose.model('User', userSchema)

module.exports = User