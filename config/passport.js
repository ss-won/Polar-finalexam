var local_signin = require('./passport/local_signin');
var local_register = require('./passport/local_register');
var facebook = require('./passport/facebook');
var google = require('./passport/google');

module.exports = function(app,passport){
    console.log('config/passport 호출됨');
    
    //사용자 인증에 성공했을 때 호출
    passport.serializeUser(function(user,done){
        console.log('serializeUser() 호출됨');
        console.dir(user);
        done(null,user);
    });
    
    //사용자 인증 이후 사용자 요청이 있을 때마다 호출
    passport.deserializeUser(function(user,done){
        console.log('deserializeUser() 호출됨');
        console.dir(user);
        done(null,user);
        });
    passport.use('local-signin',local_signin);
    passport.use('local-register',local_register);
    //passport.use('facebook',facebook(app,passport));
    //passport.use('google',google(app,passport));
};