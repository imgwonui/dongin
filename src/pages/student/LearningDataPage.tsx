import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Badge,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { mockTestResults, mockHomework } from '../../data/mockData';

export const LearningDataPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'student') {
    return (
      <Box textAlign="center" py={20}>
        <Text>학생만 접근할 수 있는 페이지입니다.</Text>
      </Box>
    );
  }

  const userTestResults = mockTestResults.filter(result => result.studentId === user.id);
  const userHomework = mockHomework.filter(hw => hw.studentId === user.id);

  return (
    <Box maxW="1200px" mx="auto" p={6} bg="gray.900" minH="100vh" color="white">
      <Text fontSize="3xl" fontWeight="bold" mb={8} color="#7A5AF8">
        학습 데이터
      </Text>
      
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} mb={8}>
        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardHeader>
              <Text fontSize="xl" fontWeight="bold" color="#7A5AF8">
                테스트 성적
              </Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {userTestResults.map((result) => (
                  <Box key={result.id} p={4} bg="gray.700" borderRadius="md">
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="semibold" color="white">{result.testName}</Text>
                      <Badge colorScheme="purple">{result.season}</Badge>
                    </HStack>
                    <Grid templateColumns="1fr 1fr 1fr" gap={4} mb={3}>
                      <Stat size="sm">
                        <StatLabel color="gray.300">점수</StatLabel>
                        <StatNumber color="#7A5AF8">{result.score}점</StatNumber>
                      </Stat>
                      <Stat size="sm">
                        <StatLabel color="gray.300">등수</StatLabel>
                        <StatNumber color="white">{result.rank}등</StatNumber>
                        <StatHelpText color="gray.400">/{result.totalStudents}명</StatHelpText>
                      </Stat>
                      <Stat size="sm">
                        <StatLabel color="gray.300">날짜</StatLabel>
                        <StatNumber fontSize="sm" color="white">{result.date}</StatNumber>
                      </Stat>
                    </Grid>
                    {result.comment && (
                      <Text fontSize="sm" color="gray.300" mt={2}>
                        💬 {result.comment}
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardHeader>
              <Text fontSize="xl" fontWeight="bold" color="#7A5AF8">
                과제 현황
              </Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {userHomework.map((hw) => (
                  <Box key={hw.id} p={4} bg="gray.700" borderRadius="md">
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="semibold" color="white">{hw.week}주차 과제</Text>
                      <Badge colorScheme="green">{hw.season}</Badge>
                    </HStack>
                    <Box mb={3}>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" color="gray.300">
                          완료: {hw.solvedProblems}/{hw.totalProblems} 문제
                        </Text>
                        <Text fontSize="sm" color="#7A5AF8">
                          {Math.round((hw.solvedProblems / hw.totalProblems) * 100)}%
                        </Text>
                      </HStack>
                      <Progress 
                        value={(hw.solvedProblems / hw.totalProblems) * 100} 
                        colorScheme="purple"
                        size="sm"
                      />
                    </Box>
                    {hw.comment && (
                      <Text fontSize="sm" color="gray.300">
                        💬 {hw.comment}
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Card bg="gray.800" border="1px solid" borderColor="gray.600">
        <CardHeader>
          <Text fontSize="xl" fontWeight="bold" color="#7A5AF8">
            성적 추이 (시각화)
          </Text>
        </CardHeader>
        <CardBody>
          <Box h="200px" bg="gray.700" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
            <Text color="gray.400">성적 차트가 여기에 표시됩니다</Text>
          </Box>
          <HStack mt={4} justify="space-between">
            <Button size="sm" variant="outline" borderColor="gray.600" color="white" _hover={{ bg: "gray.700" }}>
              학부모 보고서 발송
            </Button>
            <Text fontSize="sm" color="gray.400">
              마지막 업데이트: {new Date().toLocaleDateString()}
            </Text>
          </HStack>
        </CardBody>
      </Card>
    </Box>
  );
};