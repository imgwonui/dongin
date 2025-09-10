import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Textarea,
  Select,
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
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { SessionStorageManager, SessionStorageKeys } from '../../utils/sessionStorage';

interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: 'general' | 'school';
  school?: string;
  grade?: number;
}

interface AdminNoticeManagerProps {
  onUpdate: () => void;
}

export const AdminNoticeManager: React.FC<AdminNoticeManagerProps> = ({ onUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deleteNoticeId, setDeleteNoticeId] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general' as 'general' | 'school',
    school: '',
    grade: 2
  });
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const schools = ['서울고등학교', '강남고등학교', '중앙고등학교'];
  const grades = [1, 2, 3];

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = () => {
    const storedNotices = SessionStorageManager.get<Notice[]>(SessionStorageKeys.NOTICES, []);
    setNotices(storedNotices);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: '모든 필드를 입력해주세요',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    if (formData.category === 'school' && !formData.school) {
      toast({
        title: '학교를 선택해주세요',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    const newNotice: Notice = {
      id: editingNotice?.id || Date.now().toString(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      author: '이동인',
      createdAt: editingNotice?.createdAt || new Date().toISOString().split('T')[0],
      category: formData.category,
      ...(formData.category === 'school' && {
        school: formData.school,
        grade: formData.grade
      })
    };

    let updatedNotices;
    if (editingNotice) {
      updatedNotices = notices.map(notice => 
        notice.id === editingNotice.id ? newNotice : notice
      );
    } else {
      updatedNotices = [newNotice, ...notices];
    }

    setNotices(updatedNotices);
    SessionStorageManager.set(SessionStorageKeys.NOTICES, updatedNotices);
    
    resetForm();
    onClose();
    onUpdate();
    
    toast({
      title: editingNotice ? '공지사항이 수정되었습니다' : '공지사항이 등록되었습니다',
      status: 'success',
      duration: 2000,
    });
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      school: notice.school || '',
      grade: notice.grade || 2
    });
    onOpen();
  };

  const handleDelete = (noticeId: string) => {
    setDeleteNoticeId(noticeId);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    const updatedNotices = notices.filter(notice => notice.id !== deleteNoticeId);
    setNotices(updatedNotices);
    SessionStorageManager.set(SessionStorageKeys.NOTICES, updatedNotices);
    
    onDeleteClose();
    onUpdate();
    
    toast({
      title: '공지사항이 삭제되었습니다',
      status: 'success',
      duration: 2000,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'general',
      school: '',
      grade: 2
    });
    setEditingNotice(null);
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="white">
          공지사항 관리 ({notices.length}개)
        </Text>
        <Button
          leftIcon={<AddIcon />}
          bg="#7A5AF8"
          color="white"
          _hover={{ bg: "#6B4CE6" }}
          onClick={() => {
            resetForm();
            onOpen();
          }}
        >
          새 공지사항
        </Button>
      </HStack>

      <VStack spacing={4} align="stretch">
        {notices.map((notice) => (
          <Card key={notice.id} bg="gray.700" border="1px solid" borderColor="gray.600">
            <CardBody>
              <Grid templateColumns="1fr auto" gap={4}>
                <VStack align="stretch" spacing={2}>
                  <HStack>
                    <Text fontSize="lg" fontWeight="bold" color="white">
                      {notice.title}
                    </Text>
                    <Badge colorScheme={notice.category === 'general' ? 'purple' : 'blue'}>
                      {notice.category === 'general' ? '전체' : `${notice.school} ${notice.grade}학년`}
                    </Badge>
                  </HStack>
                  <Text color="gray.300" noOfLines={2}>
                    {notice.content}
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    작성: {notice.author} | {notice.createdAt}
                  </Text>
                </VStack>
                <HStack>
                  <IconButton
                    aria-label="수정"
                    icon={<EditIcon />}
                    size="sm"
                    variant="outline"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ bg: "gray.600" }}
                    onClick={() => handleEdit(notice)}
                  />
                  <IconButton
                    aria-label="삭제"
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="outline"
                    borderColor="red.600"
                    color="red.400"
                    _hover={{ bg: "red.900" }}
                    onClick={() => handleDelete(notice.id)}
                  />
                </HStack>
              </Grid>
            </CardBody>
          </Card>
        ))}

        {notices.length === 0 && (
          <Card bg="gray.700" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center" py={12}>
              <Text color="gray.400">등록된 공지사항이 없습니다.</Text>
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* 공지사항 작성/수정 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white" mx={4}>
          <ModalHeader color="#7A5AF8">
            {editingNotice ? '공지사항 수정' : '새 공지사항 작성'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Box w="100%">
                <Text mb={2} fontWeight="semibold">제목</Text>
                <Input
                  placeholder="공지사항 제목을 입력하세요"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  bg="gray.700"
                  borderColor="gray.600"
                  _focus={{ borderColor: "#7A5AF8" }}
                />
              </Box>

              <Box w="100%">
                <Text mb={2} fontWeight="semibold">분류</Text>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'general' | 'school' })}
                  bg="gray.700"
                  borderColor="gray.600"
                  _focus={{ borderColor: "#7A5AF8" }}
                >
                  <option value="general">전체 공지</option>
                  <option value="school">학교/학년별 공지</option>
                </Select>
              </Box>

              {formData.category === 'school' && (
                <Grid templateColumns="2fr 1fr" gap={4} w="100%">
                  <Box>
                    <Text mb={2} fontWeight="semibold">학교</Text>
                    <Select
                      placeholder="학교 선택"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      bg="gray.700"
                      borderColor="gray.600"
                      _focus={{ borderColor: "#7A5AF8" }}
                    >
                      {schools.map(school => (
                        <option key={school} value={school}>{school}</option>
                      ))}
                    </Select>
                  </Box>
                  <Box>
                    <Text mb={2} fontWeight="semibold">학년</Text>
                    <Select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) })}
                      bg="gray.700"
                      borderColor="gray.600"
                      _focus={{ borderColor: "#7A5AF8" }}
                    >
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}학년</option>
                      ))}
                    </Select>
                  </Box>
                </Grid>
              )}

              <Box w="100%">
                <Text mb={2} fontWeight="semibold">내용</Text>
                <Textarea
                  placeholder="공지사항 내용을 입력하세요"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  minH="150px"
                  bg="gray.700"
                  borderColor="gray.600"
                  _focus={{ borderColor: "#7A5AF8" }}
                />
              </Box>

              <HStack w="100%" spacing={3}>
                <Button 
                  onClick={() => {
                    resetForm();
                    onClose();
                  }} 
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
                  onClick={handleSubmit}
                  flex={1}
                >
                  {editingNotice ? '수정' : '등록'}
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
              공지사항 삭제
            </AlertDialogHeader>
            <AlertDialogBody>
              정말로 이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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