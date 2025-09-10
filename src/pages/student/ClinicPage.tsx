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
  Select,
  Textarea,
  Divider
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

interface ClinicSlot {
  id: string;
  date: string;
  time: string;
  isAvailable: boolean;
  reservedBy?: string;
  description?: string;
}

interface ClinicReservation {
  id: string;
  studentId: string;
  date: string;
  time: string;
  subject: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const mockClinicSlots: ClinicSlot[] = [
  { id: '1', date: '2024-03-18', time: '14:00', isAvailable: true },
  { id: '2', date: '2024-03-18', time: '15:00', isAvailable: false, reservedBy: '김○○' },
  { id: '3', date: '2024-03-18', time: '16:00', isAvailable: true },
  { id: '4', date: '2024-03-19', time: '14:00', isAvailable: true },
  { id: '5', date: '2024-03-19', time: '15:00', isAvailable: true },
  { id: '6', date: '2024-03-19', time: '16:00', isAvailable: false, reservedBy: '이○○' },
  { id: '7', date: '2024-03-20', time: '14:00', isAvailable: true },
  { id: '8', date: '2024-03-20', time: '15:00', isAvailable: true },
  { id: '9', date: '2024-03-20', time: '16:00', isAvailable: true },
  { id: '10', date: '2024-03-21', time: '14:00', isAvailable: false, reservedBy: '박○○' },
  { id: '11', date: '2024-03-21', time: '15:00', isAvailable: true },
  { id: '12', date: '2024-03-21', time: '16:00', isAvailable: true },
];

const mockReservations: ClinicReservation[] = [
  {
    id: '1',
    studentId: '1',
    date: '2024-03-15',
    time: '15:00',
    subject: '문학 작품 분석',
    description: '현대소설 주제의식 파악이 어려워요.',
    status: 'completed'
  }
];

export const ClinicPage: React.FC = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSlot, setSelectedSlot] = useState<ClinicSlot | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [reservations, setReservations] = useState<ClinicReservation[]>(mockReservations);
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

  const userReservations = reservations.filter(r => r.studentId === user.id);

  const handleSlotClick = (slot: ClinicSlot) => {
    if (!slot.isAvailable) return;
    setSelectedSlot(slot);
    onOpen();
  };

  const handleReservation = () => {
    if (!selectedSlot || !subject.trim() || !description.trim()) {
      toast({
        title: '모든 항목을 입력해주세요',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    const newReservation: ClinicReservation = {
      id: Date.now().toString(),
      studentId: user.id,
      date: selectedSlot.date,
      time: selectedSlot.time,
      subject: subject.trim(),
      description: description.trim(),
      status: 'pending'
    };

    setReservations([...reservations, newReservation]);
    setSubject('');
    setDescription('');
    onClose();
    
    toast({
      title: '클리닉 예약이 완료되었습니다',
      description: '예약 확인 후 문자로 안내드립니다.',
      status: 'success',
      duration: 4000,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];
    return `${month}월 ${day}일 (${dayOfWeek})`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge colorScheme="yellow">대기중</Badge>;
      case 'confirmed': return <Badge colorScheme="blue">확정</Badge>;
      case 'completed': return <Badge colorScheme="green">완료</Badge>;
      case 'cancelled': return <Badge colorScheme="red">취소됨</Badge>;
      default: return <Badge>알 수 없음</Badge>;
    }
  };

  // 날짜별로 그룹화
  const groupedSlots = mockClinicSlots.reduce((groups, slot) => {
    const date = slot.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {} as Record<string, ClinicSlot[]>);

  return (
    <Box maxW="1200px" mx="auto" p={6} bg="gray.900" minH="100vh" color="white">
      <VStack spacing={6} align="stretch">
        <Text fontSize="3xl" fontWeight="bold" color="#7A5AF8">
          클리닉 일정표 및 신청
        </Text>

        <Alert status="info" bg="blue.800" color="white">
          <AlertIcon />
          1:1 개별 클리닉을 통해 궁금한 점을 자세히 설명해드립니다. 원하는 시간을 선택해 예약하세요.
        </Alert>

        {/* 내 예약 현황 */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="#7A5AF8" mb={4}>
            내 예약 현황
          </Text>
          {userReservations.length > 0 ? (
            <VStack spacing={3} align="stretch">
              {userReservations.map((reservation) => (
                <Card key={reservation.id} bg="gray.800" border="1px solid" borderColor="gray.600">
                  <CardBody>
                    <Grid templateColumns="1fr auto" gap={4} alignItems="center">
                      <VStack align="stretch" spacing={2}>
                        <HStack>
                          <Text fontWeight="bold" color="white">
                            {formatDate(reservation.date)} {reservation.time}
                          </Text>
                          {getStatusBadge(reservation.status)}
                        </HStack>
                        <Text fontSize="sm" color="gray.300">
                          주제: {reservation.subject}
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          {reservation.description}
                        </Text>
                      </VStack>
                    </Grid>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          ) : (
            <Card bg="gray.800" border="1px solid" borderColor="gray.600">
              <CardBody textAlign="center" py={8}>
                <Text color="gray.400">예약된 클리닉이 없습니다.</Text>
              </CardBody>
            </Card>
          )}
        </Box>

        {/* 예약 가능한 시간 */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="#7A5AF8" mb={4}>
            예약 가능한 시간
          </Text>
          <VStack spacing={4} align="stretch">
            {Object.entries(groupedSlots).map(([date, slots]) => (
              <Card key={date} bg="gray.800" border="1px solid" borderColor="gray.600">
                <CardBody>
                  <Text fontWeight="bold" color="white" mb={4}>
                    {formatDate(date)}
                  </Text>
                  <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={3}>
                    {slots.map((slot) => (
                      <Button
                        key={slot.id}
                        onClick={() => handleSlotClick(slot)}
                        bg={slot.isAvailable ? "gray.700" : "gray.600"}
                        color={slot.isAvailable ? "white" : "gray.400"}
                        _hover={slot.isAvailable ? { bg: "#7A5AF8" } : {}}
                        cursor={slot.isAvailable ? "pointer" : "not-allowed"}
                        size="sm"
                        variant="solid"
                        disabled={!slot.isAvailable}
                      >
                        {slot.time}
                        {!slot.isAvailable && (
                          <Text fontSize="xs" ml={1}>(예약됨)</Text>
                        )}
                      </Button>
                    ))}
                  </Grid>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </Box>
      </VStack>

      {/* 예약 신청 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white" mx={4}>
          <ModalHeader color="#7A5AF8">클리닉 예약 신청</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Box w="100%" bg="gray.700" p={4} borderRadius="md">
                <Text fontWeight="bold" mb={2}>선택한 시간</Text>
                <Text color="#7A5AF8">
                  {selectedSlot && `${formatDate(selectedSlot.date)} ${selectedSlot.time}`}
                </Text>
              </Box>

              <Box w="100%">
                <Text mb={2} fontWeight="semibold">
                  클리닉 주제 선택
                </Text>
                <Select 
                  placeholder="주제를 선택하세요"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  bg="gray.700"
                  color="white"
                  borderColor="gray.600"
                  _focus={{ borderColor: "#7A5AF8" }}
                >
                  <option value="문학 작품 분석">문학 작품 분석</option>
                  <option value="독서 문제 풀이">독서 문제 풀이</option>
                  <option value="문법 개념 설명">문법 개념 설명</option>
                  <option value="작문 첨삭">작문 첨삭</option>
                  <option value="수능 문제 해설">수능 문제 해설</option>
                  <option value="기타">기타</option>
                </Select>
              </Box>

              <Box w="100%">
                <Text mb={2} fontWeight="semibold">
                  상세 내용
                </Text>
                <Textarea
                  placeholder="궁금한 점이나 도움이 필요한 내용을 자세히 적어주세요."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  minH="100px"
                  bg="gray.700"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                  borderColor="gray.600"
                  _focus={{ borderColor: "#7A5AF8" }}
                />
              </Box>
              
              <HStack w="100%" spacing={3}>
                <Button 
                  onClick={onClose} 
                  variant="outline" 
                  borderColor="gray.600" 
                  color="white" 
                  _hover={{ bg: "gray.700" }} 
                  flex={1}
                >
                  취소
                </Button>
                <Button 
                  bg="#7A5AF8"
                  color="white"
                  _hover={{ bg: "#6B4CE6" }}
                  onClick={handleReservation}
                  flex={1}
                >
                  예약 신청
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};