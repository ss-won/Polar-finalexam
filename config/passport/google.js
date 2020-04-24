const GoogleStrategy = require('passport-google').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function(app,passport){
    return new GoogleStrategy({
        /*
        clientID : config.google.clientID,
        clientSecret : config.google.clientSecret,
        callbackURL : config.google.callbackURL,
    }, function(accessToken,refreshToken,profile,done){
        console.log('passport의 google 호출됨');
        console.dir(profile._json);
            
            User.findOne({'google.id': profile.id},function(err,user){
                 if(err) return done(err);
            if(!err && user !== null){
                return done(null,user);
            } else{
                 user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: accessToken,
                    provider: 'google',
                    google: profile._json
            });
                user.save(function(err){
                    if(err) console.log(err);
                    else return done(null,user);
                });
            }
            });
            });
    }
                            
                 /*user.save(function(err){
                    if(err) console.log(err);
                    return done(err,profile,{message: '이미 등록된 이메일입니다.'});
                 });
            } else {
                console.log(user);
				return done(err, profile);
			}
        })
            return done(null,profile);
      */
    })
}