const {Router} = require('express');
const passport = require('passport');
const userController = require('../controller/user-controller');
const {auth} = require('../middlewares/session-checker')
const userRouter = Router({mergeParams:true});
require('../middlewares/passport')

userRouter.get('/' ,userController.startPage )

userRouter.get('/signup', userController.signup);

userRouter.post('/signup', userController.signupProcess);

userRouter.get('/homepage',auth, userController.homePage);

userRouter.get('/login', userController.login);

userRouter.post('/login',passport.authenticate('local', {failureRedirect:'/login ', failureFlash: "Invalid credential"  }), userController.loginprocess);

userRouter.get('/logout',auth, userController.logout);

userRouter.get('/profile',auth, userController.profile )

userRouter.get('/user/update/:id',auth, userController.editUser);

userRouter.put('/user/update/:id' ,auth, userController.updateUser)

userRouter.get('/user/delete/:id' , userController.deleteUser)

userRouter.get('/user/changePassword/:id',auth, userController.getchangePassword)

userRouter.put('/user/changePassword/:id',auth,userController.changePassword)


module.exports = userRouter;



