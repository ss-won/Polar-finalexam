/* 기본 모듈 추가 */
var http = require('http'),
  express = require('express'),
  path = require('path');

/* Express의 미들웨어 */
var bodyParser = require('body-parser');
var static = require('serve-static');

var router = express.Router();

//var hostname = '192.168.0.11';
var port = '3000';

var app = express();

// 서버 설정(포트 선택)
app.set('port',process.env.PORT || port);
//body-parser를 이용한 url, json 파일 파싱
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(static(__dirname));


//미들웨어 작동 선언
app.use(function(req,res,next){
    console.log('미들웨어 작동');
    
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.end();
});


//서버 생성
http.createServer(app).listen(port,function(){
    console.log('Express 서버가  %d번 포트에서 시작됨',port);
});
