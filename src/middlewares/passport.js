const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const userModel = require('../model/usermodel')


passport.use( "local",new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, done) => {
        try {
            
            let user = await userModel.findOne({ email, isDeleted: false });

            if (!user) {
                return done(null, false, { message: "USER not exist" });
            }
            const validate = await user.checkPassword(password);
            if (!validate)
                return done(null, false, { message: 'Invalid credentails' });
            return done(null, user, { message: "Logging  Successfull" });
        } catch (error) {
            done(error);
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
  
passport.deserializeUser(async function(id, done) {
   try {
    const user = await userModel.findOne({ _id : id, isDeleted : false });
    done(null, user)

   } catch(err) {
       done(err);
   }
});
