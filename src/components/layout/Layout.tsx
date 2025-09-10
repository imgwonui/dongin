import React from 'react';
import { Box } from '@chakra-ui/react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box minH="100vh" bg="gray.900" fontFamily="Pretendard, sans-serif" color="white">
      <Header />
      <Box>
        {children}
      </Box>
    </Box>
  );
};