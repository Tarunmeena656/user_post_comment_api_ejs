
const { Router } = require('express');
const userRouter = require('./user-route');
const postRouter = require('./post-route');
const commentRouter = require('./comment-route');
const { auth } = require('../middlewares/session-checker');
const forgotRouter = require('./forgotPassword');
const indexRouter = Router();

indexRouter.use(forgotRouter)

indexRouter.use(userRouter);

indexRouter.use( auth, postRouter)

indexRouter.use( auth,commentRouter)



module.exports = indexRouter;