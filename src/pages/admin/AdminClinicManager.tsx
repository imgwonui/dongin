import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  Textarea,
  IconButton,
  Alert,
  AlertIcon,
  Input
} from '@chakra-ui/react';
import { ViewIcon, CheckIcon, CloseIcon, CalendarIcon } from '@chakra-ui/icons';
import { SessionStorageManager, SessionStorageKeys } from '../../utils/sessionStorage';

interface ClinicReservation {
  id: string;
  studentId: string;
  studentName: string;
  school: string;
  grade: number;
  date: string;
  time: string;
  type: 'individual' | 'group';
  subject: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  confirmedAt?: string;
  memo?: string;
}

interface AdminClinicManagerProps {
  onUpdate: () => void;
}

const mockReservations: ClinicReservation[] = [
  {
    id: '1',
    studentId: '1',
    studentName: '김학생',
    school: '서울고등학교',
    grade: 2,
    date: '2024-03-20',
    time: '14:00',
    type: 'individual',
    subject: '문학',
    description: '현대시 해석에 어려움을 겪고 있어서 개별 상담을 받고 싶습니다.',
    status: 'pending',
    createdAt: '2024-03-15'
  },
  {
    id: '2',
    studentId: '2',
    studentName: '이학생',
    school: '서울고등학교',
    grade: 2,
    date: '2024-03-22',
    time: '16:00',
    type: 'individual',
    subject: '독서',
    description: '독서 문제 풀이 방법에 대해 질문이 있습니다.',
    status: 'confirmed',
    createdAt: '2024-03-14',
    confirmedAt: '2024-03-16'
  },
  {
    id: '3',
    studentId: '3',
    studentName: '박학생',
    school: '강남고등학교',
    grade: 3,
    date: '2024-03-25',
    time: '15:00',
    type: 'group',
    subject: '화법과 작문',
    description: '친구들과 함께 화법과 작문 영역을 집중적으로 학습하고 싶습니다.',
    status: 'pending',
    createdAt: '2024-03-16'
  },
  {
    id: '4',
    studentId: '1',
    studentName: '김학생',
    school: '서울고등학교',
    grade: 2,
    date: '2024-03-18',
    time: '13:00',
    type: 'individual',
    subject: '언어와 매체',
    description: '언어와 매체 영역 문법 문제 해결 방법을 배우고 싶습니다.',
    status: 'completed',
    createdAt: '2024-03-10',
    confirmedAt: '2024-03-12',
    memo: '학생이 문법 기초 개념을 잘 이해했음. 추가 연습 필요.'
  }
];

