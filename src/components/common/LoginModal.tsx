import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Input,
  Button,
  Text,
  useToast
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const toast = useToast();

  const handleLogin = () => {
    const storedUsers = JSON.parse(localStorage.getItem('dongin_users') || '[]');
    const user = storedUsers.find(
      (u: any) => u.username === username && u.password === password
    );

    if (user) {
      login(user);
      toast({
        title: '로그인 성공',
        status: 'success',
        duration: 2000,
      });
      onClose();
      setUsername('');
      setPassword('');
    } else {
      toast({
        title: '로그인 실패',
        description: '아이디 또는 비밀번호를 확인해주세요.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader color="#7A5AF8">로그인</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Input
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              colorScheme="purple"
              bg="#7A5AF8"
              w="100%" 
              onClick={handleLogin}
            >
              로그인
            </Button>
            <Text fontSize="sm" color="gray.500">
              학생 계정: test / 1234
            </Text>
            <Text fontSize="sm" color="gray.500">
              관리자 계정: dongin / 1234
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};