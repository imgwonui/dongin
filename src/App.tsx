import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './components/AppRoutes';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: 'Pretendard, sans-serif',
    body: 'Pretendard, sans-serif',
  },
  colors: {
    brand: {
      500: '#7A5AF8',
      600: '#6B4CE6',
    }
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white',
      }
    }
  }
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
