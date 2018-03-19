/* 데이터베이스 스키마를 정의하는 모듈
  - 스키마 객체(UserSchema)를 만들어 호출한 곳으로 반환
*/

// 비밀번호 암호화를 위한 crypto 모듈 불러들이기
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

console.log('call : user.js');
    
	// 스키마 정의
	const UserSchema = new Schema({
        relatedId: { type : Schema.ObjectId },
	    email: {type: String, required: true, unique: true, 'default':''},//아이디
	    hashed_password: {type: String, 'default':''},//암호화된 비밀번호
	    salt: {type:String},//암호화에 사용되는 salt값(암호화 키값)	    
	    created_at: {type: Date, index: {unique: false}, 'default': Date.now},//작성일
	    updated_at: {type: Date, index: {unique: false}, 'default': Date.now},//수정일
        name: {type: String},//이름
        provider: {type: String, 'default':''},
        authToken: {type: String, 'default':''},
        facebook: {},
        google: {}
	});
	
	/*  password를 virtual 메소드(가상 속성)로 정의 
        - MongoDB에 저장되지 않는 편리한 속성임. 특정 속성을 지정하고 set, get 메소드를 정의함
    */
	UserSchema
	  .virtual('password')//스키마에 password라는 가상속성 설정
	  .set(function(password) {//입력한 비밀번호를 암호화하여 hashed_password에 저장
	    this._password = password;
	    this.salt = this.makeSalt();
	    this.hashed_password = this.encryptPassword(password);
	    console.log('virtual password 호출됨 : ' + this.hashed_password);
	  })
	  .get(function() { return this._password });
	
	// 스키마에 모델 인스턴스에서 사용할 수 있는 메소드 추가
	// 비밀번호 암호화 메소드
	UserSchema.method('encryptPassword', function(plainText, inSalt) {
		if (inSalt) {
			return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
		} else {
			return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
		}
	});
	
	// salt 값 만들기 메소드
	UserSchema.method('makeSalt', function() {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	});
	
	// 인증 메소드 - 입력된 비밀번호와 비교 (true/false 리턴)
	UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
		if (inSalt) {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
			return this.encryptPassword(plainText, inSalt) === hashed_password;
		} else {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
			return this.encryptPassword(plainText) === this.hashed_password;
		}
	});
	
	// 값이 유효한지 확인하는 함수 정의
	var validatePresenceOf = function(value) {
		return value && value.length;
	};
		
	// 저장 시의 트리거 함수 정의 (password 필드가 유효하지 않으면 에러 발생)
	UserSchema.pre('save', function(next) {
		if (!this.isNew) return next();
	
		if (!validatePresenceOf(this.password)) {
			next(new Error('유효하지 않은 password 필드입니다.'));
		} else {
			next();
		}
	})
	
	// 필수 속성에 대한 유효성 확인 (길이값 체크), 입력된 칼럼 값이 있는지 확인
	UserSchema.path('email').validate(function (email) {
		return email.length;
	}, 'email 칼럼의 값이 없습니다.');
	
	UserSchema.path('name').validate(function (name) {
		return name.length;
	}, 'name 칼럼의 값이 없습니다.');
	
	UserSchema.path('hashed_password').validate(function (hashed_password) {
		return hashed_password.length;
	}, 'hashed_password 칼럼의 값이 없습니다.');
		   
	// 스키마에 static 메소드 추가
	UserSchema.static('findByEmail', function(email, callback) {
		return this.find({email:email}, callback);
	});
	
	UserSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});

    UserSchema.static('load', function(_id,callback){
        this.findOne({_id})
		    .populate('photo')
		    .exec(function (err, userphotos) {
			    callback(userphotos)
		    });
    });
	

mongoose.model('User', UserSchema);
// module.exports에 UserSchema 객체 직접 할당
module.exports = UserSchema;