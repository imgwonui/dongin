export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: 'general' | 'school';
  school?: string;
  grade?: number;
}

export interface QnA {
  id: string;
  question: string;
  answer?: string;
  author: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface TestResult {
  id: string;
  studentId: string;
  testName: string;
  score: number;
  rank: number;
  totalStudents: number;
  season: string;
  date: string;
  comment?: string;
}

export interface Homework {
  id: string;
  studentId: string;
  week: number;
  totalProblems: number;
  solvedProblems: number;
  season: string;
  comment?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  school: string;
  grade: number;
  isPublic: boolean;
  validUntil?: string;
  videoUrl: string;
  week: number;
}

export const mockNotices: Notice[] = [
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
];

export const mockTestResults: TestResult[] = [
  {
    id: '1',
    studentId: '1',
    testName: '1회차 문학 테스트',
    score: 85,
    rank: 3,
    totalStudents: 25,
    season: '2024-1학기',
    date: '2024-03-10',
    comment: '문학 개념 이해도가 향상되었습니다.'
  },
  {
    id: '2',
    studentId: '1',
    testName: '2회차 독서 테스트',
    score: 92,
    rank: 1,
    totalStudents: 25,
    season: '2024-1학기',
    date: '2024-03-17',
    comment: '독서 속도와 이해력이 크게 향상되었습니다.'
  }
];

export const mockHomework: Homework[] = [
  {
    id: '1',
    studentId: '1',
    week: 1,
    totalProblems: 20,
    solvedProblems: 18,
    season: '2024-1학기',
    comment: '대부분 문제를 잘 해결했습니다. 2문제 부족.'
  },
  {
    id: '2',
    studentId: '1',
    week: 2,
    totalProblems: 25,
    solvedProblems: 25,
    season: '2024-1학기',
    comment: '완벽하게 과제를 완수했습니다.'
  }
];

export const mockVideos: Video[] = [
  {
    id: '1',
    title: '1주차 - 문학의 이해',
    description: '문학 갈래와 특징에 대해 학습합니다. 현대문학과 고전문학의 차이점을 알아보고, 각 갈래별 특성을 정리합니다.',
    school: '서울고등학교',
    grade: 2,
    isPublic: true,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    week: 1
  },
  {
    id: '2',
    title: '2주차 - 독서의 기초',
    description: '독서 방법과 독해 전략을 학습합니다. 논리적 사고력과 비판적 독해 능력을 기르는 방법을 다룹니다.',
    school: '서울고등학교',
    grade: 2,
    isPublic: false,
    validUntil: '2024-12-31',
    videoUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    week: 2
  },
  {
    id: '3',
    title: '3주차 - 현대시 분석법',
    description: '현대시의 화자, 상황, 정서를 파악하는 방법을 학습합니다.',
    school: '서울고등학교',
    grade: 2,
    isPublic: true,
    videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    week: 3
  },
  {
    id: '4',
    title: '1주차 - 수능 국어 개관',
    description: '수능 국어 영역별 특징과 학습 전략을 다룹니다.',
    school: '강남고등학교',
    grade: 3,
    isPublic: true,
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    week: 1
  },
  {
    id: '5',
    title: '2주차 - 고전소설 심화',
    description: '고전소설의 주제의식과 인물의 성격을 분석하는 방법을 학습합니다.',
    school: '강남고등학교',
    grade: 3,
    isPublic: false,
    validUntil: '2025-06-30',
    videoUrl: 'https://www.youtube.com/watch?v=PSH0eRKq1lE',
    week: 2
  }
];