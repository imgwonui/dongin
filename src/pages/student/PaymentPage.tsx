import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  useToast,
  Alert,
  AlertIcon,
  Divider,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';

interface PaymentItem {
  id: string;
  title: string;
  description: string;
  price: number;
  school: string;
  grade: number;
  category: 'textbook' | 'workbook' | 'test';
  isRequired: boolean;
}

const mockPaymentItems: PaymentItem[] = [
  {
    id: '1',
    title: '문학 개념서',
    description: '문학 갈래별 개념 정리 및 작품 분석집',
    price: 25000,
    school: '서울고등학교',
    grade: 2,
    category: 'textbook',
    isRequired: true
  },
  {
    id: '2',
    title: '독서 실전 문제집',
    description: '독서 영역 기출문제 및 예상문제 모음집',
    price: 18000,
    school: '서울고등학교',
    grade: 2,
    category: 'workbook',
    isRequired: true
  },
  {
    id: '3',
    title: '모의고사 세트 (3월)',
    description: '3월 모의고사 10회분 + 해설집',
    price: 15000,
    school: '서울고등학교',
    grade: 2,
    category: 'test',
    isRequired: false
  },
  {
    id: '4',
    title: '문법 완성 교재',
    description: '고등 문법 체계 완성 및 실전 문제',
    price: 22000,
    school: '강남고등학교',
    grade: 3,
    category: 'textbook',
    isRequired: true
  },
  {
    id: '5',
    title: '수능 기출 5개년',
    description: '수능 국어 최근 5개년 기출문제 + 상세해설',
    price: 28000,
    school: '강남고등학교',
    grade: 3,
    category: 'workbook',
    isRequired: true
  }
];

