# 초기설정


## 들어가기에 앞서
위 예제에서는 되도록 로직의 움직임을 한눈에 보고 이해할 수 있도록 callback이 많이 쓰였습니다. 하지만 비동기 프로그래밍의특성상 콜백을 많이 쓸 수 밖에 없고 콜백을 많이 쓰다보면 가독성이 떨어지는 문제점이 많이 발생하게 되는데 이를 방지하기위해 async-yeild 패턴을 사용하거나 async 패키지를 사용합니다.


## 사용되는 패키지


- body-parser
- express
- express-handlebars - view tempalte
- mongoose
- multer - express에서 제공하는 파일 업로드용 미들웨어
- nodemon - 파일의 변경이 일어날 경우 자동으로 재시작하는 패키지
- only - object중 원하는 데이터만 sorting하여 return하는 helper 패키지
- path


## 파일구조
```

├── app
│   ├── controllers
│   ├── models
│   ├── utils
│   └── views
├── config
│   ├── express.js
│   └── routes.js
├── index.js
├── package.json
├── public
│   ├── assets
│   └── uploads
└── index.js

```

파일 구조의 경우 전형적인 MVC 패턴을 따르고 있습니다.


```js
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

/* 모델 일괄 등록을 위한 모듈 */
const join = require('path').join;
const models = join(__dirname, 'app/models');

const app = express();
/* 몽고디비연결 */
mongoose.connect('mongodb://localhost:27017/mobileapp');


//models 일괄등록을 위해 model에 있는 모든파일을 require시킵니다
//간편하게 require('../app/models/student')를 사용하여도 무관합니다.
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));




//아래와 같이 분기를 하는 이유는 코드의 분기처리와
// dev버전과 product 버전의 configure 파일을 다르게 require 하기위함입니다.
require('./config/express')(app); //express 설정 적용
require('./config/routes')(app);  // route 설정파일 적용


app.listen(3000, () => {
	console.log('running on port 3000');
});
```


## configure 파일
```js
const express = require('express');

//view tempalte
const exphbs = require('express-handlebars');
const path = require('path');

//body-parser는 request에서의 body 안의 text들을 nodejs가 읽어들일 수 있는
//json과 같은형태로 바꾸어줍니다.
const bodyParser = require('body-parser');

//index.js 파일에서의 const app = express()를 인자로 받습니다.
module.exports = function (app) {

  //import한 bodyParser 미들웨어를 json 형태로 인자를 받기위해 적용시켜줍니다.
	app.use(bodyParser.json()); //
	app.use(bodyParser.urlencoded({
		extended: true
	}));


	app.use(express.static('public'));


  //view template으로 사용한 handlebar를 위해 사용하는 옵션내용입니다.
  //아래부분에서 한번 더 설명토록 하겠습니다.
	app.engine('.hbs', exphbs({
		extname: '.hbs',
		partialsDir: __dirname + '/../app/views/partials',
		defaultLayout: __dirname + '/../app/views/layouts/default.hbs',
		layoutsDir: __dirname + '/../app/views/layouts'
	}));


  //뷰 템플릿을 정의하여줍니다.
	app.set('view engine', '.hbs');

	//view가 있는 곳을 정의하여줍니다.
	app.set('views',path.join(__dirname,'/../app/views'));

};
```


## route.js 파일
```js
const students = require('../app/controllers/students'); //컨트롤러를 가져옵니다.
const multer = require('multer'); //파일 업로드응 위한 미들웨어
const path = require('path');
const mongoose = require('mongoose');


//multer는 express에서 제공하는 file upload를 위한 미들웨어입니다.
const storage = multer.diskStorage({
	//파일을 저장할 폴더
	destination: './public/uploads/',
	//저장할 파일명입니다.
	filename: function (req, file, cb) {

		//이름을 ObjectId로 지정하는 이유는 파일이름으로 지정할경우 1.jpg,2.jpg등과 같이
		//중복되는 파일명이 생길 수 있어 이러한 중복을 피하기위해 objectId로 넣어줍니다.
		//objectId의 경우 저장할 시점의 timeStamp + 프로세스번호 + 랜덤숫자로 이루어지기에
		//중복이 될 가능성이 거의 없습니다.

		file.uploadedFile = {
			name: mongoose.Types.ObjectId(),
			ext: file.mimetype.split('/')[1]
		};
		//콜백의 첫번째 인자는 해당 파일을 업로드한 후 사용할 function등을 넣어주며
		//두번째 인자의 경우는 저장할 파일명입니다.
		cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);

	}
});


const uploads = multer({ storage: storage });

module.exports = function (app){


	app.get('/', students.index);
	app.get('/show/:id', students.show);
	app.get('/create', students.create);
	//파일 저장을 위해 사진 업로드를 처리하는 route에 middleware로 적용합니다.
	app.post('/store', uploads.any(),students.store);
	app.get('/edit/:id', students.edit);
	app.post('/update',students.update);
	app.post('/delete', students.delete);

};
```