export const AdminClinicManager: React.FC<AdminClinicManagerProps> = ({ onUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reservations, setReservations] = useState<ClinicReservation[]>(mockReservations);
  const [selectedReservation, setSelectedReservation] = useState<ClinicReservation | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [memo, setMemo] = useState('');
  const toast = useToast();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    const storedReservations = SessionStorageManager.get<ClinicReservation[]>(SessionStorageKeys.CLINIC_RESERVATIONS, mockReservations);
    setReservations(storedReservations);
  };

  const handleViewReservation = (reservation: ClinicReservation) => {
    setSelectedReservation(reservation);
    setMemo(reservation.memo || '');
    onOpen();
  };

  const handleUpdateReservationStatus = (reservationId: string, newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    const updatedReservations = reservations.map(reservation => {
      if (reservation.id === reservationId) {
        const updatedReservation = {
          ...reservation,
          status: newStatus,
          confirmedAt: newStatus === 'confirmed' ? new Date().toISOString().split('T')[0] : reservation.confirmedAt,
          memo: memo || reservation.memo
        };
        return updatedReservation;
      }
      return reservation;
    });

    setReservations(updatedReservations);
    SessionStorageManager.set(SessionStorageKeys.CLINIC_RESERVATIONS, updatedReservations);
    onUpdate();

    const statusText = {
      confirmed: '확정',
      completed: '완료',
      cancelled: '취소'
    };

    toast({
      title: `예약이 '${statusText[newStatus]}'로 변경되었습니다`,
      status: 'success',
      duration: 2000,
    });

    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'confirmed':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'confirmed':
        return '확정';
      case 'completed':
        return '완료';
      case 'cancelled':
        return '취소';
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    return type === 'individual' ? '개별상담' : '그룹상담';
  };

  const filteredReservations = reservations.filter(reservation => {
    const statusMatch = statusFilter === 'all' || reservation.status === statusFilter;
    const dateMatch = dateFilter === 'all' || 
      (dateFilter === 'today' && reservation.date === new Date().toISOString().split('T')[0]) ||
      (dateFilter === 'week' && new Date(reservation.date) >= new Date() && new Date(reservation.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    return statusMatch && dateMatch;
  });

  const pendingCount = reservations.filter(r => r.status === 'pending').length;
  const confirmedCount = reservations.filter(r => r.status === 'confirmed').length;
  const todayCount = reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length;

  const sortedReservations = filteredReservations.sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.time);
    const dateB = new Date(b.date + ' ' + b.time);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="white">
          클리닉 예약 관리 ({reservations.length}건)
        </Text>
        <HStack spacing={4}>
          <Badge colorScheme="orange" fontSize="sm" p={2}>
            대기중: {pendingCount}건
          </Badge>
          <Badge colorScheme="blue" fontSize="sm" p={2}>
            확정: {confirmedCount}건
          </Badge>
          <Badge colorScheme="green" fontSize="sm" p={2}>
            오늘: {todayCount}건
          </Badge>
        </HStack>
      </HStack>

      {/* 통계 카드 */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4} mb={6}>
        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center">
              <Text color="gray.300" fontSize="sm">총 예약</Text>
              <Text color="#7A5AF8" fontSize="2xl" fontWeight="bold">
                {reservations.length}건
              </Text>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center">
              <Text color="gray.300" fontSize="sm">대기중</Text>
              <Text color="orange.400" fontSize="2xl" fontWeight="bold">
                {pendingCount}건
              </Text>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center">
              <Text color="gray.300" fontSize="sm">확정된 예약</Text>
              <Text color="blue.400" fontSize="2xl" fontWeight="bold">
                {confirmedCount}건
              </Text>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center">
              <Text color="gray.300" fontSize="sm">오늘 예약</Text>
              <Text color="green.400" fontSize="2xl" fontWeight="bold">
                {todayCount}건
              </Text>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* 필터 */}
      <Card bg="gray.800" border="1px solid" borderColor="gray.600" mb={6}>
        <CardBody>
          <HStack spacing={4} wrap="wrap">
            <Box>
              <Text fontSize="sm" color="gray.300" mb={1}>상태 필터</Text>
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
                <option value="confirmed">확정</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소</option>
              </Select>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.300" mb={1}>날짜 필터</Text>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                bg="gray.700"
                borderColor="gray.600"
                color="white"
                size="sm"
                w="150px"
              >
                <option value="all">전체</option>
                <option value="today">오늘</option>
                <option value="week">이번 주</option>
              </Select>
            </Box>
          </HStack>
        </CardBody>
      </Card>

      {/* 예약 목록 */}
      <Card bg="gray.800" border="1px solid" borderColor="gray.600">
        <CardBody>
          {sortedReservations.length > 0 ? (
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th color="gray.300" borderColor="gray.600">학생</Th>
                    <Th color="gray.300" borderColor="gray.600">학교/학년</Th>
                    <Th color="gray.300" borderColor="gray.600">날짜/시간</Th>
                    <Th color="gray.300" borderColor="gray.600">유형</Th>
                    <Th color="gray.300" borderColor="gray.600">과목</Th>
                    <Th color="gray.300" borderColor="gray.600">상태</Th>
                    <Th color="gray.300" borderColor="gray.600">요청일</Th>
                    <Th color="gray.300" borderColor="gray.600">관리</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedReservations.map((reservation) => (
                    <Tr key={reservation.id}>
                      <Td color="white" borderColor="gray.600">
                        <Badge colorScheme="blue" size="sm">
                          {reservation.studentName}
                        </Badge>
                      </Td>
                      <Td color="gray.300" borderColor="gray.600" fontSize="sm">
                        {reservation.school}<br/>{reservation.grade}학년
                      </Td>
                      <Td color="white" borderColor="gray.600" fontSize="sm">
                        <VStack spacing={1} align="start">
                          <Text>{reservation.date}</Text>
                          <Text color="gray.400">{reservation.time}</Text>
                        </VStack>
                      </Td>
                      <Td color="gray.300" borderColor="gray.600" fontSize="sm">
                        <Badge colorScheme={reservation.type === 'individual' ? 'purple' : 'cyan'} size="sm">
                          {getTypeText(reservation.type)}
                        </Badge>
                      </Td>
                      <Td color="white" borderColor="gray.600" fontSize="sm">
                        {reservation.subject}
                      </Td>
                      <Td borderColor="gray.600">
                        <Badge colorScheme={getStatusColor(reservation.status)} size="sm">
                          {getStatusText(reservation.status)}
                        </Badge>
                      </Td>
                      <Td color="gray.300" borderColor="gray.600" fontSize="sm">
                        {reservation.createdAt}
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
                            onClick={() => handleViewReservation(reservation)}
                          />
                          {reservation.status === 'pending' && (
                            <>
                              <IconButton
                                aria-label="확정"
                                icon={<CheckIcon />}
                                size="xs"
                                variant="outline"
                                borderColor="blue.600"
                                color="blue.400"
                                _hover={{ bg: "blue.900" }}
                                onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmed')}
                              />
                              <IconButton
                                aria-label="취소"
                                icon={<CloseIcon />}
                                size="xs"
                                variant="outline"
                                borderColor="red.600"
                                color="red.400"
                                _hover={{ bg: "red.900" }}
                                onClick={() => handleUpdateReservationStatus(reservation.id, 'cancelled')}
                              />
                            </>
                          )}
                          {reservation.status === 'confirmed' && (
                            <IconButton
                              aria-label="완료"
                              icon={<CalendarIcon />}
                              size="xs"
                              variant="outline"
                              borderColor="green.600"
                              color="green.400"
                              _hover={{ bg: "green.900" }}
                              onClick={() => handleUpdateReservationStatus(reservation.id, 'completed')}
                            />
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
              해당 조건에 맞는 예약이 없습니다.
            </Alert>
          )}
        </CardBody>
      </Card>

      {/* 예약 상세 정보 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white" mx={4}>
          <ModalHeader color="#7A5AF8">
            클리닉 예약 상세 정보
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedReservation && (
              <VStack spacing={4} align="stretch">
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>학생명</Text>
                    <Text fontWeight="bold">{selectedReservation.studentName}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>학교/학년</Text>
                    <Text>{selectedReservation.school} {selectedReservation.grade}학년</Text>
                  </Box>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>예약 날짜</Text>
                    <Text fontWeight="bold" color="blue.400">{selectedReservation.date}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>예약 시간</Text>
                    <Text fontWeight="bold" color="blue.400">{selectedReservation.time}</Text>
                  </Box>
                </Grid>

                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>상담 유형</Text>
                    <Badge colorScheme={selectedReservation.type === 'individual' ? 'purple' : 'cyan'}>
                      {getTypeText(selectedReservation.type)}
                    </Badge>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>과목</Text>
                    <Text fontWeight="bold">{selectedReservation.subject}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>상태</Text>
                    <Badge colorScheme={getStatusColor(selectedReservation.status)}>
                      {getStatusText(selectedReservation.status)}
                    </Badge>
                  </Box>
                </Grid>

                <Box>
                  <Text fontSize="sm" color="gray.300" mb={1}>상담 요청 내용</Text>
                  <Box bg="gray.700" p={3} borderRadius="md">
                    <Text fontSize="sm" lineHeight="1.5">
                      {selectedReservation.description}
                    </Text>
                  </Box>
                </Box>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.300" mb={1}>요청일</Text>
                    <Text>{selectedReservation.createdAt}</Text>
                  </Box>
                  {selectedReservation.confirmedAt && (
                    <Box>
                      <Text fontSize="sm" color="gray.300" mb={1}>확정일</Text>
                      <Text color="green.400">{selectedReservation.confirmedAt}</Text>
                    </Box>
                  )}
                </Grid>

                <Box>
                  <Text fontSize="sm" color="gray.300" mb={2}>관리자 메모</Text>
                  <Textarea
                    placeholder="상담 관련 메모를 입력하세요..."
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    bg="gray.700"
                    borderColor="gray.600"
                    _focus={{ borderColor: "#7A5AF8" }}
                    size="sm"
                    rows={4}
                  />
                </Box>

                {selectedReservation.status === 'pending' && (
                  <HStack spacing={2}>
                    <Button
                      bg="blue.600"
                      color="white"
                      _hover={{ bg: "blue.500" }}
                      onClick={() => handleUpdateReservationStatus(selectedReservation.id, 'confirmed')}
                      flex={1}
                    >
                      예약 확정
                    </Button>
                    <Button
                      bg="red.600"
                      color="white"
                      _hover={{ bg: "red.500" }}
                      onClick={() => handleUpdateReservationStatus(selectedReservation.id, 'cancelled')}
                      flex={1}
                    >
                      예약 취소
                    </Button>
                  </HStack>
                )}

                {selectedReservation.status === 'confirmed' && (
                  <Button
                    bg="green.600"
                    color="white"
                    _hover={{ bg: "green.500" }}
                    onClick={() => handleUpdateReservationStatus(selectedReservation.id, 'completed')}
                  >
                    상담 완료 처리
                  </Button>
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