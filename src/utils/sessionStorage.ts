// 세션스토리지 데이터 관리 유틸리티

export const SessionStorageKeys = {
  NOTICES: 'dongin_notices',
  QNA: 'dongin_qna',
  VIDEOS: 'dongin_videos',
  PAYMENTS: 'dongin_payments',
  CLINIC_RESERVATIONS: 'dongin_clinic',
  LEARNING_DATA: 'dongin_learning_data',
  VIDEO_COMMENTS: 'dongin_video_comments',
} as const;

export class SessionStorageManager {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('SessionStorage get error:', error);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('SessionStorage set error:', error);
    }
  }

  static remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('SessionStorage remove error:', error);
    }
  }

  static clear(): void {
    try {
      Object.values(SessionStorageKeys).forEach(key => {
        sessionStorage.removeItem(key);
      });
    } catch (error) {
      console.error('SessionStorage clear error:', error);
    }
  }
}

// 초기 데이터 설정
export const initializeSessionData = () => {
  // 기존 데이터가 없을 때만 초기 데이터 설정
  if (!sessionStorage.getItem(SessionStorageKeys.NOTICES)) {
    SessionStorageManager.set(SessionStorageKeys.NOTICES, [
      {
        id: '1',
        title: '홈페이지 사용 안내',
        content: '이동인 국어 홈페이지 사용 방법을 안내드립니다.',
        author: '이동인',
        createdAt: '2024-03-15',
        category: 'general'
      },
      {
        id: '2',
        title: '서울고 2학년 필기본 업로드',
        content: '3월 둘째 주 필기본이 업로드되었습니다.',
        author: '이동인',
        createdAt: '2024-03-14',
        category: 'school',
        school: '서울고등학교',
        grade: 2
      }
    ]);
  }

  if (!sessionStorage.getItem(SessionStorageKeys.QNA)) {
    SessionStorageManager.set(SessionStorageKeys.QNA, [
      {
        id: '1',
        question: '문학 작품 분석할 때 어떤 부분에 집중해야 하나요?',
        answer: '작품의 화자, 상황, 정서, 화자의 의식 변화 등을 중심으로 분석하시길 바랍니다.',
        author: '익명',
        studentName: '김학생',
        createdAt: '2024-03-15',
        isPrivate: true
      },
      {
        id: '2',
        question: '독서 지문에서 빈칸추론 문제 푸는 방법이 궁금합니다.',
        author: '익명',
        studentName: '김학생',
        createdAt: '2024-03-14',
        isPrivate: true
      }
    ]);
  }

  if (!sessionStorage.getItem(SessionStorageKeys.PAYMENTS)) {
    SessionStorageManager.set(SessionStorageKeys.PAYMENTS, []);
  }

  if (!sessionStorage.getItem(SessionStorageKeys.CLINIC_RESERVATIONS)) {
    SessionStorageManager.set(SessionStorageKeys.CLINIC_RESERVATIONS, []);
  }
};