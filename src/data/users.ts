export interface User {
  id: string;
  username: string;
  password: string;
  role: 'student' | 'admin';
  profile?: StudentProfile;
}

export interface StudentProfile {
  name: string;
  school: string;
  grade: number;
  academy: string;
  schedule: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'test',
    password: '1234',
    role: 'student',
    profile: {
      name: '김학생',
      school: '서울고등학교',
      grade: 2,
      academy: '이동인국어학원',
      schedule: '월요일 18:00-20:00'
    }
  },
  {
    id: '2',
    username: 'dongin',
    password: '1234',
    role: 'admin'
  }
];