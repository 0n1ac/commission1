# 밥친구

혼밥 대신 같이 먹을 친구를 찾아주는 소셜 다이닝 모바일 웹앱 목업입니다. 백엔드 없이 GitHub Pages에서 동작하는 정적 HTML/CSS/JavaScript 앱으로 구성했습니다.

## 라이브 데모

- https://0n1ac.github.io/commission1/

## 주요 기능

- 홈: AI 메뉴 추천, 추천 식당, 방문도장, 추천 친구, 이벤트 배너
- 지도: mock 지도, 카테고리 필터, 식당 랭킹, 같이 주문, N 결제 계산기
- 지역게시판: 지역맛집 피드, 지역이벤트, 공지사항 아코디언
- 채팅: 채팅방 리스트, 대화 상세, 메시지 전송 mock
- 마이페이지: 프로필, 메뉴, 설정 토글, 1대1 문의, 언어 설정
- 통합 검색: 식당/친구 실시간 검색
- 부가 기능: 북마크, 친구 추가, 방문도장 저장, 다크모드, 알림 오버레이

## 기술 스택

- HTML
- CSS
- Vanilla JavaScript
- JSON mock data

## 실행 방법

정적 서버로 실행합니다.

```bash
python3 -m http.server 4173
```

브라우저에서 접속합니다.

```text
http://127.0.0.1:4173
```

## 폴더 구조

```text
.
├── index.html
├── css/
├── js/
├── data/
└── assets/images/
```

## 배포

GitHub Pages 기준:

1. `main` 브랜치에 코드 push
2. Repository Settings → Pages
3. Source를 `Deploy from a branch`로 선택
4. Branch를 `main`, folder를 `/ (root)`로 선택
