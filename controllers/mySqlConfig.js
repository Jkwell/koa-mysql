var mysql = require('mysql');
var config = require('./defaultConfig');

// 创建线程
var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    port: config.database.PORT
})

// 统一数据库的方法
let allService = {
    query: function(sql, values) {
       return new Promise((resolve, reject) => {
           pool.getConnection(function (err, connection) {
               if (err) {
                   reject(err)
               } else {
                   connection.query(sql, values, (err, rows) => {
                       if (err) {
                            reject(err)
                       } else {
                           resolve(rows)
                       }
                       connection.release()
                   })
               }
           })
       }) 
    }
}

let getAllUsers = function() {
    let _sql = 'select * from users;'
    return allService.query(_sql)
}

// 注册用户
let insertUser = function(value) {
    console.log(value)
    let _sql = `insert into users set username=?,userpwd=?,nickname=?`;
    return allService.query(_sql, value)
}
// 查找用户
let findUser = function(username) {
    let _sql = `select * from users where username = "${username}";`
    return allService.query(_sql)
}
// 用户登录
let userLogin = function(username, userpwd) {
    let _sql = `select * from users where username="${username}" and userpwd="${userpwd}";`
    return allService.query(_sql)
}

// 笔记列表
let findNoteListByType = function(note_type) {
    let _sql = `select * from note where note_type="${note_type}" order by id desc;`
    return allService.query(_sql)
}

let findNoteDetailById = function(note_id) {
    let _sql = `select * from note where id="${note_id}";`
    return allService.query(_sql)
}

let insertNote = function(options){
    let _sql = `insert into note set 
          c_time=?,m_time=?,note_content=?,
          head_img=?,title=?,note_type=?,useId=?,nickname=?;`
    return allService.query(_sql,options); 
}
module.exports = {getAllUsers,insertNote, insertUser, findUser, userLogin, findNoteListByType, findNoteDetailById}