export const PaymentPage: React.FC = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItems, setSelectedItems] = useState<PaymentItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  if (!user || user.role !== 'student') {
    return (
      <Box textAlign="center" py={20} bg="gray.900" minH="100vh" color="white">
        <Alert status="warning" maxW="md" mx="auto" bg="orange.800" color="white">
          <AlertIcon />
          학생만 접근할 수 있는 페이지입니다.
        </Alert>
      </Box>
    );
  }

  const userProfile = user.profile;
  const availableItems = mockPaymentItems.filter(item => 
    item.school === userProfile?.school && 
    item.grade === userProfile?.grade
  );

  const requiredItems = availableItems.filter(item => item.isRequired);
  const optionalItems = availableItems.filter(item => !item.isRequired);

  const handleSelectItem = (item: PaymentItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handlePayment = () => {
    if (selectedItems.length === 0) {
      toast({
        title: '결제할 교재를 선택해주세요',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    onOpen();
  };

  const processPayment = () => {
    setIsProcessing(true);
    
    // 결제 프로세스 시뮬레이션
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      setSelectedItems([]);
      
      toast({
        title: '결제가 완료되었습니다',
        description: '교재는 다음 수업시간에 배부됩니다.',
        status: 'success',
        duration: 4000,
      });
    }, 2000);
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'textbook': return '교재';
      case 'workbook': return '문제집';
      case 'test': return '모의고사';
      default: return '기타';
    }
  };

  return (
    <Box maxW="1200px" mx="auto" p={6} bg="gray.900" minH="100vh" color="white">
      <VStack spacing={6} align="stretch">
        <Text fontSize="3xl" fontWeight="bold" color="#7A5AF8">
          교재비 결제 - {userProfile?.school} {userProfile?.grade}학년
        </Text>

        <Alert status="info" bg="blue.800" color="white">
          <AlertIcon />
          수업에 필요한 교재를 온라인으로 주문할 수 있습니다. 결제 후 다음 수업시간에 배부됩니다.
        </Alert>

        {/* 필수 교재 */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="#7A5AF8" mb={4}>
            필수 교재
          </Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            {requiredItems.map((item) => {
              const isSelected = selectedItems.some(selected => selected.id === item.id);
              return (
                <GridItem key={item.id}>
                  <Card 
                    bg={isSelected ? "purple.900" : "gray.800"} 
                    border="2px solid" 
                    borderColor={isSelected ? "#7A5AF8" : "gray.600"}
                    cursor="pointer"
                    onClick={() => handleSelectItem(item)}
                    _hover={{ borderColor: "#7A5AF8" }}
                  >
                    <CardBody>
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between">
                          <Badge colorScheme="red" variant="solid">필수</Badge>
                          <Badge colorScheme="gray">{getCategoryLabel(item.category)}</Badge>
                        </HStack>
                        
                        <Text fontWeight="bold" color="white">{item.title}</Text>
                        <Text fontSize="sm" color="gray.300">{item.description}</Text>
                        
                        <HStack justify="space-between" mt={4}>
                          <Text fontSize="lg" fontWeight="bold" color="#7A5AF8">
                            {item.price.toLocaleString()}원
                          </Text>
                          {isSelected && (
                            <CheckCircleIcon color="#7A5AF8" />
                          )}
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              );
            })}
          </Grid>
        </Box>

        {/* 선택 교재 */}
        {optionalItems.length > 0 && (
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="#7A5AF8" mb={4}>
              선택 교재
            </Text>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
              {optionalItems.map((item) => {
                const isSelected = selectedItems.some(selected => selected.id === item.id);
                return (
                  <GridItem key={item.id}>
                    <Card 
                      bg={isSelected ? "purple.900" : "gray.800"} 
                      border="2px solid" 
                      borderColor={isSelected ? "#7A5AF8" : "gray.600"}
                      cursor="pointer"
                      onClick={() => handleSelectItem(item)}
                      _hover={{ borderColor: "#7A5AF8" }}
                    >
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          <HStack justify="space-between">
                            <Badge colorScheme="blue" variant="solid">선택</Badge>
                            <Badge colorScheme="gray">{getCategoryLabel(item.category)}</Badge>
                          </HStack>
                          
                          <Text fontWeight="bold" color="white">{item.title}</Text>
                          <Text fontSize="sm" color="gray.300">{item.description}</Text>
                          
                          <HStack justify="space-between" mt={4}>
                            <Text fontSize="lg" fontWeight="bold" color="#7A5AF8">
                              {item.price.toLocaleString()}원
                            </Text>
                            {isSelected && (
                              <CheckCircleIcon color="#7A5AF8" />
                            )}
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                );
              })}
            </Grid>
          </Box>
        )}

        {availableItems.length === 0 && (
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center" py={12}>
              <Text color="gray.400">
                현재 주문 가능한 교재가 없습니다.
              </Text>
            </CardBody>
          </Card>
        )}

        {/* 결제 요약 */}
        {selectedItems.length > 0 && (
          <Card bg="gray.800" border="2px solid" borderColor="#7A5AF8">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold" color="#7A5AF8">
                  선택한 교재 ({selectedItems.length}개)
                </Text>
                <List spacing={2}>
                  {selectedItems.map((item) => (
                    <ListItem key={item.id} color="white">
                      <ListIcon as={CheckCircleIcon} color="#7A5AF8" />
                      {item.title} - {item.price.toLocaleString()}원
                    </ListItem>
                  ))}
                </List>
                <Divider borderColor="gray.600" />
                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    총 결제금액
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="#7A5AF8">
                    {totalAmount.toLocaleString()}원
                  </Text>
                </HStack>
                <Button 
                  bg="#7A5AF8"
                  color="white"
                  _hover={{ bg: "#6B4CE6" }}
                  size="lg"
                  onClick={handlePayment}
                >
                  결제하기
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* 결제 확인 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white" mx={4}>
          <ModalHeader color="#7A5AF8">결제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text textAlign="center">
                총 <Text as="span" color="#7A5AF8" fontWeight="bold">{totalAmount.toLocaleString()}원</Text>을 결제하시겠습니까?
              </Text>
              
              <Box w="100%" bg="gray.700" p={4} borderRadius="md">
                <Text fontSize="sm" fontWeight="bold" mb={2}>주문 내역:</Text>
                {selectedItems.map((item) => (
                  <Text key={item.id} fontSize="sm" color="gray.300">
                    • {item.title} - {item.price.toLocaleString()}원
                  </Text>
                ))}
              </Box>

              <Text fontSize="sm" color="gray.400" textAlign="center">
                교재는 결제 완료 후 다음 수업시간에 배부됩니다.
              </Text>
              
              <HStack w="100%" spacing={3}>
                <Button 
                  onClick={onClose} 
                  variant="outline" 
                  borderColor="gray.600" 
                  color="white" 
                  _hover={{ bg: "gray.700" }} 
                  flex={1}
                  disabled={isProcessing}
                >
                  취소
                </Button>
                <Button 
                  bg="#7A5AF8"
                  color="white"
                  _hover={{ bg: "#6B4CE6" }}
                  onClick={processPayment}
                  flex={1}
                  isLoading={isProcessing}
                  loadingText="결제 중..."
                >
                  결제 완료
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};