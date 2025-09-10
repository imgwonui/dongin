import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Badge,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { SessionStorageManager, SessionStorageKeys, initializeSessionData } from '../../utils/sessionStorage';
import { AdminNoticeManager } from './AdminNoticeManager';
import { AdminQnAManager } from './AdminQnAManager';
import { AdminVideoManager } from './AdminVideoManager';
import { AdminPaymentManager } from './AdminPaymentManager';
import { AdminClinicManager } from './AdminClinicManager';
import { AdminLearningDataManager } from './AdminLearningDataManager';
import { AdminStudentManager } from './AdminStudentManager';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    totalNotices: 0,
    unansweredQuestions: 0,
    pendingPayments: 0,
    pendingClinicReservations: 0,
    totalStudents: 0,
    totalVideos: 0
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      initializeSessionData();
      updateDashboardStats();
    }
  }, [user]);

  const updateDashboardStats = () => {
    const notices = SessionStorageManager.get(SessionStorageKeys.NOTICES, []);
    const qna = SessionStorageManager.get(SessionStorageKeys.QNA, []);
    const payments = SessionStorageManager.get(SessionStorageKeys.PAYMENTS, []);
    const clinicReservations = SessionStorageManager.get(SessionStorageKeys.CLINIC_RESERVATIONS, []);
    const videos = SessionStorageManager.get(SessionStorageKeys.VIDEOS, []);
    
    // 실제 학생 수 계산
    const storedUsers = JSON.parse(localStorage.getItem('dongin_users') || '[]');
    const studentCount = storedUsers.filter((user: any) => user.role === 'student').length;

    setDashboardStats({
      totalNotices: notices.length,
      unansweredQuestions: qna.filter((q: any) => !q.answer).length,
      pendingPayments: payments.filter((p: any) => p.status === 'pending').length,
      pendingClinicReservations: clinicReservations.filter((r: any) => r.status === 'pending').length,
      totalStudents: studentCount,
      totalVideos: videos.length || 5
    });
  };

  if (!user || user.role !== 'admin') {
    return (
      <Box textAlign="center" py={20} bg="gray.900" minH="100vh" color="white">
        <Alert status="error" maxW="md" mx="auto" bg="red.800" color="white">
          <AlertIcon />
          관리자만 접근할 수 있는 페이지입니다.
        </Alert>
      </Box>
    );
  }

  return (
    <Box maxW="1400px" mx="auto" p={6} bg="gray.900" minH="100vh" color="white">
      <VStack spacing={8} align="stretch">
        {/* 헤더 */}
        <Box>
          <Text fontSize="4xl" fontWeight="bold" color="#7A5AF8" mb={2}>
            관리자 대시보드
          </Text>
          <Text fontSize="lg" color="gray.300">
            안녕하세요, {user.username}님! 이동인 국어 관리 시스템입니다.
          </Text>
        </Box>

        {/* 통계 카드들 */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }} gap={4}>
          <GridItem>
            <Card bg="gray.800" border="1px solid" borderColor="gray.600">
              <CardBody>
                <Stat>
                  <StatLabel color="gray.300">전체 공지사항</StatLabel>
                  <StatNumber color="#7A5AF8">{dashboardStats.totalNotices}</StatNumber>
                  <StatHelpText color="gray.400">개</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg="gray.800" border="1px solid" borderColor="gray.600">
              <CardBody>
                <Stat>
                  <StatLabel color="gray.300">미답변 질문</StatLabel>
                  <StatNumber color="orange.400">{dashboardStats.unansweredQuestions}</StatNumber>
                  <StatHelpText color="gray.400">개</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg="gray.800" border="1px solid" borderColor="gray.600">
              <CardBody>
                <Stat>
                  <StatLabel color="gray.300">대기 중 결제</StatLabel>
                  <StatNumber color="yellow.400">{dashboardStats.pendingPayments}</StatNumber>
                  <StatHelpText color="gray.400">건</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg="gray.800" border="1px solid" borderColor="gray.600">
              <CardBody>
                <Stat>
                  <StatLabel color="gray.300">클리닉 예약</StatLabel>
                  <StatNumber color="blue.400">{dashboardStats.pendingClinicReservations}</StatNumber>
                  <StatHelpText color="gray.400">건</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg="gray.800" border="1px solid" borderColor="gray.600">
              <CardBody>
                <Stat>
                  <StatLabel color="gray.300">전체 학생</StatLabel>
                  <StatNumber color="green.400">{dashboardStats.totalStudents}</StatNumber>
                  <StatHelpText color="gray.400">명</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg="gray.800" border="1px solid" borderColor="gray.600">
              <CardBody>
                <Stat>
                  <StatLabel color="gray.300">영상 강의</StatLabel>
                  <StatNumber color="purple.400">{dashboardStats.totalVideos}</StatNumber>
                  <StatHelpText color="gray.400">개</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* 관리 탭들 */}
        <Card bg="gray.800" border="1px solid" borderColor="gray.600">
          <CardBody>
            <Tabs variant="enclosed" colorScheme="purple">
              <TabList borderColor="gray.600">
                <Tab color="white" _selected={{ color: "#7A5AF8", borderColor: "#7A5AF8", bg: "gray.700" }}>
                  학생 관리
                </Tab>
                <Tab color="white" _selected={{ color: "#7A5AF8", borderColor: "#7A5AF8", bg: "gray.700" }}>
                  공지사항 관리
                </Tab>
                <Tab color="white" _selected={{ color: "#7A5AF8", borderColor: "#7A5AF8", bg: "gray.700" }}>
                  질의응답 관리
                </Tab>
                <Tab color="white" _selected={{ color: "#7A5AF8", borderColor: "#7A5AF8", bg: "gray.700" }}>
                  영상 관리
                </Tab>
                <Tab color="white" _selected={{ color: "#7A5AF8", borderColor: "#7A5AF8", bg: "gray.700" }}>
                  결제 관리
                </Tab>
                <Tab color="white" _selected={{ color: "#7A5AF8", borderColor: "#7A5AF8", bg: "gray.700" }}>
                  클리닉 관리
                </Tab>
                <Tab color="white" _selected={{ color: "#7A5AF8", borderColor: "#7A5AF8", bg: "gray.700" }}>
                  학습 데이터
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <AdminStudentManager onUpdate={updateDashboardStats} />
                </TabPanel>
                <TabPanel>
                  <AdminNoticeManager onUpdate={updateDashboardStats} />
                </TabPanel>
                <TabPanel>
                  <AdminQnAManager onUpdate={updateDashboardStats} />
                </TabPanel>
                <TabPanel>
                  <AdminVideoManager onUpdate={updateDashboardStats} />
                </TabPanel>
                <TabPanel>
                  <AdminPaymentManager onUpdate={updateDashboardStats} />
                </TabPanel>
                <TabPanel>
                  <AdminClinicManager onUpdate={updateDashboardStats} />
                </TabPanel>
                <TabPanel>
                  <AdminLearningDataManager onUpdate={updateDashboardStats} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};