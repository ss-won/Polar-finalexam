
/* mongoose 모듈 참조 */
const mongoose = require('mongoose');
//mongoose.Promise = Promise;

/* Model 불러오기*/
const Userphoto = mongoose.model('Userphoto');
const Upload = mongoose.model('Upload');
const User = mongoose.model('User');
const only = require('only');//object중 원하는 데이터만 sorting하여 리턴하는 helper 모듈

console.log('call : students.js');

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
//페이지 전환을 위한 form을 view를 통해 파싱
exports.polarphoto = function(req,res){
    Userphoto.load(req.params.id,function(Userphoto){
        res.render('others/polarphoto',{
            Userphoto : Userphoto,login_success:true,user:req.user
        })
    })
};
//사용자 등록을 form을 view를 통해 파싱
exports.create = function (req, res) {
    res.render('others/create');//뷰 템플릿 랜더링(템플릿:create.hbs)
};

exports.uploads = function(req,res){
 
        /* 저장파일이 있는경우 한번 더 분기 파일은 배열로 형태로 받아지지만 무조건 하나이므로 0으로 처리*/
        if (req.files.length > 0) {

            console.log("파일있음");

            /* 전체파일 체크 */
            req.files.forEach(function (file) {
                const upload = new Upload({
                    relatedId: result,
                    userid: req.user._id,
                    rtag: '',
                    tags: req.body.hashtags,
                    filename: file.filename,
                    originalname: file.originalname,
                    type: file.mimetype,
                    size: file.size,
                });

                //데이터베이스에 사진 저장(uploads 컬렉션)
                upload.save(function (err) {
                    if(err) throw err;
                    else return done(null,upload);
                });

            });
        }
       res.render('others/uploads',{Upload:Upload,login_success:true,user:req.user});
}


   
// create.hbs view에서 form 데이터를 받아 데이터베이스에 저장
// <form method="post" action="/store" ....
exports.store = function (req, res) {
    
    // student 객체 생성(create.hbs의 form으로부터 요청 파라미터(name, stdId, age)값을 받아 저리)
    const userphotos = new Userphoto(only(req.body, 'name rtag tags'));

    // 데이터베이스에 저장(students 컬렉션)
    userphotos.save(function (err, result) {

        if (err) {
            /* Client Validation도 무시한 후 데이터가 들어온 경우 400코드 전송*/
            res.sendStatus(400)
        }

        /* 저장파일이 있는경우 한번 더 분기 파일은 배열로 형태로 받아지지만 무조건 하나이므로 0으로 처리*/
        if (req.files.length > 0) {

            console.log("파일있음");

            /* 전체파일 체크 */
            req.files.forEach(function (file) {
                const upload = new Upload({
                    relatedId: result,
                    type: files,
                    rtag: userphotos.rtag,
                    tags: userphotos.tags,
                    filename: file.filename,
                    originalname: file.originalname,
                    type: file.mimetype,
                    size: file.size,
                });

                //데이터베이스에 사진 저장(uploads 컬렉션)
                upload.save(function (err, result) {
                    userphotos.photo = result;
                    userphotos.save();
                });

            });
        }
        res.redirect('/');

    });
};

// 개별 사용자에 대한 정보를 view의 form에 출력
exports.edit = function (req, res) {
    Userphoto.load(req.params.id, function (Userphoto) {
        res.render('others/edit', {//뷰 템플릿 랜더링(템플릿:edit.hbs)
            Userphoto : userphotos//student 객체를 템플릿에 바인딩
        });
    });
};

// edit.hbs view의 form 데이터를 받아 기존 데이터를 업데이트
exports.update = function (req, res) {

    console.log(req.files.length);

     // 데이터베이스에 저장(students 컬렉션)
    Userphoto.load(req.body.id, function (Userphoto) {

        userphotos.name = req.body.name;
        userphotos.tags = req.body.tags;
        userphotos.rtag = req.body.rtag;

        Userphoto.save(function (err, result) {

            if (err) {
                /* Client Validation도 무시한 후 데이터가 들어온 경우 400코드 전송*/
                res.sendStatus(400)
            }

            if (req.files.length > 0) {

                console.log("파일있음");

                /* 전체파일 체크 */
                req.files.forEach(function (file) {
                    const upload = new Upload({
                        relatedId: result,
                        type: "userphoto",
                        rtag: userphotos.rtag,
                        tags: userphotos.tags,
                        filename: file.filename,
                        originalname: file.originalname,
                        type: file.mimetype,
                        size: file.size,
                    });

                    //데이터베이스에 사진 저장(uploads 컬렉션)
                    upload.save(function (err, result) {
                        student.photo = result;
                        student.save();
                    });

                });
            }
            res.redirect('/');
        })
    });
};

// 데이터 삭제에 대한 정보를 받아 삭제
exports.delete = function (req, res) {
    // students 컬렉션에서 해당 documents(레코드) 삭제
    Userphoto.remove({
        _id: req.body.id
    }, function (err, result) {
        if (err) return res.send(err);
        res.sendStatus(200)
    });
};
