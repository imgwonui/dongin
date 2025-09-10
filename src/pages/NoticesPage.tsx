import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Card,
  CardBody,
  Badge
} from '@chakra-ui/react';
import { mockNotices } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export const NoticesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);

  const generalNotices = mockNotices.filter(notice => notice.category === 'general');
  const schoolNotices = mockNotices.filter(notice => 
    notice.category === 'school' && 
    user?.profile && 
    notice.school === user.profile.school &&
    notice.grade === user.profile.grade
  );

  return (
    <Box maxW="1200px" mx="auto" p={6} bg="gray.900" minH="100vh" color="white">
      <Text fontSize="3xl" fontWeight="bold" mb={8} color="#7A5AF8">
        공지사항
      </Text>
      
      <Tabs index={selectedTab} onChange={setSelectedTab}>
        <TabList borderColor="gray.600">
          <Tab color="white" _selected={{ color: "#7A5AF8", borderColor: "#7A5AF8" }}>전체 공지</Tab>
          {user?.profile && (
            <Tab color="white" _selected={{ color: "#7A5AF8", borderColor: "#7A5AF8" }}>
              {user.profile.school} {user.profile.grade}학년
            </Tab>
          )}
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {generalNotices.map((notice) => (
                <Card key={notice.id} bg="gray.800" border="1px solid" borderColor="gray.600">
                  <CardBody>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="lg" fontWeight="semibold" color="white">
                        {notice.title}
                      </Text>
                      <Badge colorScheme="purple">전체</Badge>
                    </HStack>
                    <Text color="gray.300" mb={4}>
                      {notice.content}
                    </Text>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.400">
                        작성자: {notice.author}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        {notice.createdAt}
                      </Text>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </TabPanel>

          {user?.profile && (
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {schoolNotices.map((notice) => (
                  <Card key={notice.id} bg="gray.800" border="1px solid" borderColor="gray.600">
                    <CardBody>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="lg" fontWeight="semibold" color="white">
                          {notice.title}
                        </Text>
                        <Badge colorScheme="blue">
                          {notice.school} {notice.grade}학년
                        </Badge>
                      </HStack>
                      <Text color="gray.300" mb={4}>
                        {notice.content}
                      </Text>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.400">
                          작성자: {notice.author}
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          {notice.createdAt}
                        </Text>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};