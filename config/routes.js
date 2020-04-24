/* app을 구동하기 위한 라우팅 설정 
   - students.js에서 controller를 가져와서 url 연결
*/

//관련 모듈 참조
const c_user = require('../app/controllers/user_access');
const c_photo = require('../app/controllers/uptoS3');
const s3Api = require('./multer');
const aws = require('aws-sdk');
//const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
//const config = require('config');
const bodyParser = require('body-parser');
const fs = require('fs');

console.log('call : routes.js');


// 라우팅 함수 설정(students.js에서 선언한 함수를 가져와서 url 설정)
module.exports = function (app){
    app.use(bodyParser.json());
	app.get('/', c_user.index);//전체 유저 리스트를 보여주기 위한 라우팅
    app.get('/polarphoto/:id',c_photo.polarphoto);
	app.get('/show/:id', c_user.show);//개별 사용자에 대한 정보를 view를 통해 출력하기 위한 라우팅
	app.get('/create', c_photo.create);//사용자 등록을 위한 form을 view를 통해 파싱하는 라우팅
    //파일 저장을 위해  사진 업로드를 처리하는 라우터에 미들웨어를 적용
	//app.post('/store', uploads.any(),c_user.store);
    //create view에ㅏ form 데이터를 받아 DB에 저장
	app.get('/edit/:id', c_photo.edit);//개별 사용자에 대한 정보를 view의 form에 출력하기 위한 라우팅
	//app.post('/update',uploads.any(),c_user.update);//edit view의 form 데이터를 받아 업데이트 하기 위한 라우팅
	app.post('/delete', c_photo.delete);//데이터 삭제를 위한 라우팅
    
    app.get('/signin', c_user.signin);//로그인 페이지 라우팅
    app.get('/register', c_user.register);//회원가입 페이지 라우팅

    app.post('/signin',passport.authenticate('local-signin', {
        successRedirect : '/',
        successFlash: true,
        failureRedirect : '/signin', 
        failureFlash : true 
    }));//로그인 버튼 눌렀을 때 페이지 라우팅
    app.post('/register',passport.authenticate('local-register',{
        successRedirect : '/', 
        failureRedirect : '/register', 
        failureFlash : true 
    }));//회원가입 등록 버튼 눌렀을 때 페이지 라우팅
    app.get('/auth/facebook',passport.authenticate('facebook',{
        scope : 'email' 
    }));//페이스북 로그인 버튼 라우팅
    app.get('/auth/facebook/callback',passport.authenticate('facebook',{
        successRedirect : '/',              
        failureRedirect : '/'
    }));//페이스북 콜백 페이지 라우팅
    app.get('/auth/google',passport.authenticate('google',{
        scope : ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']
    }));//구글 로그인 버튼 라우팅
    app.get('/auth/google/callback',passport.authenticate('google',{
        failureRedirect : '/signin'
    }),function(req,res){
        res.redirect('/');
    })//구글 콜백 페이지 라우팅
    app.get('/signout',function(req,res){
        console.log('/logout 패스 요청됨');
        req.logout();
        res.redirect('/');
    });//로그아웃 라우팅

    //최대 5개까지 업로드할 수 있음
   /* app.post('/upload/:name', s3Api.upload.array('img', 5), function (req, res, next) {
        let imgFile = req.files;
        res.json(imgFile);
    });
   */
    //1개 업로드
    app.post('/upload/:name', s3Api.upload.single('img'), function (req, res, next) {
        let imgFile = req.file;
        res.json(imgFile);
    });

    
   
};