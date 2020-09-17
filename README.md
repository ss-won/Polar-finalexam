# 사진업로드 웹어플리케이션
2017년 11-12 : 서버단 폴더에 업로드 기능<br>
2020년 ~ : 구버전 코드 변경, AWS S3에 업로드 하는 것으로 변경, 검색 기능 및 DB 다시 개발중

## OUTPUT

### 화면

<div align="center">
  
##### Main
![](https://media.vlpt.us/images/ss-won/post/a3f7ffac-9825-4480-8e1b-1dec2f3fc3d5/image.png)

</div>

##### Login
<div align="center">

![](https://media.vlpt.us/images/ss-won/post/659a13d0-137d-4098-a99d-ce8099ecb691/image.png)
![](https://media.vlpt.us/images/ss-won/post/87bcd58f-eb13-4c3b-a30e-8989362576ff/image.png)
![](https://media.vlpt.us/images/ss-won/post/e77cdb38-4944-48a2-bf90-b94d0a9b1161/image.png)
![](https://media.vlpt.us/images/ss-won/post/aac18930-27ad-4833-89a6-68fa62c3c816/image.png)

</div>

##### Upload
<div align="center">

![](https://media.vlpt.us/images/ss-won/post/f2345659-641d-4af6-8c6a-d8f528002bcc/image.png)
![](https://media.vlpt.us/images/ss-won/post/3ed5a623-1796-4a56-a7bd-8eb8ec94f318/image.png)
<br>

<img src="https://media.vlpt.us/images/ss-won/post/57cc93ef-5f94-4c0e-add2-a81cd6553ccc/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202020-09-18%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%205.49.13.png" height=280 width=300/>
<img src="https://media.vlpt.us/images/ss-won/post/fbaca468-15dd-4655-9dac-6bfe2bad427f/image.png" height=280 width=300/>

</div>

### 성과
- Node.js(Express) + MongoDB를 이용해 사진 업로드 후 multer-s3에 저장 구현
- Passport 모듈을 이용한 Facebook 사용자 간편로그인 인증(OAuth 2.0) 적용
- 1주일 동안 Bootstrap을 독학하여 UI 구현에 적용

### Dependencies
- dotenv : 환경변수관리를 위한 패키지
- nodemon : 파일의 변경이 일어날 경우 자동으로 재시작하는 패키지(유사품: superviser)
- fs : 파일시스템을 이용하기 위한 기본 모듈(Node)
- path : 경로를 파싱해오는 기본 모듈(Node)
- body-parser : API요청에서 받은 body값을 파싱하는 역할을 수행하는 미들웨어
- express : express를 사용하기 위한 모듈(node.js 서버구축에서 대표적)
- express-handlebars : 뷰엔진(view tempalte)을 사용하기 위한 모듈
- mongoose : MongoDB의 데이터를 ODM(Object Document Mapping)화 시켜주는 모듈로 데이터를 자바스크립트 객체화 시켜준다.
- only : object중 원하는 데이터만 sorting하여 return하는 helper 패키지
- multer : express에서 제공하는 파일 업로드용 미들웨어
- connect-flash : 화면이 전환될때 콘솔창에 메세지를 전달하기 위한 미들웨어
- ctypto : 계정비밀번호 암호화를 위한 모듈
- passport : Node.js의 로그인 기능의 인증을 Stratgy기법으로 간편히 해주는 미들웨어
  - passport-local : http에서 대표적으로 authentication에 쓰이는 Session, Cookie로 유효성을 검증하는 Stratgy 방식 
  - passport-facebook : facebook api를 이용한 간편로그인 방식

### MVC 패턴 사용
- MVC 패턴을 이용하였다.(현재는 react의 flux(redux), vue의 MVVM 등의 프레임워크 내에서 정의하는 패턴을 많이 사용한다.)

<img src="https://mblogthumb-phinf.pstatic.net/MjAxNzAzMjVfMjIg/MDAxNDkwNDM4ODMzNjI2.nzDNB5K0LuyP4joE2C4rIbL5Ue2F3at7wiI6ZpuTJN0g.WZ6V-WHZygLYW2WSdzcs7uAiAWgAJe3_H0XdkYKkutkg.PNG.jhc9639/1262.png?type=w800" alt="MVC"/>

```node
.
├── controllers
│   ├── uptoS3.js
│   └── user_access.js
├── models
│   ├── uploads.js
│   ├── user.js
│   └── user_photo.js
└── views
    ├── layouts
    │   └── default.hbs
    └── others
        ├── create.hbs
        ├── index.hbs
        ├── polarphoto.hbs
        ├── register.hbs
        ├── search.hbs
        ├── signin.hbs
        └── uploads.hbs

5 directories, 13 files
```













