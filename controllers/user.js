const User = require('./db')


// 数据库的操作
const findUser = (username) => {
    return new Promise ((resolve, reject) => {
        User.findOne({ 'username':  username}, (err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
}

// 找到所有用户
const findAllUsers = () => {
    return new Promise((resolve, reject) => {
        User.find({}, (err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
}

// 删除某个用户
const delUser = function(id) {
    return new Promise((resolve, reject) => {
        User.findOneAndRemove({_id: id}, err => {
            if (err) {
                reject(err)
            }
            resolve()
        })
    })
}

module.exports = {findUser, findAllUsers, delUser}