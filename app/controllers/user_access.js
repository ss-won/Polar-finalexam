
/* mongoose 모듈 참조 */
const mongoose = require('mongoose');
//mongoose.Promise = Promise;

/* Model 불러오기*/
let Userphoto = mongoose.model('Userphoto');
let User = mongoose.model('User');
let only = require('only');//object중 원하는 데이터만 sorting하여 리턴하는 helper 모듈

console.log('call : user_access.js');

// 사진첩 리스트를 보여줌
exports.index = function (req, res) {
    
        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('others/index', {login_success:false, user:req.user});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('others/index', {login_success:true, user:req.user});
        }

   // Userphoto.list(function (Userphoto) {
        //res.render('others/index', {//뷰 템플릿 랜더링(템플릿:index.hbs)
           // Userphoto: Userphoto,//students 객체를 템플릿에 바인딩
        //});
        //});

};


//개별 사용자에 대한 정보를 view를 통해 출력
exports.show = function (req, res) {

    Userphoto.load(req.params.id, function (Userphoto) {
        res.render('others/show', {//뷰 템플릿 랜더링(템플릿:show.hbs)
            Userphoto: Userphoto//student 객체를 템플릿에 바인딩
        });
    });

};

//로그인을 위한 form을 view를 통해 파싱
exports.signin = function(req,res){
    res.render('others/signin',{error: req.flash('error') ,login_success:false});
}

//회원가입을 위한 form을 view를 통해 파싱
exports.register = function(req,res){
    res.render('others/register',{error: req.flash('error'),login_success:false});
}

