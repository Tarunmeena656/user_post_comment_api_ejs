const jwt = require('jsonwebtoken');
const userModel = require('../model/usermodel')
const bcrypt = require('bcrypt')

exports.getforgotPage =  (req,res,next) => {
    res.render('pages/forgotpage', {
        error: ""
    });
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email, isDeleted:false });
        
        if(!user) {
            res.render('pages/forgotpage', {
                error: 'user not exist'
            })
        }

        const secret = process.env.forgot_password_secret + user.password;
        const payload = {
            _id: user._id,
            email: user.email
        };

        const token = jwt.sign(payload, secret, { expiresIn: '10m' });

        const link = `http//localhost:4000/forgot-password/${user._id}/${token}`;
        res.render('pages/forgotlink', {
            link,
            _id: user._id,
            token
        })
    } catch (error) {
        next(error)
    }
}



exports.setforgotPassword = async (req, res, next) => {
    try {
        const { id, token } = req.params;

        let user = await userModel.findById(id, {isDeleted: false});
        if (!user) {
            res.render('pages/forgotpage', {
                error: 'user not exist'
            })
        }

        const secret = process.env.forgot_password_secret + user.password;

        const payload = jwt.verify(token, secret);
        if (!payload) {
            res.render('pages/forgotpage', {
                error: 'link wasted'
            })
        }
   

        res.render('pages/setforgotpassword', {
            id :user._id,
            error:""
        })
        

    } catch (error) {
        next(error)
    }
}


exports.changepassword = async (req,res,next) => {
    try {
        const { id } = req.params;
        const { password, confirmPassword } = req.body;

        let user = await userModel.findById(id, {isDeleted: false});
        if (!user) {
            res.render('pages/forgotpage', {
                error: 'user not exist'
            })
        }
         if( password !== confirmPassword) res.render("pages/setforgotpassword" , 
         {
            id : user._id, 
            error : "Password not match"
         })
        await userModel.findByIdAndUpdate(id, {$set: {password: await bcrypt.hash(confirmPassword, 10)}});
        res.redirect('/login');


    } catch (error) {
        next(error)
    }

}
