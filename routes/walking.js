const router = require('koa-router')()
const { awaitWrap } = require('../utils/awaitWrap');

const {
  getList,
  getDetail,
  newWalking,
  updateWalking,
  delWalking,
  addLike,
  cancelLike
} = require('../controller/walking')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/walking')

router.get('/list', async function (ctx, next) {
    const listData = await getList({status: 1})
    ctx.body = new SuccessModel(listData)
})

router.get('/detail', async function (ctx, next) {
    const data = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function (ctx, next) {
  const body = ctx.request.body
  const data = await newWalking(body)
  ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async function (ctx, next) {
    const val = await updateWalking(ctx.query.id, ctx.request.body)
    if (val) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新失败')
    }
})

router.post('/del', loginCheck, async function (ctx, next) {
  const val = await delWalking(ctx.query.id)
  if (val) {
      ctx.body = new SuccessModel()
  } else {
      ctx.body = new ErrorModel('删除失败')
  }
})

// 点赞
router.post('/addLike', async function (ctx, next) {
    const body = ctx.request.body
    const [err, data] = await awaitWrap(addLike(body.id))
        if(data) {
        ctx.body = new SuccessModel(data)
    } else {
        ctx.body = new ErrorModel(err)
    }
  })
router.post('/cancelLike', async function (ctx, next) {
    const body = ctx.request.body
    const [err, data] = await awaitWrap(cancelLike(body.id))
        if(data) {
        ctx.body = new SuccessModel(data)
    } else {
        ctx.body = new ErrorModel(err)
    }
  })

module.exports = router