### route 형식

| url명   |      method      |  역활 |
|----------|:-------------:|------:|
| / |  index | 전체 유저 리스트를 보여줍니다. |
| /show/{id} |    get   |   개별 사용자에 대한 정보를 view를 통해 출력합니다. |
| /create/ |    get   |   사용자 등록을 위한 form을  view를 통해 파싱합니다.|
| /store/ |   post   |   create view에서 폼데이터를 받아 데이터베이스에 저장합니다.|
| /edit/{id} |   get   |   개별 사용자에 대한 정보를 view의 form에 출력해줍니다.|
| /update |   post   |   edit view의 form데이터를 받아 기존 데이터를 업데이트 합니다.|
| /delete |   post   |   데이터 삭제에 대한 정보를 받아 삭제합니다.|

위 예제에서는 edit과 delete를 전부  post method로 정의하였으나 method등이 중복되는 경우에는 되도록 수정할땐 PUT method를 삭제할땐 DELETE method를 사용하여 분기합니다.


# model

## students.js

```js
'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const Schema   = require('mongoose').Schema;



const StudentSchema = new Schema({
	name: {type: String, default: '', trim: true},
	stdId: {type: String, default: '', trim: true},
	age: {type: Number},
	//ref를 선언하는것은 RDB에서의 외부키를 선언하는내용과 비슷합니다.
	photo: { type : Schema.ObjectId, ref: 'Upload'},
	createdAt: {type: Date, default: Date.now}
});

//method의 경우는 'this' 키워드를 사용하여 개별 데이터를 다룰때 사용하며
//statics는 전역으로 사용하는 내용을 다룹니다.
StudentSchema.statics = {


  //개별 id값을 조회하는 내용입니다.
	load: function (_id, cb) {
		this.findOne({_id})
		    .populate('photo')
		    .exec(function (err, student) {
			    cb(student)
		    });
	},

  //전체 리스트를 생성일 순으로 조회합니다.
	list: function (cb) {
		this.find({}).sort({createdAt: -1}).exec(function (err, students) {
			cb(students)
		});
	},
}


StudentSchema.path('name').required(true, '이름을 필수사항입니다');
StudentSchema.path('stdId').required(true, '학생번호는 필수사항입니다');
StudentSchema.path('age').required(true, '나이는 필수사항입니다.');

mongoose.model('Student', StudentSchema);

```


## upload.js

업로드 스키마를 따로 만드는 이유는 multer의 경우 미들웨어를 통해 사진을 먼저 업로드시키며 리턴값을 반환합니다. 또한 dropbox와 같은 이미지 ajax 업로드 플러그인을 사용할 경우에는 사진의 업로드가 먼저 이루어지게됩니다. 이 경우 사용자가 자신의 데이터를 삭제한 이후거나 회원등록을 하는 중간에 중단된경우 이미지가 계속 서버에 남아있어 서버의 불필요한 용량이 많아지는 현상이 생깁니다.

이를 피하기 위해 uploads를 통해 전체 등록되어있는 이미지를 저장하며 주기적으로 crontab을 통해 전체 업로드 폴더중 uploads 테이블에 들어있지 않은(등록되지 않은 필요없는) 데이터를 삭제하여줍니다. 또한 uploads 폴더를 통해 초기 사용자가 저장했던 파일명 타입등을 저장하여줍니다.


