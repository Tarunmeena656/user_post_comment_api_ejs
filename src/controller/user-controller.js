const Joi = require('joi');
const bcrypt = require('bcrypt');
const usermodel = require('../model/usermodel');
const postmodel = require('../model/postmodel');
const commentmodel = require('../model/commentmodel');

exports.startPage = async(req,res,next)=>{
    try {
        res.render('pages/startPage')
        
    } catch (error) {
        next(error)
    }
}

exports.signup = async (req,res,next) => {
    try {
        if(req.session.user) {
            res.redirect('/logout')
        }
        else {
            res.render("pages/signup", {
                isLoggedIn: false,
                error: ""
            });
        }
    } catch (error) {
        next(error)
    }
}


exports.signupProcess = async (req,res,next) => {
    try {
        const { username, email, password } = req.body;
        if(username && email && password) {
            const existingUser = await usermodel.findOne({email, isDeleted:false}).lean();
        
            if(!existingUser) {

                const schema = Joi.object({
                   username : Joi.string().min(3).max(20).trim().required(),
                   email: Joi.string().min(7).max(45).trim().required().lowercase().email(),
                   password: Joi.string().min(4).max(10).trim().required(),
                   
                 });
                const result = schema.validate(req.body);
                if (result.error) 
                 return res.render('pages/signup', { error: result.error.details[0].message , isLoggedIn : false });

                const newUser = await usermodel.create(req.body);
                res.redirect('/home');
            } else {
                res.render("pages/signup", {
                    error: "User Already exist",
                    isLoggedIn: false
                } )
            }
        }
        else {
            res.render("pages/signup", {
                isLoggedIn: false,
                error: "please enter all the field"
            });
        }
    } catch (error) {
        next(error)
    }
}


exports.homePage = async (req,res,next) => {
    try {
        if(req.session.user) {
            const user = await usermodel.findById(req.session.user).lean();
            res.render("pages/home", {
                username: user.username,
                isLoggedIn: true
            })
        } else {
            res.redirect('/login');
        }
        
    } catch (error) {
        next(error)
    }
}

exports.login = async (req,res,next) => {
    try {
        if(req.session.user) {
            res.redirect('/logout');
        } else {
            res.render('pages/login', {
                error: "",
                isLoggedIn: false
            })
        }
        
    } catch (error) {
        next(error)
    }
}


exports.loginprocess = async (req,res,next) => {
    try {
            req.session.user = req.user._id;
            req.session.role = req.user.role;
            res.locals.session = req.session;
             res.redirect('/homepage');

     
    } catch (error) {
        next(error)
    }
}


exports.logout = async (req,res,next) => {
    req.session.destroy();
    res.redirect('/login');
}


exports.profile = async (req,res,next)  => {
    const user = await usermodel.findOne({_id : req.session.user , isDeleted : false});
    const posts = await postmodel.find({ postBy:req.session.user , isDeleted:false});
    res.render('pages/profile' , {
        user,
        posts
    })
}



exports.editUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await usermodel.findById(id, { isDeleted: false });

        res.render('pages/UserEdit', {
            user
        });
    } catch (error) {
        next(error)
    }
}


exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, email  } = req.body;
        const user = await usermodel.findByIdAndUpdate(id, {email},{username});
        console.log(user)
        res.redirect('/allpost');
    } catch (error) {
        next(error)
    }
}


exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await usermodel.findOneAndUpdate({_id :id , isDeleted : false},{ $set : { isDeleted : true}});
        await postmodel.updateMany({ postBy: id, isDeleted: false }, { $set: { isDeleted: true } });
        await commentmodel.updateMany({ commentBy:id, isDeleted: false }, { $set: { isDeleted: true } });
        res.redirect('/signup');
   
    } catch (error) {
        next(error)
    }
}


exports.getchangePassword = async( req,res,next) => {
    try {
        const user = await usermodel.findOne({_id : req.session.user , isDeleted : false});
        res.render('pages/changePasssword' ,{
            user,
            error:""
        })
    } catch (error) {
        next(error)
    }
}



exports.changePassword = async(req,res) => {
    const {oldpassword,changepassword} = req.body;
    const users = await usermodel.findOne({_id : req.session.user , isDeleted : false});
    const check = await bcrypt.compare(oldpassword , users.password)
    if(!check) return res.render('pages/changePasssword',{ user:users,error:"Password not match"})
    const chngPassword =await bcrypt.hash(changepassword , 10);
    const user = await usermodel.findByIdAndUpdate(req.session.user , { $set:{password :chngPassword }} );
    res.redirect('/profile')
}




