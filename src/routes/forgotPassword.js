const { Router } = require('express');
const { auth } = require('../middlewares/session-checker');
const { getforgotPage, forgotPassword, setforgotPassword,changepassword1 } = require('../controller/auth.controller');
const { changePassword } = require('../controller/user-controller');


const forgotRouter = Router();


forgotRouter.get('/forgotPage', getforgotPage);

forgotRouter.post('/forgotpassword', forgotPassword);

forgotRouter.get('/forgot-password/:id/:token', setforgotPassword);

forgotRouter.post('/forgot-password/:id',changepassword1);

module.exports = forgotRouter;