```js
'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;


//relatedId와 type을 구지 스키마에 넣어주는 이유는 만약 회원스키마와 게시판스키마가 있고
//회원사진 업로드와 게시판사진이 업로드 되는 경우에도 업로드스키마는 하나를
//사용하게됩니다. 이 경우 relatedId의 경우 게시판id나 회원id를 넣어주고
//type을 통해 현재 id값이 게시판 스키마에대한 id인지 회원 스키마에 대한 id인지
//확인할 수 있습니다.
const UploadSchema = new Schema({

	relatedId: { type : Schema.ObjectId}, //외래키 형식으로 데이터를 맵핑시킴
	type: { type : String},
	filename: { type : String},
	originalname: { type : String},
	size: { type : Number},
	createdAt  : { type : Date, default : Date.now }
});



UploadSchema.path('relatedId').required(true, 'Article title cannot be blank');
UploadSchema.path('filename').required(true, 'Article body cannot be blank');
UploadSchema.path('originalname').required(true, 'Article body cannot be blank');
UploadSchema.path('size').required(true, 'Article body cannot be blank');

mongoose.model('Upload', UploadSchema);
```




# controller
```js
/* Model 불러오기*/
const mongoose   = require('mongoose');
//mongoose.Promise = Promise;

const Student = mongoose.model('Student');
const Upload  = mongoose.model('Upload');
const only    = require('only');

exports.index = function (req, res) {

  //Student 스키마의 statics로 정의된 내용을 호출하며
  //전체 리스트를 가져옵니다.



	Student.list(function(students){

	 //render의 경우 사용하고자 하는
	 //view tempalte 의 위치를 인자로 받으며
	 //config/express.js 파일에서 정의된
  //app.set('views',path.join(__dirname,'/../app/views')) view 디렉토리를
  //기준으로 하위 내용을 가져오게 됩나다.
  //두번째는 view temaplte에 전해줄 데이터값을 인자로 받습니다.
		res.render('students/index',{
			students:students
		});
	});

};

exports.show = function(req,res){

	Student.load(req.params.id,function(student){
		res.render('students/show',{
			student:student
		});
	});

};

exports.create = function (req, res) {

	res.render('students/create');
};

exports.store = function (req, res) {

  //onlt를 사용할경우 body 오브젝트중 인자로 받는 name,StdId,age만 return하여줍니다.
	const student = new Student(only(req.body, 'name stdId age'));

	student.save(function (err, result) {
		if (err) throw new Error(err);

		/* 저장파일이 있는경우 한번 더 분기 파일은 배열로 형태로 받아지지만 무조건 하나이므로 0으로 처리*/
		if (req.files.length > 0) {

			console.log("파일있음");

			/* 전체파일 체크 */
			req.files.forEach(function (file) {
				const upload = new Upload({
					relatedId: result,
					type: "student",
					filename: file.filename,
					originalname: file.originalname,
					type: file.mimetype,
					size: file.size,
				});

				//연결되어있는 내용에 한번 더 저장
				upload.save(function(err,result){
					student.photo = result;
					student.save();
				});

			});


		}
		res.redirect('/');

	});
};


exports.edit = function (req, res) {
	Student.load(req.params.id,function(student){
		res.render('students/edit',{
			student:student
		});
	});
};

exports.update = function (req, res) {

	console.log(req.body)


	Student.load(req.body.id,function(student){



		student.name = req.body.name;
		student.stdId = req.body.stdId;
		student.age =  req.body.age;
		student.save(function(err,result){
			res.redirect('/');
		})
	});

};

exports.delete = function (req, res) {

	Student.remove({
		_id: req.body.id
	}, function(err, result) {
		if (err) return res.send(err);
		res.sendStatus(200)
	});


};

```


#view의 구조
```js
res.render('students/edit',{
			student:student
		});
```

위와같이 선언한 경우 students에 있는 edit.hbs를 출력하게 되는데
그냥 출력하는것이 아니라 layouts에 있는 default.hbs와 조합하여 출력하게됩니다.

edit.hbs에 있는 코드를 body에 넣어 출력하게됩니다.


```js

//layouts.default.hbs파일
//상단 내용 생략
<div style="margin-top: 100px;" class="container">
{{{body}}}
</div>
//하단 내용 생략
```













