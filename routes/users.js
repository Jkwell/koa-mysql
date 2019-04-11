const router = require('koa-router')()
const userService = require('../controllers/mySqlConfig')
const utils = require('../controllers/utils');
const MongoService = require('../controllers/user')
// 下面用这两个包来生成时间
const moment = require('moment')
const objectIdToTimeStamp = require('objectid-to-timestamp')
//用于密码加密
const sha1 = require('sha1')
router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

router.get('/all', async(ctx, next) => {
  // await userService.getAllUsers().then((res) => {
  //   console.log('打印结果' + JSON.stringify(res));
  //   ctx.body = res
  // })
  let doc = await MongoService.findAllUsers();
  ctx.body = {
    success: true,
    result: doc
  }
})

router.post('/userRegister', async(ctx, next) => {
  var _username = ctx.request.body.username;
    var _userpwd = ctx.request.body.userpwd;
    var _nickname = ctx.request.body.nickname;
    if(!_username&&!_userpwd&&!_nickname){
        ctx.body = {
            code: "800001",
            message:"用户名密码昵称不能为空"
        }    
        return ;
    }
    let user ={
      username:_username,
      userpwd:sha1(_userpwd),
      nickname:_nickname,
      create_time: moment(objectIdToTimeStamp(user._id)).format('YYYY-MM-DD HH:mm')
  }
  let doc = await MongoService.findUser(user.username)
  if (doc) {
    ctx.status = 200
    ctx.body = {
      success: false
    }
  } else {
    await new Promise((resolve, reject) => {
      user.save((err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
    console.log('注册成功')
    ctx.status = 200
    ctx.body = {
      success: true
    }
  }
  // await userService.findUser(user.username).then(async (res) => {
  //   if (res.length) {
  //     try{
  //       throw Error('用户名已存在')
  //     } catch (error) {
  //       console.log(error)
  //     }
  //     ctx.body = {
  //       code:"800003",
  //       data: "err",
  //       message:"用户名已存在"
  //     }
  //   } else {
  //     await userService.insertUser([user.username,user.userpwd,user.nickname]).then((res) => {
  //       let r = '';
  //       if (res.affectedRows !== 0) {
  //         r = 'ok';
  //         ctx.body = {
  //           code: '800000',
  //           data: r,
  //           message: '注册成功'
  //         }
  //       } else {
  //         r = 'error';
  //         ctx.body = {
  //           code: '800004',
  //           data: r,
  //           message: '注册失败'
  //         }
  //       }
  //     })
  //   }
  // })
})

router.post('/userLogin', async(ctx, next) => {
  var _username = ctx.request.body.username;
  var _userpwd = ctx.request.body.userpwd;
  console.log(_userpwd)
  console.log(_username)
  var password = sha1(_userpwd)
  let doc = await MongoService.findUser(_username)
  if (!doc) {
    console.log('检查用户名不存在')
    ctx.status = 200
    ctx.body = {
      success: false
    }
  } else if (doc.password === password) {
    console.log('密码一致')
    ctx.status = 200
    ctx.body = {
      success: true,
      username: doc.username,
      age: doc.age
    }
  } else {
    console.log('密码错误')
    ctx.status = 200
    ctx.body = {
      success: false
    }
  }
  // await userService.userLogin(_username, _userpwd).then((res) => {
  //   let r = '';
  //   if (res.length) {
  //     r = 'ok';
  //     let result = {
  //       id: res[0].id,
  //       nickname: res[0].nickname,
  //       username: res[0].username
  //     }
  //     ctx.body = {
  //       code: '800000',
  //       data: result,
  //       message: '登录成功'
  //     }
  //   }
  // })
})

// 笔记列表接口
router.post('/findNoteListByType', async(ctx, next) => {
  let note_type = ctx.request.body.note_type;
  console.log(note_type)
  await userService.findNoteListByType(note_type).then(async (res) => {
    let r = '';
    if (res.length) {
      r = 'ok';
      ctx.body = {
        code: '80000',
        data: res,
        message: '查找成功'
      }
    }
  })
})
// 删除某个用户
router.post('/delUser/:id', async(ctx, next) => {
  let id = ctx.request.body.id
  await MongoService.delUser(id)
  ctx.status = 200
  ctx.body = {
    success: '删除成功'
  }
})
// 笔记详情
router.post('/findNoteDetailById', async(ctx, next) => {
  let note_id = ctx.request.body.id;
  await userService.findNoteDetailById(note_id).then(async (res) => {
    let r = '';
    if (res.length) {
      r = 'ok';
      ctx.body = {
        code: '80000',
        data: res,
        message: '查找成功'
      }
    }
  })
})

// 新增笔记
router.post('/insertNote', async(ctx, next) =>{    
  console.log(utils.getNowFormatDate());
  let c_time = utils.getNowFormatDate();
  let m_time = utils.getNowFormatDate();
  let note_content = ctx.request.body.note_content
  let head_img = ctx.request.body.head_img
  let title = ctx.request.body.title
  let note_type = ctx.request.body.note_type
  let userId = ctx.request.body.userId
  console.log(userId)
  let nickname = ctx.request.body.nickname
  await userService.insertNote
  ([c_time,m_time,note_content,head_img,
     title,note_type,userId,nickname]).
  then(async (res)=>{
      let r = '';
      if (res.affectedRows != 0) {
          r = 'ok';
          ctx.body = {
              code:"80000",
              data: r,
              mess:"发表成功"
          }   
      }else{
          r = 'error';
          ctx.body = {
              code:"80004",
              data: r,
              mess:"发表失败"
          }  
      }

  })
})
module.exports = router
