const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../config');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function(app,passport){
    return new FacebookStrategy({
        clientID : config.facebook.clientID,
        clientSecret : config.facebook.clientSecret,
        callbackURL : config.facebook.callbackURL,
        profileField : ['id','displayName']
    }, function(accessToken,refreshToken,profile,done){
        console.log('passport의 facebook 호출됨');
        console.dir(profile._json);

        User.findOne({'facebook.id' : profile.id},function(err,user){
            if(err) return done(err);
            if(!user){
                var newuser = new User({
                    name: profile.displayName,
                    email: profile.id,
                    password: accessToken,
                    provider: 'facebook',
                    facebook: profile._json
            })
                 newuser.save(function(err){
                    if(err) console.log(err);
                    console.log('newuser 생성');
                    return done(err,user);
                 });
            } else {
                console.log(user);
				return done(err, user);
			}
        })
        /*var options = {
            criteria : {'facebook.id':profile.id}
        };
        
        User.load(options,function(err,user){
            if(err) return done(err);
            if(!user){
                var user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    provider: 'facebook',
                    facebook: profile._json
                });
                
                user.save(function(err){
                    if(err) console.log(err);
                    return done(err,user);
                });
                
            }
        })*/
   
    });
};