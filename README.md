# 초기설정


## 들어가기에 앞서
위 예제에서는 되도록 로직의 움직임을 한눈에 보고 이해할 수 있도록 callback이 많이 쓰였습니다. 하지만 비동기 프로그래밍의특성상 콜백을 많이 쓸 수 밖에 없고 콜백을 많이 쓰다보면 가독성이 떨어지는 문제점이 많이 발생하게 되는데 이를 방지하기위해 async-yeild 패턴을 사용하거나 async 패키지를 사용합니다.


## dependencies


- body-parser
- express
- express-handlebars - view tempalte
- mongoose
- multer - express에서 제공하는 파일 업로드용 미들웨어
- nodemon - 파일의 변경이 일어날 경우 자동으로 재시작하는 패키지
- only - object중 원하는 데이터만 sorting하여 return하는 helper 패키지
- path
















