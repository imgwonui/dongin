import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
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
  AlertDialogFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { User, StudentProfile } from '../../data/users';

interface AdminStudentManagerProps {
  onUpdate: () => void;
}

interface StudentData extends User {
  profile: StudentProfile;
}

export const AdminStudentManager: React.FC<AdminStudentManagerProps> = ({ onUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
  const [deleteStudentId, setDeleteStudentId] = useState<string>('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    school: '',
    grade: 2,
    academy: '이동인국어학원',
    schedule: ''
  });
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const schools = ['서울고등학교', '강남고등학교', '중앙고등학교', '명덕고등학교', '대치고등학교'];
  const grades = [1, 2, 3];
  const schedules = [
    '월요일 18:00-20:00',
    '화요일 18:00-20:00',
    '수요일 18:00-20:00',
    '목요일 18:00-20:00',
    '금요일 18:00-20:00',
    '토요일 14:00-16:00',
    '토요일 16:00-18:00',
    '일요일 14:00-16:00',
    '일요일 16:00-18:00'
  ];

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const storedUsers = JSON.parse(localStorage.getItem('dongin_users') || '[]');
    const studentUsers = storedUsers.filter((user: User) => user.role === 'student');
    setStudents(studentUsers);
  };

  const saveStudents = (updatedStudents: StudentData[]) => {
    const storedUsers = JSON.parse(localStorage.getItem('dongin_users') || '[]');
    const adminUsers = storedUsers.filter((user: User) => user.role === 'admin');
    const allUsers = [...adminUsers, ...updatedStudents];
    localStorage.setItem('dongin_users', JSON.stringify(allUsers));
  };

  const handleSubmit = () => {
    if (!formData.username.trim() || !formData.password.trim() || !formData.name.trim() || !formData.school || !formData.schedule) {
      toast({
        title: '모든 필드를 입력해주세요',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    // 중복 아이디 체크
    const existingUser = students.find(student => 
      student.username === formData.username.trim() && student.id !== editingStudent?.id
    );
    
    if (existingUser) {
      toast({
        title: '이미 존재하는 아이디입니다',
        status: 'error',
        duration: 2000,
      });
      return;
    }

    const newStudent: StudentData = {
      id: editingStudent?.id || Date.now().toString(),
      username: formData.username.trim(),
      password: formData.password,
      role: 'student',
      profile: {
        name: formData.name.trim(),
        school: formData.school,
        grade: formData.grade,
        academy: formData.academy,
        schedule: formData.schedule
      }
    };

    let updatedStudents;
    if (editingStudent) {
      updatedStudents = students.map(student => 
        student.id === editingStudent.id ? newStudent : student
      );
    } else {
      updatedStudents = [newStudent, ...students];
    }

    setStudents(updatedStudents);
    saveStudents(updatedStudents);
    
    resetForm();
    onClose();
    onUpdate();
    
    toast({
      title: editingStudent ? '학생 정보가 수정되었습니다' : '학생이 등록되었습니다',
      status: 'success',
      duration: 2000,
    });
  };

  const handleEdit = (student: StudentData) => {
    setEditingStudent(student);
    setFormData({
      username: student.username,
      password: student.password,
      name: student.profile.name,
      school: student.profile.school,
      grade: student.profile.grade,
      academy: student.profile.academy,
      schedule: student.profile.schedule
    });
    onOpen();
  };

  const handleDelete = (studentId: string) => {
    setDeleteStudentId(studentId);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    const updatedStudents = students.filter(student => student.id !== deleteStudentId);
    setStudents(updatedStudents);
    saveStudents(updatedStudents);
    
    onDeleteClose();
    onUpdate();
    
    toast({
      title: '학생이 삭제되었습니다',
      status: 'success',
      duration: 2000,
    });
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      name: '',
      school: '',
      grade: 2,
      academy: '이동인국어학원',
      schedule: ''
    });
    setEditingStudent(null);
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="white">
          학생 관리 ({students.length}명)
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
          새 학생 등록
        </Button>
      </HStack>

      {/* 통계 카드 */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mb={6}>
        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center">
              <Text color="gray.300" fontSize="sm">총 학생 수</Text>
              <Text color="#7A5AF8" fontSize="2xl" fontWeight="bold">
                {students.length}명
              </Text>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center">
              <Text color="gray.300" fontSize="sm">고3 학생</Text>
              <Text color="red.400" fontSize="2xl" fontWeight="bold">
                {students.filter(s => s.profile.grade === 3).length}명
              </Text>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center">
              <Text color="gray.300" fontSize="sm">고2 학생</Text>
              <Text color="blue.400" fontSize="2xl" fontWeight="bold">
                {students.filter(s => s.profile.grade === 2).length}명
              </Text>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* 학생 목록 */}
      <Card bg="gray.800" border="1px solid" borderColor="gray.600">
        <CardBody>
          {students.length > 0 ? (
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th color="gray.300" borderColor="gray.600">아이디</Th>
                    <Th color="gray.300" borderColor="gray.600">이름</Th>
                    <Th color="gray.300" borderColor="gray.600">학교</Th>
                    <Th color="gray.300" borderColor="gray.600">학년</Th>
                    <Th color="gray.300" borderColor="gray.600">수강 시간</Th>
                    <Th color="gray.300" borderColor="gray.600">관리</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {students.map((student) => (
                    <Tr key={student.id}>
                      <Td color="white" borderColor="gray.600" fontWeight="bold">
                        {student.username}
                      </Td>
                      <Td color="white" borderColor="gray.600">
                        <Badge colorScheme="blue" size="sm">
                          {student.profile.name}
                        </Badge>
                      </Td>
                      <Td color="gray.300" borderColor="gray.600" fontSize="sm">
                        {student.profile.school}
                      </Td>
                      <Td borderColor="gray.600">
                        <Badge colorScheme={
                          student.profile.grade === 3 ? 'red' :
                          student.profile.grade === 2 ? 'blue' : 'green'
                        } size="sm">
                          {student.profile.grade}학년
                        </Badge>
                      </Td>
                      <Td color="gray.300" borderColor="gray.600" fontSize="sm">
                        {student.profile.schedule}
                      </Td>
                      <Td borderColor="gray.600">
                        <HStack spacing={1}>
                          <IconButton
                            aria-label="수정"
                            icon={<EditIcon />}
                            size="xs"
                            variant="outline"
                            borderColor="gray.600"
                            color="white"
                            _hover={{ bg: "gray.600" }}
                            onClick={() => handleEdit(student)}
                          />
                          <IconButton
                            aria-label="삭제"
                            icon={<DeleteIcon />}
                            size="xs"
                            variant="outline"
                            borderColor="red.600"
                            color="red.400"
                            _hover={{ bg: "red.900" }}
                            onClick={() => handleDelete(student.id)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ) : (
            <Text color="gray.400" textAlign="center" py={8}>
              등록된 학생이 없습니다.
            </Text>
          )}
        </CardBody>
      </Card>

      {/* 학생 등록/수정 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white" mx={4}>
          <ModalHeader color="#7A5AF8">
            {editingStudent ? '학생 정보 수정' : '새 학생 등록'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="100%">
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>아이디</FormLabel>
                    <Input
                      placeholder="학생 아이디"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      bg="gray.700"
                      borderColor="gray.600"
                      _focus={{ borderColor: "#7A5AF8" }}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>비밀번호</FormLabel>
                    <Input
                      type="password"
                      placeholder="비밀번호"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      bg="gray.700"
                      borderColor="gray.600"
                      _focus={{ borderColor: "#7A5AF8" }}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>이름</FormLabel>
                    <Input
                      placeholder="학생 이름"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      bg="gray.700"
                      borderColor="gray.600"
                      _focus={{ borderColor: "#7A5AF8" }}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>학년</FormLabel>
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
                  </FormControl>
                </GridItem>

                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <FormControl isRequired>
                    <FormLabel>학교</FormLabel>
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
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl>
                    <FormLabel>수강 학원</FormLabel>
                    <Input
                      value={formData.academy}
                      onChange={(e) => setFormData({ ...formData, academy: e.target.value })}
                      bg="gray.700"
                      borderColor="gray.600"
                      _focus={{ borderColor: "#7A5AF8" }}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>수강 시간</FormLabel>
                    <Select
                      placeholder="수강 시간 선택"
                      value={formData.schedule}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      bg="gray.700"
                      borderColor="gray.600"
                      _focus={{ borderColor: "#7A5AF8" }}
                    >
                      {schedules.map(schedule => (
                        <option key={schedule} value={schedule}>{schedule}</option>
                      ))}
                    </Select>
                  </FormControl>
                </GridItem>
              </Grid>

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
                  {editingStudent ? '수정' : '등록'}
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
              학생 삭제
            </AlertDialogHeader>
            <AlertDialogBody>
              정말로 이 학생을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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