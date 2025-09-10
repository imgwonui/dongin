import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Textarea,
  useDisclosure,
  useToast,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { SessionStorageManager, SessionStorageKeys } from '../utils/sessionStorage';

interface QnAItem {
  id: string;
  question: string;
  answer?: string;
  author: string;
  studentName: string;
  createdAt: string;
  answeredAt?: string;
  isPrivate: boolean;
}

const mockQnA: QnAItem[] = [
  {
    id: '1',
    question: '문학 작품 분석할 때 어떤 부분에 집중해야 하나요?',
    answer: '작품의 화자, 상황, 정서, 화자의 의식 변화 등을 중심으로 분석하시길 바랍니다.',
    author: '익명',
    studentName: '김학생',
    createdAt: '2024-03-15',
    answeredAt: '2024-03-16',
    isPrivate: true
  },
  {
    id: '2',
    question: '독서 지문에서 빈칸추론 문제 푸는 방법이 궁금합니다.',
    author: '익명',
    studentName: '이학생',
    createdAt: '2024-03-14',
    isPrivate: true
  }
];

export const QnAPage: React.FC = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [question, setQuestion] = useState('');
  const [qnaList, setQnaList] = useState<QnAItem[]>([]);
  const toast = useToast();

  useEffect(() => {
    loadQnAData();
  }, []);

  const loadQnAData = () => {
    const storedQnA = SessionStorageManager.get<QnAItem[]>(SessionStorageKeys.QNA, []);
    setQnaList(storedQnA);
  };

  const handleSubmitQuestion = () => {
    if (!question.trim()) {
      toast({
        title: '질문을 입력해주세요',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    const newQuestion: QnAItem = {
      id: Date.now().toString(),
      question: question.trim(),
      author: '익명',
      studentName: user?.profile?.name || '학생',
      createdAt: new Date().toISOString().split('T')[0],
      isPrivate: true
    };

    const updatedQnA = [newQuestion, ...qnaList];
    setQnaList(updatedQnA);
    SessionStorageManager.set(SessionStorageKeys.QNA, updatedQnA);
    setQuestion('');
    onClose();
    
    toast({
      title: '질문이 등록되었습니다',
      description: '관리자가 검토 후 답변을 등록합니다.',
      status: 'success',
      duration: 3000,
    });
  };

  const handleAnswerQuestion = (id: string, answer: string) => {
    const updatedQnA = qnaList.map(item => 
      item.id === id ? { ...item, answer, answeredAt: new Date().toISOString().split('T')[0] } : item
    );
    setQnaList(updatedQnA);
    SessionStorageManager.set(SessionStorageKeys.QNA, updatedQnA);
  };

  if (!user) {
    return (
      <Box textAlign="center" py={20}>
        <Alert status="warning" maxW="md" mx="auto">
          <AlertIcon />
          로그인이 필요한 페이지입니다.
        </Alert>
      </Box>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" p={6} bg="gray.900" minH="100vh" color="white">
      <HStack justify="space-between" mb={8}>
        <Text fontSize="3xl" fontWeight="bold" color="#7A5AF8">
          질의응답
        </Text>
        {user.role === 'student' && (
          <Button 
            bg="#7A5AF8"
            color="white"
            _hover={{ bg: "#6B4CE6" }}
            onClick={onOpen}
          >
            질문하기
          </Button>
        )}
      </HStack>

      {user.role === 'student' && (
        <Alert status="info" mb={6} bg="blue.800" color="white">
          <AlertIcon />
          모든 질문은 익명으로 처리되며, 관리자만 실명을 확인할 수 있습니다.
        </Alert>
      )}

      <VStack spacing={4} align="stretch">
        {qnaList.map((item) => (
          <Card key={item.id} bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <HStack>
                      <Badge colorScheme="purple">질문</Badge>
                      {user.role === 'admin' && (
                        <Badge colorScheme="blue">
                          실명: {item.studentName}
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.400">
                      {item.createdAt}
                    </Text>
                  </HStack>
                  <Text color="white">{item.question}</Text>
                </Box>

                {item.answer ? (
                  <Box bg="gray.700" p={4} borderRadius="md">
                    <HStack justify="space-between" mb={2}>
                      <Badge colorScheme="green">답변</Badge>
                      <Text fontSize="sm" color="gray.300">
                        관리자 답변
                      </Text>
                    </HStack>
                    <Text color="white">{item.answer}</Text>
                  </Box>
                ) : (
                  user.role === 'admin' && (
                    <Box>
                      <AdminAnswerForm 
                        questionId={item.id}
                        onSubmit={(answer) => handleAnswerQuestion(item.id, answer)}
                      />
                    </Box>
                  )
                )}
              </VStack>
            </CardBody>
          </Card>
        ))}

        {qnaList.length === 0 && (
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center" py={12}>
              <Text color="gray.400">등록된 질문이 없습니다.</Text>
            </CardBody>
          </Card>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white" mx={4}>
          <ModalHeader color="#7A5AF8">질문하기</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Textarea
                placeholder="궁금한 점을 질문해보세요..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                minH="120px"
                bg="gray.700"
                color="white"
                _placeholder={{ color: "gray.400" }}
                borderColor="gray.600"
                _focus={{ borderColor: "#7A5AF8" }}
              />
              <HStack w="100%" spacing={3}>
                <Button onClick={onClose} variant="outline" borderColor="gray.600" color="white" _hover={{ bg: "gray.700" }} flex={1}>
                  취소
                </Button>
                <Button 
                  bg="#7A5AF8"
                  color="white"
                  _hover={{ bg: "#6B4CE6" }}
                  onClick={handleSubmitQuestion}
                  flex={1}
                >
                  등록
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

interface AdminAnswerFormProps {
  questionId: string;
  onSubmit: (answer: string) => void;
}

const AdminAnswerForm: React.FC<AdminAnswerFormProps> = ({ onSubmit }) => {
  const [answer, setAnswer] = useState('');
  const toast = useToast();

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast({
        title: '답변을 입력해주세요',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    onSubmit(answer.trim());
    setAnswer('');
    toast({
      title: '답변이 등록되었습니다',
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <VStack spacing={3} align="stretch">
      <Text fontWeight="semibold" color="#7A5AF8">답변 작성</Text>
      <Textarea
        placeholder="답변을 입력하세요..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        minH="80px"
        bg="gray.700"
        color="white"
        _placeholder={{ color: "gray.400" }}
        borderColor="gray.600"
        _focus={{ borderColor: "#7A5AF8" }}
      />
      <Button 
        bg="#7A5AF8"
        color="white"
        _hover={{ bg: "#6B4CE6" }}
        size="sm" 
        alignSelf="flex-end"
        onClick={handleSubmit}
      >
        답변 등록
      </Button>
    </VStack>
  );
};