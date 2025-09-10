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
  useDisclosure,
  useToast,
  Grid,
  GridItem,
  Textarea,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  IconButton,
  Divider
} from '@chakra-ui/react';
import { ViewIcon, CheckIcon, DeleteIcon } from '@chakra-ui/icons';
import { SessionStorageManager, SessionStorageKeys } from '../../utils/sessionStorage';

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

interface AdminQnAManagerProps {
  onUpdate: () => void;
}

export const AdminQnAManager: React.FC<AdminQnAManagerProps> = ({ onUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [qnaItems, setQnaItems] = useState<QnAItem[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<QnAItem | null>(null);
  const [answer, setAnswer] = useState('');
  const [deleteQuestionId, setDeleteQuestionId] = useState<string>('');
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loadQnAItems();
  }, []);

  const loadQnAItems = () => {
    const storedQnA = SessionStorageManager.get<QnAItem[]>(SessionStorageKeys.QNA, []);
    setQnaItems(storedQnA);
  };

  const handleAnswerQuestion = (qnaItem: QnAItem) => {
    setSelectedQuestion(qnaItem);
    setAnswer(qnaItem.answer || '');
    onOpen();
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      toast({
        title: '답변을 입력해주세요',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    if (!selectedQuestion) return;

    const updatedQnAItems = qnaItems.map(item =>
      item.id === selectedQuestion.id
        ? {
            ...item,
            answer: answer.trim(),
            answeredAt: new Date().toISOString().split('T')[0]
          }
        : item
    );

    setQnaItems(updatedQnAItems);
    SessionStorageManager.set(SessionStorageKeys.QNA, updatedQnAItems);
    
    setAnswer('');
    onClose();
    onUpdate();
    
    toast({
      title: '답변이 등록되었습니다',
      status: 'success',
      duration: 2000,
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    setDeleteQuestionId(questionId);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    const updatedQnAItems = qnaItems.filter(item => item.id !== deleteQuestionId);
    setQnaItems(updatedQnAItems);
    SessionStorageManager.set(SessionStorageKeys.QNA, updatedQnAItems);
    
    onDeleteClose();
    onUpdate();
    
    toast({
      title: '질문이 삭제되었습니다',
      status: 'success',
      duration: 2000,
    });
  };

  const unansweredQuestions = qnaItems.filter(item => !item.answer);
  const answeredQuestions = qnaItems.filter(item => item.answer);

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="white">
          질의응답 관리 (총 {qnaItems.length}개)
        </Text>
        <HStack spacing={4}>
          <Badge colorScheme="orange" fontSize="sm" p={2}>
            미답변: {unansweredQuestions.length}개
          </Badge>
          <Badge colorScheme="green" fontSize="sm" p={2}>
            답변완료: {answeredQuestions.length}개
          </Badge>
        </HStack>
      </HStack>

      <VStack spacing={6} align="stretch">
        {/* 미답변 질문들 */}
        {unansweredQuestions.length > 0 && (
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="orange.400" mb={4}>
              🔔 미답변 질문 ({unansweredQuestions.length}개)
            </Text>
            <VStack spacing={4} align="stretch">
              {unansweredQuestions.map((item) => (
                <Card key={item.id} bg="orange.900" border="2px solid" borderColor="orange.600">
                  <CardBody>
                    <Grid templateColumns="1fr auto" gap={4}>
                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <Badge colorScheme="orange">미답변</Badge>
                          <Badge colorScheme="blue">{item.studentName}</Badge>
                          <Badge colorScheme="gray">익명</Badge>
                        </HStack>
                        <Text fontSize="lg" fontWeight="bold" color="white">
                          Q. {item.question}
                        </Text>
                        <Text fontSize="sm" color="gray.300">
                          질문일: {item.createdAt}
                        </Text>
                      </VStack>
                      <VStack spacing={2}>
                        <Button
                          leftIcon={<CheckIcon />}
                          bg="#7A5AF8"
                          color="white"
                          _hover={{ bg: "#6B4CE6" }}
                          size="sm"
                          onClick={() => handleAnswerQuestion(item)}
                        >
                          답변하기
                        </Button>
                        <IconButton
                          aria-label="삭제"
                          icon={<DeleteIcon />}
                          size="sm"
                          variant="outline"
                          borderColor="red.600"
                          color="red.400"
                          _hover={{ bg: "red.900" }}
                          onClick={() => handleDeleteQuestion(item.id)}
                        />
                      </VStack>
                    </Grid>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>
        )}

        {/* 답변완료 질문들 */}
        {answeredQuestions.length > 0 && (
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="green.400" mb={4}>
              ✅ 답변완료 질문 ({answeredQuestions.length}개)
            </Text>
            <VStack spacing={4} align="stretch">
              {answeredQuestions.map((item) => (
                <Card key={item.id} bg="gray.700" border="1px solid" borderColor="gray.600">
                  <CardBody>
                    <Grid templateColumns="1fr auto" gap={4}>
                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <Badge colorScheme="green">답변완료</Badge>
                          <Badge colorScheme="blue">{item.studentName}</Badge>
                          <Badge colorScheme="gray">익명</Badge>
                        </HStack>
                        <Text fontSize="lg" fontWeight="bold" color="white">
                          Q. {item.question}
                        </Text>
                        <Box bg="green.900" p={3} borderRadius="md" border="1px solid" borderColor="green.600">
                          <Text fontSize="sm" fontWeight="bold" color="green.300" mb={2}>
                            👨‍🏫 이동인 선생님의 답변:
                          </Text>
                          <Text color="white" lineHeight="1.5">
                            {item.answer}
                          </Text>
                        </Box>
                        <HStack fontSize="sm" color="gray.400">
                          <Text>질문일: {item.createdAt}</Text>
                          <Text>•</Text>
                          <Text>답변일: {item.answeredAt}</Text>
                        </HStack>
                      </VStack>
                      <VStack spacing={2}>
                        <IconButton
                          aria-label="답변 수정"
                          icon={<ViewIcon />}
                          size="sm"
                          variant="outline"
                          borderColor="gray.600"
                          color="white"
                          _hover={{ bg: "gray.600" }}
                          onClick={() => handleAnswerQuestion(item)}
                        />
                        <IconButton
                          aria-label="삭제"
                          icon={<DeleteIcon />}
                          size="sm"
                          variant="outline"
                          borderColor="red.600"
                          color="red.400"
                          _hover={{ bg: "red.900" }}
                          onClick={() => handleDeleteQuestion(item.id)}
                        />
                      </VStack>
                    </Grid>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>
        )}

        {qnaItems.length === 0 && (
          <Card bg="gray.700" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center" py={12}>
              <Text color="gray.400">등록된 질문이 없습니다.</Text>
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* 답변 작성/수정 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white" mx={4}>
          <ModalHeader color="#7A5AF8">
            {selectedQuestion?.answer ? '답변 수정' : '답변 작성'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              {/* 질문 표시 */}
              <Box bg="gray.700" p={4} borderRadius="md">
                <Text fontSize="sm" color="gray.300" mb={2}>
                  {selectedQuestion?.studentName} 학생의 질문:
                </Text>
                <Text fontWeight="bold" color="white">
                  {selectedQuestion?.question}
                </Text>
                <Text fontSize="sm" color="gray.400" mt={2}>
                  질문일: {selectedQuestion?.createdAt}
                </Text>
              </Box>

              <Divider borderColor="gray.600" />

              {/* 답변 작성 */}
              <Box>
                <Text mb={3} fontWeight="semibold" color="#7A5AF8">
                  👨‍🏫 이동인 선생님의 답변
                </Text>
                <Textarea
                  placeholder="학생의 질문에 대한 답변을 작성해주세요..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  minH="150px"
                  bg="gray.700"
                  borderColor="gray.600"
                  _focus={{ borderColor: "#7A5AF8" }}
                  _placeholder={{ color: "gray.400" }}
                />
              </Box>

              <HStack spacing={3}>
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
                  onClick={handleSubmitAnswer}
                  flex={1}
                >
                  {selectedQuestion?.answer ? '답변 수정' : '답변 등록'}
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" color="white" mx={4}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="#7A5AF8">
              질문 삭제
            </AlertDialogHeader>
            <AlertDialogBody>
              정말로 이 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose} variant="outline" borderColor="gray.600" color="white">
                취소
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};