# 동인 사이트 (Dongin Site)

동인 교육 플랫폼의 웹사이트입니다.

## 기술 스택

- React 19.1.1
- TypeScript
- Chakra UI
- React Router DOM
- Framer Motion

## 주요 기능

- 학생/관리자 역할 기반 접근 제어
- 동영상 학습 시스템
- 클리닉 예약 시스템
- 학습 데이터 관리
- 결제 관리
- 공지사항 및 Q&A

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build
```

## 배포

이 프로젝트는 Vercel을 통해 배포됩니다.

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   └── layout/         # 레이아웃 컴포넌트
├── contexts/           # React Context
├── data/              # 모킹 데이터
├── hooks/             # 커스텀 훅
├── pages/             # 페이지 컴포넌트
│   ├── admin/         # 관리자 페이지
│   ├── home/          # 홈 페이지
│   └── student/       # 학생 페이지
└── utils/             # 유틸리티 함수
```