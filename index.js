/* index.html(메인 프로그램) 
- 파일 구조를 전형적인 MVC 패턴에 맞춤
*/

// 필요 모듈 참조
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const fs = require('fs');
// 환경변수 가져오기
require('dotenv').config();

/* 모델 일괄 등록을 위한 모듈 */
const join = require('path').join;//파일 경로 조인
const models = join(__dirname, 'app/models');// 'app/models' 경로 설정

/* 익스프레스 객체 생성 */
const app = express();



/*===========몽고디비연결===========*/
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err)
    console.log(err);
  else
    console.log("MongoDB is now connected");
});
/*=============end=============*/

console.log('call : index.js');

/* models 폴더에 있는 모든 파일을  일괄등록(require) 처리*/
// filter() 메서드 : 조건에 만족하는 요소만 뽑아 새로운 배열 생성
fs.readdirSync(models)
  //.filter(file => ~file.search(/^[^\.].*\.js$/))//정규식 패턴에 일치하는 문자열을 찾아 반환
  .filter(file => file.indexOf('.js'))//".js"을포함하는 파일을 찾으면 truly 값 반환  
  .forEach(file => require(join(models, file)));
/* 간편하게 사용법
   - require('./app/models/student');
   - require('./app/models/uploads');
*/


/* config 폴더에 있는 express와 routes 설정파일 적용 */
require('./config/express')(app);
require('./config/routes')(app);
require('./config/passport')(app,passport);


/* 익스프레스 서버 시작 */
app.listen(process.env.PORT, () => {
	console.log('Sever running on port : %s', process.env.PORT);
});