import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../data/users';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // 초기 사용자 데이터 설정
  React.useEffect(() => {
    const storedUsers = localStorage.getItem('dongin_users');
    if (!storedUsers) {
      // 기본 사용자 데이터 생성
      const initialUsers = [
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
      localStorage.setItem('dongin_users', JSON.stringify(initialUsers));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};