////* Firebase SDK *//////

// Google 제공업체 개체의 인스턴스 생성
var provider = new firebase.auth.GoogleAuthProvider();

//addScope() -> 인증 제공업체 개체(provider)에 요청하고자 하는 OAuth 2.0 범위를 추가로 지정
provider.addScope('http://www.googleapis.com/auth/contacts.readonly');

// provider를 이용해 Firebase에 인증 -> 로그인 페이지로 리디렉션
firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // ...
  }
  // The signed-in user info.
  var user = result.user;
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});