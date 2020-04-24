/* 사진 업로드 스키마 선언 */

//strict 모드 선언 : 엄격한 문법 검사 키워드
'use strict';

/* mongoose, Schema 모듈 참조 */
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;


console.log('call : uploads.js');

/* Mongoose의 Schema는 MongoDB에 저장되는 document의 Data 구조 즉 필드 타입에 관한 정보를 
   JSON 형태로 정의한 것으로 RDBMS의 테이블 정의와 유사한 개념
*/
// 스키마 정의
const UploadSchema = new Schema({
	//relatedId: { type : Schema.ObjectId }, 
    //외래키(students 컬렉션 ObjectId ) 형식으로 데이터를 맵핑시킴,
   userid: {type:Schema.ObjectId ,ref:'User'},
   uri: {type: String},
	type: { type : String },
   tags: { type : Array , required:true},
	filename: { type : String },
	size: { type : Number },
	createdAt  : { type : Date, default : Date.now }
});

/* 필수 속성 required validation
   - 스키마 객체의 path 메서드를 호출하여 필수 속성 컬럼을 지정한 후 required() 메서드를 호출하여
    필수 입력 컬럼으로 만든다.
   - 필수 속성을 입력하지 않으면  'Article title cannot be blank'라는 오류 메시지 전달함
*/
UploadSchema.path('userid').required(true, 'Article title cannot be blank');
UploadSchema.path('filename').required(true, 'Article body cannot be blank');
UploadSchema.path('uri').required(true, 'Article body cannot be blank');
UploadSchema.path('size').required(true, 'Article body cannot be blank');


/*   model 생성
   - model() 메소드에 문자열과 schema를 전달하여 model을 생성한다. 
   - model은 보통 대문자로 시작한다.
   - model('collection', 스키마)
   - 모델을 만들면 몽고 DB에 'students'라는 컬렉션이 자동으로 생성됨
     (collection 이름을 자동으로 소문자로 바꾸고 끝에 s를 붙임) 
*/
mongoose.model('Upload', UploadSchema);
