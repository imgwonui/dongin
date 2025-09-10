import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Select,
  useToast,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Input,
  Textarea,
  IconButton,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { ViewIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { SessionStorageManager, SessionStorageKeys } from '../../utils/sessionStorage';

interface PaymentItem {
  id: string;
  studentId: string;
  studentName: string;
  school: string;
  grade: number;
  itemName: string;
  itemType: 'textbook' | 'workbook' | 'supplement';
  price: number;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  requestDate: string;
  paidDate?: string;
  paymentMethod?: string;
  memo?: string;
}

interface AdminPaymentManagerProps {
  onUpdate: () => void;
}

const mockPayments: PaymentItem[] = [
  {
    id: '1',
    studentId: '1',
    studentName: '김학생',
    school: '서울고등학교',
    grade: 2,
    itemName: '내신 국어 필기 교재',
    itemType: 'textbook',
    price: 25000,
    quantity: 1,
    totalAmount: 25000,
    status: 'pending',
    requestDate: '2024-03-15'
  },
  {
    id: '2',
    studentId: '2',
    studentName: '이학생',
    school: '서울고등학교',
    grade: 2,
    itemName: '문학 워크북',
    itemType: 'workbook',
    price: 15000,
    quantity: 2,
    totalAmount: 30000,
    status: 'paid',
    requestDate: '2024-03-10',
    paidDate: '2024-03-12',
    paymentMethod: '계좌이체'
  },
  {
    id: '3',
    studentId: '3',
    studentName: '박학생',
    school: '강남고등학교',
    grade: 3,
    itemName: '수능 모의고사 문제집',
    itemType: 'supplement',
    price: 20000,
    quantity: 1,
    totalAmount: 20000,
    status: 'pending',
    requestDate: '2024-03-16'
  }
];

export const AdminPaymentManager: React.FC<AdminPaymentManagerProps> = ({ onUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [payments, setPayments] = useState<PaymentItem[]>(mockPayments);
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [memo, setMemo] = useState('');
  const toast = useToast();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    const storedPayments = SessionStorageManager.get<PaymentItem[]>(SessionStorageKeys.PAYMENTS, mockPayments);
    setPayments(storedPayments);
  };

  const handleViewPayment = (payment: PaymentItem) => {
    setSelectedPayment(payment);
    setPaymentMethod(payment.paymentMethod || '');
    setMemo(payment.memo || '');
    onOpen();
  };

  const handleUpdatePaymentStatus = (paymentId: string, newStatus: 'paid' | 'cancelled' | 'refunded') => {
    const updatedPayments = payments.map(payment => {
      if (payment.id === paymentId) {
        const updatedPayment = {
          ...payment,
          status: newStatus,
          paidDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : payment.paidDate,
          paymentMethod: newStatus === 'paid' ? paymentMethod : payment.paymentMethod,
          memo: memo || payment.memo
        };
        return updatedPayment;
      }
      return payment;
    });

    setPayments(updatedPayments);
    SessionStorageManager.set(SessionStorageKeys.PAYMENTS, updatedPayments);
    onUpdate();

    const statusText = {
      paid: '결제완료',
      cancelled: '취소',
      refunded: '환불'
    };

    toast({
      title: `결제 상태가 '${statusText[newStatus]}'로 변경되었습니다`,
      status: 'success',
      duration: 2000,
    });

    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'paid':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'refunded':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'paid':
        return '결제완료';
      case 'cancelled':
        return '취소';
      case 'refunded':
        return '환불';
      default:
        return status;
    }
  };

  const getItemTypeText = (type: string) => {
    switch (type) {
      case 'textbook':
        return '교재';
      case 'workbook':
        return '워크북';
      case 'supplement':
        return '보조자료';
      default:
        return type;
    }
  };

  const filteredPayments = payments.filter(payment => 
    statusFilter === 'all' || payment.status === statusFilter
  );

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.totalAmount, 0);
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const paidCount = payments.filter(p => p.status === 'paid').length;

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="white">
          교재비 결제 관리 ({payments.length}건)
        </Text>
        <HStack spacing={4}>
          <Badge colorScheme="orange" fontSize="sm" p={2}>
            대기중: {pendingCount}건
          </Badge>
          <Badge colorScheme="green" fontSize="sm" p={2}>
            완료: {paidCount}건
          </Badge>
        </HStack>
      </HStack>

      {/* 통계 및 필터 */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4} mb={6}>
        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center">
              <Text color="gray.300" fontSize="sm">총 결제 요청</Text>
              <Text color="#7A5AF8" fontSize="2xl" fontWeight="bold">
                {payments.length}건
              </Text>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center">
              <Text color="gray.300" fontSize="sm">대기중 결제</Text>
              <Text color="orange.400" fontSize="2xl" fontWeight="bold">
                {pendingCount}건
              </Text>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center">
              <Text color="gray.300" fontSize="sm">완료된 결제</Text>
              <Text color="green.400" fontSize="2xl" fontWeight="bold">
                {paidCount}건
              </Text>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center">
              <Text color="gray.300" fontSize="sm">총 결제 금액</Text>
              <Text color="yellow.400" fontSize="2xl" fontWeight="bold">
                {totalAmount.toLocaleString()}원
              </Text>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* 필터 */}
      <Card bg="gray.800" border="1px solid" borderColor="gray.600" mb={6}>
        <CardBody>
          <HStack>
            <Text fontSize="sm" color="gray.300">상태 필터:</Text>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              color="white"
              size="sm"
              w="150px"
            >
              <option value="all">전체</option>
              <option value="pending">대기중</option>
              <option value="paid">결제완료</option>
              <option value="cancelled">취소</option>
              <option value="refunded">환불</option>
            </Select>
          </HStack>
        </CardBody>
      </Card>

      {/* 결제 목록 */}
      <Card bg="gray.800" border="1px solid" borderColor="gray.600">
        <CardBody>
          {filteredPayments.length > 0 ? (
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th color="gray.300" borderColor="gray.600">학생</Th>
                    <Th color="gray.300" borderColor="gray.600">학교/학년</Th>
                    <Th color="gray.300" borderColor="gray.600">교재명</Th>
                    <Th color="gray.300" borderColor="gray.600">종류</Th>
                    <Th color="gray.300" borderColor="gray.600">수량</Th>
                    <Th color="gray.300" borderColor="gray.600">금액</Th>
                    <Th color="gray.300" borderColor="gray.600">상태</Th>
                    <Th color="gray.300" borderColor="gray.600">요청일</Th>
                    <Th color="gray.300" borderColor="gray.600">관리</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPayments.map((payment) => (
                    <Tr key={payment.id}>
                      <Td color="white" borderColor="gray.600">
                        <Badge colorScheme="blue" size="sm">
                          {payment.studentName}
                        </Badge>
                      </Td>
                      <Td color="gray.300" borderColor="gray.600" fontSize="sm">
                        {payment.school}<br/>{payment.grade}학년
                      </Td>
                      <Td color="white" borderColor="gray.600" fontSize="sm">
                        {payment.itemName}
                      </Td>
                      <Td color="gray.300" borderColor="gray.600" fontSize="sm">
                        {getItemTypeText(payment.itemType)}
                      </Td>
                      <Td color="white" borderColor="gray.600" fontSize="sm">
                        {payment.quantity}개
                      </Td>
                      <Td color="white" borderColor="gray.600" fontSize="sm" fontWeight="bold">
                        {payment.totalAmount.toLocaleString()}원
                      </Td>
                      <Td borderColor="gray.600">
                        <Badge colorScheme={getStatusColor(payment.status)} size="sm">
                          {getStatusText(payment.status)}
                        </Badge>
                      </Td>
                      <Td color="gray.300" borderColor="gray.600" fontSize="sm">
                        {payment.requestDate}
                      </Td>
                      <Td borderColor="gray.600">
                        <HStack spacing={1}>
                          <IconButton
                            aria-label="상세보기"
                            icon={<ViewIcon />}
                            size="xs"
                            variant="outline"
                            borderColor="gray.600"
                            color="white"
                            _hover={{ bg: "gray.600" }}
                            onClick={() => handleViewPayment(payment)}
                          />
                          {payment.status === 'pending' && (
                            <>
                              <IconButton
                                aria-label="결제완료"
                                icon={<CheckIcon />}
                                size="xs"
                                variant="outline"
                                borderColor="green.600"
                                color="green.400"
                                _hover={{ bg: "green.900" }}
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  handleUpdatePaymentStatus(payment.id, 'paid');
                                }}
                              />
                              <IconButton
                                aria-label="취소"
                                icon={<CloseIcon />}
                                size="xs"
                                variant="outline"
                                borderColor="red.600"
                                color="red.400"
                                _hover={{ bg: "red.900" }}
                                onClick={() => handleUpdatePaymentStatus(payment.id, 'cancelled')}
                              />
                            </>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ) : (
            <Alert status="info" bg="blue.800" color="white">
              <AlertIcon />
              해당 조건에 맞는 결제 내역이 없습니다.
            </Alert>
          )}
        </CardBody>
      </Card>

      {/* 결제 상세 정보 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white" mx={4}>
          <ModalHeader color="#7A5AF8">
            결제 상세 정보
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPayment && (
              <VStack spacing={4} align="stretch">
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>학생명</Text>
                    <Text fontWeight="bold">{selectedPayment.studentName}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>학교/학년</Text>
                    <Text>{selectedPayment.school} {selectedPayment.grade}학년</Text>
                  </Box>
                </Grid>

                <Box>
                  <Text fontSize="sm" color="gray.300" mb={1}>교재명</Text>
                  <Text fontWeight="bold">{selectedPayment.itemName}</Text>
                </Box>

                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>종류</Text>
                    <Badge colorScheme="purple">
                      {getItemTypeText(selectedPayment.itemType)}
                    </Badge>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>수량</Text>
                    <Text>{selectedPayment.quantity}개</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>총 금액</Text>
                    <Text fontWeight="bold" color="yellow.400">
                      {selectedPayment.totalAmount.toLocaleString()}원
                    </Text>
                  </Box>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>상태</Text>
                    <Badge colorScheme={getStatusColor(selectedPayment.status)}>
                      {getStatusText(selectedPayment.status)}
                    </Badge>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>요청일</Text>
                    <Text>{selectedPayment.requestDate}</Text>
                  </Box>
                </Grid>

                {selectedPayment.status === 'paid' && selectedPayment.paidDate && (
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>결제일</Text>
                    <Text color="green.400">{selectedPayment.paidDate}</Text>
                  </Box>
                )}

                {selectedPayment.status === 'pending' && (
                  <>
                    <Box>
                      <Text fontSize="sm" color="gray.300" mb={2}>결제 방법</Text>
                      <Select
                        placeholder="결제 방법 선택"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        bg="gray.700"
                        borderColor="gray.600"
                        _focus={{ borderColor: "#7A5AF8" }}
                      >
                        <option value="계좌이체">계좌이체</option>
                        <option value="카드결제">카드결제</option>
                        <option value="현금">현금</option>
                      </Select>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="gray.300" mb={2}>메모</Text>
                      <Textarea
                        placeholder="결제 관련 메모를 입력하세요..."
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        bg="gray.700"
                        borderColor="gray.600"
                        _focus={{ borderColor: "#7A5AF8" }}
                        size="sm"
                        rows={3}
                      />
                    </Box>

                    <HStack spacing={2}>
                      <Button
                        bg="green.600"
                        color="white"
                        _hover={{ bg: "green.500" }}
                        onClick={() => handleUpdatePaymentStatus(selectedPayment.id, 'paid')}
                        flex={1}
                      >
                        결제완료 처리
                      </Button>
                      <Button
                        bg="red.600"
                        color="white"
                        _hover={{ bg: "red.500" }}
                        onClick={() => handleUpdatePaymentStatus(selectedPayment.id, 'cancelled')}
                        flex={1}
                      >
                        취소 처리
                      </Button>
                    </HStack>
                  </>
                )}

                {selectedPayment.memo && (
                  <Box bg="gray.700" p={3} borderRadius="md">
                    <Text fontSize="sm" color="gray.300" mb={1}>메모</Text>
                    <Text fontSize="sm">{selectedPayment.memo}</Text>
                  </Box>
                )}

                <Button
                  onClick={onClose}
                  variant="outline"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ bg: "gray.700" }}
                >
                  닫기
                </Button>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};