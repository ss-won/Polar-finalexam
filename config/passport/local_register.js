var LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, function(req,email,password,done){
    var paramName = req.body.name || req.query.name;
    console.log('passport의 local-signup 호출됨: '+email + ', ' + password + ', ' + paramName);
    
    //User.findOne이 blocking되므로 async방식으로 변경할 수도 있음
    process.nextTick(function(){
        User.findOne({'email':email}, function(err,user){
            //오류 핸들링
            if(err){
                return done(err);
            }
            
            //기존 계정이 있는 경우
            if(user){
                console.log('기존에 계정이 있습니다.');
                return done(null, false, {message: '계정이 이미 있습니다.'});
            } else{
                //모델 인스턴스 객체 만들어 저장
                var user = new User({'email':email,'password':password,'name':paramName});
                user.save(function(err){
                    if(err){throw err;}
                    console.log('사용자 데이터 추가함.');
                    return done(null,user,req.flash('register_success','true'));
                });
            }
        });
       
    });
});