import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Select,
  Button,
  useToast
} from '@chakra-ui/react';
import { SessionStorageManager, SessionStorageKeys } from '../../utils/sessionStorage';

interface TestResult {
  id: string;
  studentId: string;
  studentName: string;
  testName: string;
  score: number;
  rank: number;
  totalStudents: number;
  season: string;
  date: string;
  comment?: string;
}

interface Homework {
  id: string;
  studentId: string;
  studentName: string;
  week: number;
  totalProblems: number;
  solvedProblems: number;
  season: string;
  comment?: string;
}

interface AdminLearningDataManagerProps {
  onUpdate: () => void;
}

// 모의 학습 데이터
const mockTestResults: TestResult[] = [
  {
    id: '1',
    studentId: '1',
    studentName: '김학생',
    testName: '1회차 문학 테스트',
    score: 85,
    rank: 3,
    totalStudents: 25,
    season: '2024-1학기',
    date: '2024-03-10',
    comment: '문학 개념 이해도가 향상되었습니다.'
  },
  {
    id: '2',
    studentId: '1',
    studentName: '김학생',
    testName: '2회차 독서 테스트',
    score: 92,
    rank: 1,
    totalStudents: 25,
    season: '2024-1학기',
    date: '2024-03-17',
    comment: '독서 속도와 이해력이 크게 향상되었습니다.'
  },
  {
    id: '3',
    studentId: '2',
    studentName: '이학생',
    testName: '1회차 문학 테스트',
    score: 78,
    rank: 8,
    totalStudents: 25,
    season: '2024-1학기',
    date: '2024-03-10',
    comment: '기본기를 더 다져야 합니다.'
  },
  {
    id: '4',
    studentId: '3',
    studentName: '박학생',
    testName: '1회차 문학 테스트',
    score: 95,
    rank: 1,
    totalStudents: 25,
    season: '2024-1학기',
    date: '2024-03-10',
    comment: '매우 우수합니다!'
  },
  {
    id: '5',
    studentId: '2',
    studentName: '이학생',
    testName: '2회차 독서 테스트',
    score: 88,
    rank: 5,
    totalStudents: 25,
    season: '2024-1학기',
    date: '2024-03-17',
    comment: '점수가 많이 향상되었습니다.'
  }
];

const mockHomework: Homework[] = [
  {
    id: '1',
    studentId: '1',
    studentName: '김학생',
    week: 1,
    totalProblems: 20,
    solvedProblems: 18,
    season: '2024-1학기',
    comment: '대부분 문제를 잘 해결했습니다. 2문제 부족.'
  },
  {
    id: '2',
    studentId: '1',
    studentName: '김학생',
    week: 2,
    totalProblems: 25,
    solvedProblems: 25,
    season: '2024-1학기',
    comment: '완벽하게 과제를 완수했습니다.'
  },
  {
    id: '3',
    studentId: '2',
    studentName: '이학생',
    week: 1,
    totalProblems: 20,
    solvedProblems: 15,
    season: '2024-1학기',
    comment: '과제 완성도를 높여야 합니다.'
  },
  {
    id: '4',
    studentId: '3',
    studentName: '박학생',
    week: 1,
    totalProblems: 20,
    solvedProblems: 20,
    season: '2024-1학기',
    comment: '훌륭한 과제 수행입니다.'
  },
  {
    id: '5',
    studentId: '2',
    studentName: '이학생',
    week: 2,
    totalProblems: 25,
    solvedProblems: 22,
    season: '2024-1학기',
    comment: '조금 더 노력이 필요합니다.'
  }
];

