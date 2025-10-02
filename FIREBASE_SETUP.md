
# Firebase 연동 가이드

## 1) Firebase 프로젝트 생성
- https://console.firebase.google.com 에서 프로젝트를 만들고 웹 앱을 추가합니다.
- **프로젝트 설정 > SDK 설정 및 구성**에서 Web App 설정값(firebaseConfig)을 복사합니다.

## 2) 설정값 넣기
`assets/js/firebase-init.js` 파일의 `window.__FIREBASE_CONFIG__` 값을 복사한 값으로 교체하세요.

## 3) Firestore 사용 설정
- Firebase 콘솔에서 Firestore 데이터베이스를 생성(기본 모드)합니다.
- 보안 규칙(테스트/개발용 예시): 댓글 쓰기 허용, 조회수 증가 허용
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 조회수
    match /views/{slug} {
      allow read: if true;
      allow write: if true; // 운영 전환시 인증/레이트리밋 고려
    }
    // 댓글
    match /comments/{slug}/items/{doc} {
      allow read: if true;
      allow write: if request.resource.data.keys().hasOnly(['name','body','createdAt'])
                    && request.resource.data.body.size() > 0
                    && request.resource.data.body.size() <= 5000;
    }
  }
}
```

> 운영 시에는 reCAPTCHA, Cloud Functions, Rate limit 등 보안을 강화하세요.

## 4) 기능 설명
- **조회수**: 각 글 페이지에 접속하면 `views/{slug}` 문서를 1 증가시키고 화면에 표시합니다.
- **메인 TOP3**: Firestore의 `views`를 내림차순으로 3개 가져와 상단 "조회수 TOP 3"에 보여줍니다.
- **카테고리 조회수순 정렬**: 각 카테고리 페이지의 "최신순/오래된순" 옆에 "조회수순" 버튼이 추가되어 DOM을 재정렬합니다.
- **댓글**: 각 글 하단에 이름(선택), 내용 입력 후 저장되며 최신순으로 표시됩니다.

## 5) 배포
- 이 저장소를 GitHub Pages로 호스팅하면 됩니다. (Jekyll 빌드 후, 클라이언트에서 Firebase에 직접 연결)
