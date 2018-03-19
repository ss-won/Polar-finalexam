/* app을 구동하기 위한 config 
   - 익스프레스 설정
*/

/* 필요 모듈 참조 */
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');

console.log('call : express.js');

/* index.js 파일에서 "app"을 인자로 받음 */
module.exports = function (app) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

    //Resource 용으로 사용할 static router 정의
	app.use(express.static('public')); 

    // 뷰 템플릿 엔진 및 옵션 설정(뷰 템플릿으로 사용할 핸들바 옵션 설정)
	app.engine('.hbs', exphbs({
		extname: '.hbs',
		partialsDir: __dirname + '/../app/views/partials',//파셜 파일 경로
		defaultLayout: __dirname + '/../app/views/layouts/default.hbs',//디펄트 레이아웃
		layoutsDir: __dirname + '/../app/views/layouts'//레이아웃 파일 경로
	})); //사용할 뷰 엔진의 option 설정

     //뷰 템플릿 정의
	app.set('view engine', '.hbs'); //사용할 뷰 엔진을 정의
	app.set('views',path.join(__dirname,'/../app/views')); //뷰가 있는 디렉토리를 정의

};