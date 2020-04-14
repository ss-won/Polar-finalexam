# 사진일기 웹어플리케이션


## 들어가기에 앞서
위 예제에서는 되도록 로직의 움직임을 한눈에 보고 이해할 수 있도록 callback이 많이 쓰였습니다. 하지만 비동기 프로그래밍의특성상 콜백을 많이 쓸 수 밖에 없고 콜백을 많이 쓰다보면 가독성이 떨어지는 문제점이 많이 발생하게 되는데 이를 방지하기위해 async-yeild 패턴을 사용하거나 async 패키지를 사용합니다.


## Dependencies

- body-parser :
- express : express를 사용하기 위한 모듈(node.js 서버구축에서 대표적)
- express-handlebars : 뷰엔진(view tempalte)을 사용하기 위한 모듈
- mongoose : MongoDB의 데이터를 ODM(Object Document Mapping)화 시켜주는 모듈로 데이터를 자바스크립트 객체화 시켜준다.
- nodemon : 파일의 변경이 일어날 경우 자동으로 재시작하는 패키지(유사품: superviser)
- only : object중 원하는 데이터만 sorting하여 return하는 helper 패키지
- multer : express에서 제공하는 파일 업로드용 미들웨어
- connect-flash : 화면이 전환될때 메세지를 전달하기 위한 미들웨어
- passport : Node.js의 로그인 기능의 인증을 Stratgy기법으로 간편히 해주는 미들웨어
  - passport-local : http에서 대표적으로 authentication에 쓰이는 Session, Cookie로 유효성을 검증하는 Stratgy 방식 
  - passport-facebook : facebook api를 이용한 간편로그인 방식

## MVC 패턴
- MVC 패턴을 이용하였다.(2017년 경에는 나름 많이 쓰였지만, 최근에는 react의 flux(redux), vue의 MVVM을 많이들 쓰더라,,)
<img src="https://mblogthumb-phinf.pstatic.net/MjAxNzAzMjVfMjIg/MDAxNDkwNDM4ODMzNjI2.nzDNB5K0LuyP4joE2C4rIbL5Ue2F3at7wiI6ZpuTJN0g.WZ6V-WHZygLYW2WSdzcs7uAiAWgAJe3_H0XdkYKkutkg.PNG.jhc9639/1262.png?type=w800" alt="MVC"/>
