export const AdminLearningDataManager: React.FC<AdminLearningDataManagerProps> = ({ onUpdate }) => {
  const [testResults, setTestResults] = useState<TestResult[]>(mockTestResults);
  const [homework, setHomework] = useState<Homework[]>(mockHomework);
  const [selectedSeason, setSelectedSeason] = useState('2024-1학기');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const toast = useToast();

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = () => {
    // 실제 프로덕션에서는 세션스토리지에서 로드
    const storedTestResults = SessionStorageManager.get<TestResult[]>('learning_test_results', mockTestResults);
    const storedHomework = SessionStorageManager.get<Homework[]>('learning_homework', mockHomework);
    
    setTestResults(storedTestResults);
    setHomework(storedHomework);
  };

  const seasons = ['2024-1학기', '2023-2학기', '2023-1학기'];
  const students = Array.from(new Set([
    ...testResults.map(t => t.studentName),
    ...homework.map(h => h.studentName)
  ]));

  const filteredTestResults = testResults.filter(result => {
    const seasonMatch = selectedSeason === 'all' || result.season === selectedSeason;
    const studentMatch = selectedStudent === 'all' || result.studentName === selectedStudent;
    return seasonMatch && studentMatch;
  });

  const filteredHomework = homework.filter(hw => {
    const seasonMatch = selectedSeason === 'all' || hw.season === selectedSeason;
    const studentMatch = selectedStudent === 'all' || hw.studentName === selectedStudent;
    return seasonMatch && studentMatch;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'green.400';
    if (score >= 80) return 'yellow.400';
    if (score >= 70) return 'orange.400';
    return 'red.400';
  };

  const getHomeworkCompletion = (solved: number, total: number) => {
    return (solved / total) * 100;
  };

  const exportData = () => {
    const data = {
      testResults: filteredTestResults,
      homework: filteredHomework,
      exportDate: new Date().toISOString().split('T')[0]
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `learning_data_${selectedSeason}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: '데이터를 성공적으로 내보냈습니다',
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="white">
          학습 데이터 관리
        </Text>
        <Button
          bg="#7A5AF8"
          color="white"
          _hover={{ bg: "#6B4CE6" }}
          onClick={exportData}
          size="sm"
        >
          데이터 내보내기
        </Button>
      </HStack>

      {/* 필터 섹션 */}
      <Card bg="gray.800" border="1px solid" borderColor="gray.600" mb={6}>
        <CardBody>
          <HStack spacing={4} wrap="wrap">
            <Box>
              <Text mb={2} fontSize="sm" color="gray.300">학기</Text>
              <Select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                bg="gray.700"
                borderColor="gray.600"
                color="white"
                size="sm"
                w="150px"
              >
                <option value="all">전체</option>
                {seasons.map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </Select>
            </Box>
            <Box>
              <Text mb={2} fontSize="sm" color="gray.300">학생</Text>
              <Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                bg="gray.700"
                borderColor="gray.600"
                color="white"
                size="sm"
                w="150px"
              >
                <option value="all">전체</option>
                {students.map(student => (
                  <option key={student} value={student}>{student}</option>
                ))}
              </Select>
            </Box>
          </HStack>
        </CardBody>
      </Card>

      <VStack spacing={6} align="stretch">
        {/* 테스트 성적 관리 */}
        <Card bg="gray.800" border="1px solid" borderColor="gray.600">
          <CardBody>
            <Text fontSize="xl" fontWeight="bold" color="#7A5AF8" mb={4}>
              📊 테스트 성적 현황
            </Text>
            {filteredTestResults.length > 0 ? (
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th color="gray.300" borderColor="gray.600">학생</Th>
                      <Th color="gray.300" borderColor="gray.600">테스트명</Th>
                      <Th color="gray.300" borderColor="gray.600">점수</Th>
                      <Th color="gray.300" borderColor="gray.600">등수</Th>
                      <Th color="gray.300" borderColor="gray.600">학기</Th>
                      <Th color="gray.300" borderColor="gray.600">날짜</Th>
                      <Th color="gray.300" borderColor="gray.600">코멘트</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredTestResults.map((result) => (
                      <Tr key={result.id}>
                        <Td color="white" borderColor="gray.600">
                          <Badge colorScheme="blue" size="sm">{result.studentName}</Badge>
                        </Td>
                        <Td color="white" borderColor="gray.600">{result.testName}</Td>
                        <Td borderColor="gray.600">
                          <Text color={getScoreColor(result.score)} fontWeight="bold">
                            {result.score}점
                          </Text>
                        </Td>
                        <Td color="white" borderColor="gray.600">
                          {result.rank}/{result.totalStudents}위
                        </Td>
                        <Td color="gray.300" borderColor="gray.600" fontSize="sm">
                          {result.season}
                        </Td>
                        <Td color="gray.300" borderColor="gray.600" fontSize="sm">
                          {result.date}
                        </Td>
                        <Td color="gray.300" borderColor="gray.600" fontSize="sm">
                          {result.comment || '-'}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            ) : (
              <Text color="gray.400" textAlign="center" py={8}>
                해당 조건에 맞는 테스트 결과가 없습니다.
              </Text>
            )}
          </CardBody>
        </Card>

        {/* 과제 수행 현황 */}
        <Card bg="gray.800" border="1px solid" borderColor="gray.600">
          <CardBody>
            <Text fontSize="xl" fontWeight="bold" color="#7A5AF8" mb={4}>
              📚 과제 수행 현황
            </Text>
            {filteredHomework.length > 0 ? (
              <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={4}>
                {filteredHomework.map((hw) => (
                  <GridItem key={hw.id}>
                    <Card bg="gray.700" border="1px solid" borderColor="gray.600">
                      <CardBody>
                        <VStack align="stretch" spacing={3}>
                          <HStack justify="space-between">
                            <Badge colorScheme="blue">{hw.studentName}</Badge>
                            <Badge colorScheme="purple">{hw.week}주차</Badge>
                          </HStack>
                          
                          <Box>
                            <HStack justify="space-between" mb={2}>
                              <Text fontSize="sm" color="gray.300">과제 완성도</Text>
                              <Text fontSize="sm" color="white" fontWeight="bold">
                                {hw.solvedProblems}/{hw.totalProblems}문제
                              </Text>
                            </HStack>
                            <Progress
                              value={getHomeworkCompletion(hw.solvedProblems, hw.totalProblems)}
                              colorScheme={
                                getHomeworkCompletion(hw.solvedProblems, hw.totalProblems) === 100
                                  ? 'green'
                                  : getHomeworkCompletion(hw.solvedProblems, hw.totalProblems) >= 80
                                  ? 'yellow'
                                  : 'red'
                              }
                              size="sm"
                              bg="gray.600"
                            />
                            <Text fontSize="xs" color="gray.400" textAlign="center" mt={1}>
                              {getHomeworkCompletion(hw.solvedProblems, hw.totalProblems).toFixed(0)}% 완료
                            </Text>
                          </Box>
                          
                          {hw.comment && (
                            <Text fontSize="sm" color="gray.300" fontStyle="italic">
                              💬 {hw.comment}
                            </Text>
                          )}
                          
                          <Text fontSize="xs" color="gray.400">
                            학기: {hw.season}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            ) : (
              <Text color="gray.400" textAlign="center" py={8}>
                해당 조건에 맞는 과제 데이터가 없습니다.
              </Text>
            )}
          </CardBody>
        </Card>

        {/* 학습 통계 요약 */}
        <Card bg="gray.800" border="1px solid" borderColor="gray.600">
          <CardBody>
            <Text fontSize="xl" fontWeight="bold" color="#7A5AF8" mb={4}>
              📈 학습 통계 요약
            </Text>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
              <Card bg="gray.700" border="1px solid" borderColor="gray.600">
                <CardBody textAlign="center">
                  <Text color="gray.300" fontSize="sm">평균 점수</Text>
                  <Text color="white" fontSize="2xl" fontWeight="bold">
                    {filteredTestResults.length > 0
                      ? Math.round(filteredTestResults.reduce((sum, r) => sum + r.score, 0) / filteredTestResults.length)
                      : 0}점
                  </Text>
                </CardBody>
              </Card>
              
              <Card bg="gray.700" border="1px solid" borderColor="gray.600">
                <CardBody textAlign="center">
                  <Text color="gray.300" fontSize="sm">총 테스트 수</Text>
                  <Text color="#7A5AF8" fontSize="2xl" fontWeight="bold">
                    {filteredTestResults.length}회
                  </Text>
                </CardBody>
              </Card>
              
              <Card bg="gray.700" border="1px solid" borderColor="gray.600">
                <CardBody textAlign="center">
                  <Text color="gray.300" fontSize="sm">총 과제 수</Text>
                  <Text color="green.400" fontSize="2xl" fontWeight="bold">
                    {filteredHomework.length}개
                  </Text>
                </CardBody>
              </Card>
              
              <Card bg="gray.700" border="1px solid" borderColor="gray.600">
                <CardBody textAlign="center">
                  <Text color="gray.300" fontSize="sm">과제 완료율</Text>
                  <Text color="yellow.400" fontSize="2xl" fontWeight="bold">
                    {filteredHomework.length > 0
                      ? Math.round(
                          (filteredHomework.reduce((sum, hw) => sum + hw.solvedProblems, 0) /
                           filteredHomework.reduce((sum, hw) => sum + hw.totalProblems, 0)) * 100
                        )
                      : 0}%
                  </Text>
                </CardBody>
              </Card>
            </Grid>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};