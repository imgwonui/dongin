import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Flex,
  useDisclosure,
  Grid,
  GridItem,
  Card,
  CardBody
} from '@chakra-ui/react';
import { LoginModal } from '../../components/common/LoginModal';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated, user } = useAuth();
  const [guestMode, setGuestMode] = useState(false);

  const handleGuestEntry = () => {
    setGuestMode(true);
  };

  if (isAuthenticated || guestMode) {
    return (
      <Box bg="gray.900" minH="100vh" color="white">
        <VStack spacing={12} py={10} px={6}>
          {/* 환영 메시지 */}
          <VStack spacing={4}>
            <Text fontSize="4xl" fontWeight="bold" color="#7A5AF8" textAlign="center">
              이동인 국어에 오신 것을 환영합니다
            </Text>
            {isAuthenticated && user?.profile && (
              <Text fontSize="xl" color="gray.300" textAlign="center">
                안녕하세요, {user.profile.name}님!
              </Text>
            )}
          </VStack>

          {/* 퀵 액세스 버튼들 */}
          {isAuthenticated && (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }} gap={4} w="100%" maxW="1200px">
              <Button as={Link} to="/notices" bg="#7A5AF8" color="white" _hover={{ bg: "#6B4CE6" }} py={6}>
                공지사항
              </Button>
              <Button as={Link} to="/qna" bg="gray.800" color="white" _hover={{ bg: "gray.700" }} py={6}>
                질의응답
              </Button>
              <Button as={Link} to="/learning-data" bg="gray.800" color="white" _hover={{ bg: "gray.700" }} py={6}>
                학습 데이터
              </Button>
              <Button as={Link} to="/videos" bg="gray.800" color="white" _hover={{ bg: "gray.700" }} py={6}>
                영상 보강
              </Button>
              <Button as={Link} to="/payment" bg="gray.800" color="white" _hover={{ bg: "gray.700" }} py={6}>
                교재비 결제
              </Button>
              <Button as={Link} to="/clinic" bg="gray.800" color="white" _hover={{ bg: "gray.700" }} py={6}>
                클리닉 일정표
              </Button>
            </Grid>
          )}

          {/* 강사 소개 섹션 */}
          <Box w="100%" maxW="1200px">
            <Text fontSize="3xl" fontWeight="bold" color="#7A5AF8" textAlign="center" mb={8}>
              강사 소개
            </Text>
            <VStack spacing={6} align="stretch" bg="gray.800" p={8} borderRadius="lg">
              <Text fontSize="lg" lineHeight="1.8">
                안녕하세요, 저는 지난 10년 간 고등학교 국어 교육에 전념해왔으며, 
                수많은 학생들이 내신과 수능에서 우수한 성과를 거둘 수 있도록 도와온 이동인입니다.
              </Text>
              
              <Text fontSize="lg" lineHeight="1.8">
                제 수업의 핵심은 단순한 문제 풀이가 아닌, 국어의 근본적인 이해를 바탕으로 한 체계적인 접근입니다. 
                문학에서는 작품의 깊이 있는 분석을 통해 감상 능력을 기르고, 독서에서는 논리적 사고력과 
                비판적 독해 능력을 향상시킵니다.
              </Text>

              <Text fontSize="lg" lineHeight="1.8">
                또한 개별 학생의 수준과 특성을 파악하여 맞춤형 학습 계획을 수립합니다. 
                정기적인 테스트와 과제를 통해 학습 진도를 체크하고, 부족한 부분은 집중적으로 보완합니다. 
                이러한 체계적인 관리를 통해 학생들이 확실한 실력 향상을 경험할 수 있습니다.
              </Text>

              <Text fontSize="lg" lineHeight="1.8">
                무엇보다 학생들이 국어에 대한 흥미를 잃지 않도록 다양한 교수법을 활용합니다. 
                단조로운 암기식 학습이 아닌, 토론과 발표를 통한 능동적 참여로 살아있는 국어 수업을 만들어갑니다.
              </Text>

              <Box bg="gray.700" p={6} borderRadius="md" mt={4}>
                <Text fontSize="lg" fontWeight="semibold" mb={3} color="#7A5AF8">주요 경력</Text>
                <VStack align="stretch" spacing={2}>
                  <Text>• 홍익대학교 교육학과 졸업</Text>
                  <Text>• 개쩌는 대학원 석사</Text>
                  <Text>• 대치동 주요 학원 국어 강사 10년</Text>
                  <Text>• 현재 대원외고, 중앙고 내신 강사</Text>
                  <Text>• 두각학원 등 개쩌는 학원 출강 중</Text>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* 수강 후기 섹션 */}
          <Box w="100%" maxW="1200px">
            <Text fontSize="3xl" fontWeight="bold" color="#7A5AF8" textAlign="center" mb={8}>
              수강 후기
            </Text>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              <Box bg="gray.800" p={6} borderRadius="lg">
                <Text fontSize="lg" mb={4} lineHeight="1.8">
                  "처음에는 국어가 정말 어려웠는데, 선생님의 체계적인 지도 덕분에 내신에서 1등급을 받을 수 있었습니다. 
                  특히 문학 작품 분석 방법을 배운 후로는 어떤 작품이 나와도 자신있게 해석할 수 있게 되었어요!"
                </Text>
                <Text fontWeight="bold" color="#7A5AF8">- 서울고 2학년 김○○</Text>
              </Box>

              <Box bg="gray.800" p={6} borderRadius="lg">
                <Text fontSize="lg" mb={4} lineHeight="1.8">
                  "수능 국어 점수가 30점 이상 향상되었어요! 독서 영역에서 항상 틀렸던 문제들이 이제는 
                  논리적으로 풀릴 정도로 실력이 늘었습니다. 꼼꼼한 첨삭과 개별 관리가 정말 도움이 되었습니다."
                </Text>
                <Text fontWeight="bold" color="#7A5AF8">- 강남고 3학년 이○○</Text>
              </Box>

              <Box bg="gray.800" p={6} borderRadius="lg">
                <Text fontSize="lg" mb={4} lineHeight="1.8">
                  "문학과 독서 모든 영역에서 실력이 늘었어요! 선생님만의 독특한 해석 방법과 문제 접근법이 
                  정말 효과적이었습니다. 국어에 대한 자신감도 많이 생겼고요."
                </Text>
                <Text fontWeight="bold" color="#7A5AF8">- 중앙고 2학년 박○○</Text>
              </Box>

              <Box bg="gray.800" p={6} borderRadius="lg">
                <Text fontSize="lg" mb={4} lineHeight="1.8">
                  "내신과 수능을 동시에 대비할 수 있는 커리큘럼이 정말 좋았어요. 학교 시험 기간에는 
                  해당 학교 출제 경향에 맞춰 집중 지도해주시고, 평상시에는 수능 대비까지 완벽하게!"
                </Text>
                <Text fontWeight="bold" color="#7A5AF8">- 서울고 3학년 최○○</Text>
              </Box>
            </Grid>
          </Box>

          {/* 출강 시간표 */}
          <Box w="100%" maxW="1200px">
            <Text fontSize="3xl" fontWeight="bold" color="#7A5AF8" textAlign="center" mb={8}>
              출강 시간표
            </Text>
            <Box bg="gray.800" p={8} borderRadius="lg">
              <Box as="table" w="100%" border="1px solid" borderColor="gray.600">
                <Box as="thead">
                  <Box as="tr" bg="gray.700">
                    <Box as="th" p={4} border="1px solid" borderColor="gray.600" textAlign="center" fontWeight="bold">
                      학교
                    </Box>
                    <Box as="th" p={4} border="1px solid" borderColor="gray.600" textAlign="center" fontWeight="bold">
                      학년
                    </Box>
                    <Box as="th" p={4} border="1px solid" borderColor="gray.600" textAlign="center" fontWeight="bold">
                      요일
                    </Box>
                    <Box as="th" p={4} border="1px solid" borderColor="gray.600" textAlign="center" fontWeight="bold">
                      시간
                    </Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  <Box as="tr">
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      서울고등학교
                    </Box>
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      2학년
                    </Box>
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      월요일
                    </Box>
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      18:00 - 20:00
                    </Box>
                  </Box>
                  <Box as="tr">
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      서울고등학교
                    </Box>
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      2학년
                    </Box>
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      수요일
                    </Box>
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      18:00 - 20:00
                    </Box>
                  </Box>
                  <Box as="tr">
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      강남고등학교
                    </Box>
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      3학년
                    </Box>
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      화요일
                    </Box>
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      19:00 - 21:00
                    </Box>
                  </Box>
                  <Box as="tr">
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      강남고등학교
                    </Box>
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      3학년
                    </Box>
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      목요일
                    </Box>
                    <Box as="td" p={4} border="1px solid" borderColor="gray.600" textAlign="center">
                      19:00 - 21:00
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </VStack>
      </Box>
    );
  }

  return (
    <Box 
      minH="100vh" 
      bg="gray.900" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      fontFamily="Pretendard, sans-serif"
      color="white"
    >
      <VStack spacing={8}>
        <VStack spacing={4}>
          <Text 
            fontSize={["lg", "xl", "2xl"]} 
            color="gray.300" 
            textAlign="center"
            px={4}
          >
            내신 국어를 완벽하게 다져서 수능 국어까지 완성하는
          </Text>
          <Text 
            fontSize={["3xl", "4xl", "6xl"]} 
            fontWeight="bold" 
            color="#7A5AF8" 
            textAlign="center"
          >
            이동인 국어
          </Text>
        </VStack>
        
        <Flex 
          gap={4} 
          flexDirection={["column", "row"]} 
          w="100%" 
          px={4}
          justify="center"
          align="center"
        >
          <Button
            bg="#7A5AF8"
            color="white"
            _hover={{ bg: "#6B4CE6" }}
            size="lg"
            minW="200px"
            onClick={onOpen}
          >
            로그인
          </Button>
          <Button
            variant="outline"
            borderColor="#7A5AF8"
            color="#7A5AF8"
            _hover={{ bg: "#7A5AF8", color: "white" }}
            size="lg"
            minW="200px"
            onClick={handleGuestEntry}
          >
            로그인 없이 들어가기
          </Button>
        </Flex>
      </VStack>
      
      <LoginModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};