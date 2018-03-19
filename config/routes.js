/* app을 구동하기 위한 라우팅 설정 
   - students.js에서 controller를 가져와서 url 연결
*/

//관련 모듈 참조
const controller = require('../app/controllers/students');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
//const config = require('config');
const bodyParser = require('body-parser');
const fs = require('fs');

console.log('call : routes.js');
/*
// 파일 업로드를 위한 multer 설정
const storage = multer.diskStorage({
	//저장할 폴더
	destination: './public/uploads/',
	//저장할 파일명
	filename: function (req, file, cb) {
*/
		/* ObjectId()는 절대로 중복될 수 없도록 고안된 값(저장시 파일명 중복 방지) 
           - ObjectId로 저장하면 저장 시점의 timeStamp + 프로세스값 + 랜덤숫자로 구성*/
		/*file.uploadedFile = {
			name: mongoose.Types.ObjectId(),
			ext: file.mimetype.split('/')[1]
		};
        //cb(null, 저장파일명)
		cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
	}
});*/

// multer 설정
//const uploads = multer({ storage: storage });
/*aws.config.update({
    signatureVersion: 'v4',
    accessKeyId: 'AKIAJTZTKY24JBBMASOA',
    secretAccessKey: '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',
    region: 'us-east-1'
});
const s3 = new aws.S3();


var upload = multer({
    storage:multerS3({
        s3: s3,
        bucket:'polar-photo',
        ACL:'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function(req,file,cb){
            console.log(file);
            cb(null,req.user._id+'/'+file.originalname);
        }
    })
})*/
var memorystorage = multer.memoryStorage()
var upload = multer({ storage: memorystorage })


// 라우팅 함수 설정(students.js에서 선언한 함수를 가져와서 url 설정)
module.exports = function (app){
    app.use(bodyParser.json());
	app.get('/', controller.index);//전체 유저 리스트를 보여주기 위한 라우팅
    app.get('/polarphoto/:id',controller.polarphoto);
	app.get('/show/:id', controller.show);//개별 사용자에 대한 정보를 view를 통해 출력하기 위한 라우팅
	app.get('/create', controller.create);//사용자 등록을 위한 form을 view를 통해 파싱하는 라우팅
    //파일 저장을 위해  사진 업로드를 처리하는 라우터에 미들웨어를 적용
	//app.post('/store', uploads.any(),controller.store);
    //create view에ㅏ form 데이터를 받아 DB에 저장
	app.get('/edit/:id', controller.edit);//개별 사용자에 대한 정보를 view의 form에 출력하기 위한 라우팅
	//app.post('/update',uploads.any(),controller.update);//edit view의 form 데이터를 받아 업데이트 하기 위한 라우팅
	app.post('/delete', controller.delete);//데이터 삭제를 위한 라우팅
    
    app.get('/signin', controller.signin);//로그인 페이지 라우팅
    app.get('/register', controller.register);//회원가입 페이지 라우팅
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
 app.post('/uploads', upload.array('files'), function (req, res, next) {
  req.files.forEach(function (fileObj, index) {
    //라우터에 Multer 객체를 연결하면 input name이 일치하는 파일 데이터를 자동으로 받아서 req.files를 통해 접근할 수 있게 처리해 줍니다.
    //메모리 버퍼에 저장하는 형태를 선택했으므로 fileObj는 다음과 같은 속성을 갖게 됩니다.
    fileObj.buffer //예) Buffer 객체
    fileObj.originalname //예) abc.jpg
    fileObj.mimetype //예)'image/jpeg'

    //아마존 S3에 저장하려면 먼저 설정을 업데이트합니다.
    aws.config.region = 'us-east-1'; //Seoul
    aws.config.update({
      accessKeyId: 'AKIAJTZTKY24JBBMASOA',
      secretAccessKey: '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'
    });

    var s3_params = {
      Bucket: 'polar-photo',
      Key: req.user._id+'/'+fileObj.originalname,
      ACL: 'public-read',
      ContentType: fileObj.mimetype
    };

    var s3obj = new aws.S3({ params: s3_params });
    s3obj.upload({ Body: fileObj.buffer }).
      on('httpUploadProgress', function (evt) { console.log(evt); }).
      send(function (err, data) {
        //S3 File URL
        var url = data.Location
        //어디에서나 브라우저를 통해 접근할 수 있는 파일 URL을 얻었습니다.
      })
  })
})

    
   
};