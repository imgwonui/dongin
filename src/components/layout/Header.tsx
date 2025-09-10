import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  VStack,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  IconButton
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginModal } from '../common/LoginModal';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isOpen: isLoginModalOpen, onOpen: onLoginModalOpen, onClose: onLoginModalClose } = useDisclosure();
  const { isOpen: isMobileMenuOpen, onOpen: onMobileMenuOpen, onClose: onMobileMenuClose } = useDisclosure();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Box 
        bg="gray.800" 
        borderBottom="1px solid" 
        borderColor="gray.600" 
        px={4} 
        py={3}
        position="sticky"
        top={0}
        zIndex={100}
      >
        <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
          <Text 
            as={Link}
            to="/"
            fontSize="xl" 
            fontWeight="bold" 
            color="#7A5AF8"
            cursor="pointer"
            _hover={{ textDecoration: 'none' }}
          >
            이동인 국어
          </Text>
          
          <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
            <Text as={Link} to="/notices" cursor="pointer" color="white" _hover={{ color: '#7A5AF8' }}>
              공지사항
            </Text>
            {isAuthenticated && user?.role === 'admin' && (
              <Text as={Link} to="/admin" cursor="pointer" color="#7A5AF8" fontWeight="bold" _hover={{ color: '#6B4CE6' }}>
                관리자 대시보드
              </Text>
            )}
            {isAuthenticated && user?.role === 'student' && (
              <>
                <Text as={Link} to="/qna" cursor="pointer" color="white" _hover={{ color: '#7A5AF8' }}>
                  질의응답
                </Text>
                <Text as={Link} to="/learning-data" cursor="pointer" color="white" _hover={{ color: '#7A5AF8' }}>
                  학습 데이터
                </Text>
                <Text as={Link} to="/videos" cursor="pointer" color="white" _hover={{ color: '#7A5AF8' }}>
                  영상 보강
                </Text>
                <Text as={Link} to="/payment" cursor="pointer" color="white" _hover={{ color: '#7A5AF8' }}>교재비 결제</Text>
                <Text as={Link} to="/clinic" cursor="pointer" color="white" _hover={{ color: '#7A5AF8' }}>클리닉 일정표</Text>
              </>
            )}
          </HStack>
          
          <HStack spacing={3}>
            {isAuthenticated ? (
              <Menu>
                <MenuButton>
                  <Avatar size="sm" bg="#7A5AF8" />
                </MenuButton>
                <MenuList>
                  {user && (
                    <MenuItem isDisabled>
                      <Box>
                        <Text fontWeight="bold">
                          {user.role === 'admin' ? '이동인 선생님' : user.profile?.name || user.username}
                        </Text>
                        {user.role === 'admin' ? (
                          <Text fontSize="sm" color="gray.600">관리자</Text>
                        ) : (
                          <>
                            <Text fontSize="sm" color="gray.600">{user.profile?.school}</Text>
                            <Text fontSize="sm" color="gray.600">{user.profile?.academy}</Text>
                            <Text fontSize="sm" color="gray.600">{user.profile?.schedule}</Text>
                          </>
                        )}
                      </Box>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button 
                bg="#7A5AF8" 
                color="white" 
                _hover={{ bg: '#6B4CE6' }}
                onClick={onLoginModalOpen}
                display={{ base: 'none', md: 'flex' }}
              >
                로그인
              </Button>
            )}
            
            <IconButton
              aria-label="메뉴 열기"
              icon={<HamburgerIcon />}
              variant="outline"
              color="white"
              borderColor="gray.600"
              _hover={{ bg: "gray.700" }}
              display={{ base: 'flex', md: 'none' }}
              onClick={onMobileMenuOpen}
            />
          </HStack>
        </Flex>
      </Box>
      
      <Drawer
        isOpen={isMobileMenuOpen}
        placement="right"
        onClose={onMobileMenuClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color="#7A5AF8">메뉴</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Text 
                as={Link} 
                to="/notices" 
                onClick={onMobileMenuClose}
                p={3}
                borderRadius="md"
                _hover={{ bg: 'gray.100' }}
              >
                공지사항
              </Text>
              {isAuthenticated && user?.role === 'admin' && (
                <Text 
                  as={Link} 
                  to="/admin" 
                  onClick={onMobileMenuClose}
                  p={3}
                  borderRadius="md"
                  _hover={{ bg: 'gray.100' }}
                  color="#7A5AF8"
                  fontWeight="bold"
                >
                  관리자 대시보드
                </Text>
              )}
              {isAuthenticated ? (
                <>
                  {user?.role === 'student' && (
                    <>
                      <Text 
                        as={Link} 
                        to="/qna" 
                        onClick={onMobileMenuClose}
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: 'gray.100' }}
                      >
                        질의응답
                      </Text>
                      <Text 
                        as={Link} 
                        to="/learning-data" 
                        onClick={onMobileMenuClose}
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: 'gray.100' }}
                      >
                        학습 데이터
                      </Text>
                      <Text 
                        as={Link} 
                        to="/videos" 
                        onClick={onMobileMenuClose}
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: 'gray.100' }}
                      >
                        영상 보강
                      </Text>
                      <Text 
                        as={Link}
                        to="/payment"
                        onClick={onMobileMenuClose}
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: 'gray.100' }}
                        cursor="pointer"
                      >
                        교재비 결제
                      </Text>
                      <Text 
                        as={Link}
                        to="/clinic"
                        onClick={onMobileMenuClose}
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: 'gray.100' }}
                        cursor="pointer"
                      >
                        클리닉 일정표
                      </Text>
                    </>
                  )}
                  
                  {user && (
                    <Box p={3} bg="gray.50" borderRadius="md" mt={4}>
                      <Text fontWeight="bold" mb={1}>
                        {user.role === 'admin' ? '이동인 선생님' : user.profile?.name || user.username}
                      </Text>
                      {user.role === 'admin' ? (
                        <Text fontSize="sm" color="gray.600">관리자</Text>
                      ) : (
                        <>
                          <Text fontSize="sm" color="gray.600">{user.profile?.school}</Text>
                          <Text fontSize="sm" color="gray.600">{user.profile?.academy}</Text>
                          <Text fontSize="sm" color="gray.600">{user.profile?.schedule}</Text>
                        </>
                      )}
                    </Box>
                  )}
                  
                  <Button
                    onClick={() => {
                      handleLogout();
                      onMobileMenuClose();
                    }}
                    variant="outline"
                    colorScheme="red"
                    mt={2}
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                <Button
                  bg="#7A5AF8"
                  color="white"
                  _hover={{ bg: '#6B4CE6' }}
                  onClick={() => {
                    onLoginModalOpen();
                    onMobileMenuClose();
                  }}
                >
                  로그인
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      
      <LoginModal isOpen={isLoginModalOpen} onClose={onLoginModalClose} />
    </>
  );
};