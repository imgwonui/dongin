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
  Textarea,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
  Alert,
  AlertIcon,
  Divider,
  Input
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { mockVideos } from '../../data/mockData';

interface VideoComment {
  id: string;
  videoId: string;
  studentId: string;
  week: number;
  comment: string;
  isTestAnswer: boolean;
  createdAt: string;
}

interface VideoReply {
  id: string;
  commentId: string;
  author: string;
  content: string;
  createdAt: string;
  isPrivate: boolean;
}

const mockComments: VideoComment[] = [
  {
    id: '1',
    videoId: '1',
    studentId: '1',
    week: 1,
    comment: '1주차 테스트 답안: 1번-③, 2번-①, 3번-④, 4번-②, 5번-⑤',
    isTestAnswer: true,
    createdAt: '2024-03-15'
  }
];

const mockReplies: VideoReply[] = [
  {
    id: '1',
    commentId: '1',
    author: '이동인 선생님',
    content: '훌륭합니다! 모든 문제를 정확히 풀었네요. 특히 3번 문제에서 주제의식을 잘 파악했습니다. 등수: 3/25명',
    createdAt: '2024-03-16',
    isPrivate: true
  }
];

// YouTube URL을 임베드 URL로 변환하는 함수
const getYouTubeEmbedUrl = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  
  return url;
};

export const VideoLearningPage: React.FC = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<VideoComment[]>(mockComments);
  const [replies, setReplies] = useState<VideoReply[]>(mockReplies);
  const [showComments, setShowComments] = useState(false);
  const toast = useToast();

  if (!user || user.role !== 'student') {
    return (
      <Box textAlign="center" py={20}>
        <Alert status="warning" maxW="md" mx="auto">
          <AlertIcon />
          학생만 접근할 수 있는 페이지입니다.
        </Alert>
      </Box>
    );
  }

  const userProfile = user.profile;
  const availableVideos = mockVideos.filter(video => 
    video.school === userProfile?.school && 
    video.grade === userProfile?.grade &&
    (video.isPublic || !video.validUntil || new Date(video.validUntil) > new Date())
  );

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    onOpen();
  };

  const handleSubmitComment = () => {
    if (!comment.trim()) {
      toast({
        title: '답안을 입력해주세요',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    const newComment: VideoComment = {
      id: Date.now().toString(),
      videoId: selectedVideo.id,
      studentId: user.id,
      week: selectedVideo.week,
      comment: comment.trim(),
      isTestAnswer: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setComments([...comments, newComment]);
    setComment('');
    setShowComments(true); // 답안 제출 후 자동으로 댓글 표시

    toast({
      title: '테스트 답안이 제출되었습니다',
      description: '조교가 검토 후 피드백을 남겨드립니다.',
      status: 'success',
      duration: 3000,
    });
  };

  const getVideoComment = (videoId: string) => {
    return comments.find(c => c.videoId === videoId && c.studentId === user.id);
  };

  return (
    <Box maxW="1200px" mx="auto" p={6} bg="gray.900" minH="100vh" color="white">
      <VStack spacing={6} align="stretch">
        <Text fontSize="3xl" fontWeight="bold" color="#7A5AF8">
          영상 보강 - {userProfile?.school} {userProfile?.grade}학년
        </Text>

        <Alert status="info" bg="blue.800" color="white">
          <AlertIcon />
          각 영상 시청 후 주차별 테스트 답안을 댓글로 남겨주세요.
        </Alert>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {availableVideos.map((video) => {
            const userComment = getVideoComment(video.id);
            
            return (
              <GridItem key={video.id}>
                <Card h="100%" cursor="pointer" onClick={() => handleVideoClick(video)} bg="gray.800" border="1px solid" borderColor="gray.600" _hover={{ bg: "gray.700" }}>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Badge colorScheme="purple">{video.week}주차</Badge>
                        {video.isPublic ? (
                          <Badge colorScheme="green">전체 공개</Badge>
                        ) : (
                          <Badge colorScheme="orange">권한 부여</Badge>
                        )}
                      </HStack>
                      
                      <Text fontWeight="bold" color="white">{video.title}</Text>
                      <Text fontSize="sm" color="gray.300">
                        {video.description}
                      </Text>
                      
                      {userComment && (
                        <Badge colorScheme="blue" alignSelf="flex-start">
                          답안 제출완료
                        </Badge>
                      )}
                      
                      <Button
                        size="sm"
                        bg="#7A5AF8"
                        color="white"
                        _hover={{ bg: "#6B4CE6" }}
                        mt="auto"
                      >
                        영상 시청
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            );
          })}
        </Grid>

        {availableVideos.length === 0 && (
          <Card bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center" py={12}>
              <Text color="gray.400">
                현재 시청 가능한 영상이 없습니다.
              </Text>
            </CardBody>
          </Card>
        )}

        <Card bg="gray.800" border="1px solid" borderColor="gray.600">
          <CardBody>
            <Text fontSize="xl" fontWeight="bold" color="#7A5AF8" mb={4}>
              제출한 테스트 답안
            </Text>
            <VStack spacing={3} align="stretch">
              {comments
                .filter(c => c.studentId === user.id)
                .map((comment) => {
                  const video = mockVideos.find(v => v.id === comment.videoId);
                  return (
                    <Box key={comment.id} p={4} bg="gray.700" borderRadius="md">
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="semibold" color="white">
                          {comment.week}주차 - {video?.title}
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          {comment.createdAt}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.300">{comment.comment}</Text>
                    </Box>
                  );
                })}
              
              {comments.filter(c => c.studentId === user.id).length === 0 && (
                <Text color="gray.400" textAlign="center">
                  제출한 답안이 없습니다.
                </Text>
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white" mx={4} maxW="90vw" maxH="90vh">
          <ModalHeader color="#7A5AF8">
            {selectedVideo?.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflowY="auto">
            <VStack spacing={6}>
              {/* YouTube 영상 플레이어 */}
              <Box w="100%" position="relative" paddingBottom="56.25%" h={0}>
                <Box
                  as="iframe"
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  src={selectedVideo ? getYouTubeEmbedUrl(selectedVideo.videoUrl) : ''}
                  title={selectedVideo?.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  borderRadius="md"
                />
              </Box>
              
              {/* 영상 설명 */}
              <Box w="100%" bg="gray.700" p={4} borderRadius="md">
                <Text fontSize="lg" fontWeight="bold" mb={2} color="white">
                  {selectedVideo?.title}
                </Text>
                <Text color="gray.300" mb={3}>
                  {selectedVideo?.description}
                </Text>
                <HStack>
                  <Badge colorScheme="purple">{selectedVideo?.week}주차</Badge>
                  <Badge colorScheme={selectedVideo?.isPublic ? "green" : "orange"}>
                    {selectedVideo?.isPublic ? "전체 공개" : "권한 부여"}
                  </Badge>
                </HStack>
              </Box>

              <Divider borderColor="gray.600" />
              
              {/* 테스트 답안 작성 */}
              <Box w="100%">
                <Text mb={3} fontSize="lg" fontWeight="bold" color="#7A5AF8">
                  📝 {selectedVideo?.week}주차 테스트 답안 작성
                </Text>
                <VStack spacing={3} align="stretch">
                  <Textarea
                    placeholder="테스트 답안을 입력해주세요 (예: 1번-③, 2번-①, 3번-④, 4번-②, 5번-⑤)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    minH="100px"
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    borderColor="gray.600"
                    _focus={{ borderColor: "#7A5AF8" }}
                  />
                  <HStack>
                    <Button 
                      bg="#7A5AF8"
                      color="white"
                      _hover={{ bg: "#6B4CE6" }}
                      onClick={handleSubmitComment}
                      size="sm"
                    >
                      답안 제출
                    </Button>
                    <Button 
                      variant="outline" 
                      borderColor="gray.600" 
                      color="white" 
                      _hover={{ bg: "gray.700" }}
                      size="sm"
                      onClick={() => setShowComments(!showComments)}
                    >
                      {showComments ? "댓글 숨기기" : "내 답안 보기"}
                    </Button>
                  </HStack>
                </VStack>
              </Box>

              {/* 댓글 및 답글 시스템 */}
              {showComments && (
                <Box w="100%" bg="gray.700" p={4} borderRadius="md">
                  <Text fontSize="md" fontWeight="bold" mb={4} color="#7A5AF8">
                    💬 내가 제출한 답안 및 피드백
                  </Text>
                  <VStack spacing={4} align="stretch">
                    {comments
                      .filter(c => c.videoId === selectedVideo?.id && c.studentId === user.id)
                      .map((userComment) => {
                        const commentReplies = replies.filter(r => r.commentId === userComment.id);
                        return (
                          <Box key={userComment.id}>
                            {/* 학생 답안 */}
                            <Box bg="gray.600" p={3} borderRadius="md" mb={2}>
                              <HStack justify="space-between" mb={2}>
                                <Text fontSize="sm" fontWeight="bold" color="blue.300">
                                  내 답안
                                </Text>
                                <Text fontSize="sm" color="gray.400">
                                  {userComment.createdAt}
                                </Text>
                              </HStack>
                              <Text color="white" fontSize="sm">
                                {userComment.comment}
                              </Text>
                            </Box>
                            
                            {/* 선생님 피드백 */}
                            {commentReplies.map((reply) => (
                              <Box key={reply.id} bg="purple.900" p={3} borderRadius="md" ml={4} border="1px solid" borderColor="#7A5AF8">
                                <HStack justify="space-between" mb={2}>
                                  <Text fontSize="sm" fontWeight="bold" color="#7A5AF8">
                                    👨‍🏫 {reply.author}
                                  </Text>
                                  <Text fontSize="sm" color="gray.400">
                                    {reply.createdAt}
                                  </Text>
                                </HStack>
                                <Text color="white" fontSize="sm" lineHeight="1.5">
                                  {reply.content}
                                </Text>
                                <Badge colorScheme="red" size="sm" mt={2}>비공개</Badge>
                              </Box>
                            ))}
                          </Box>
                        );
                      })}
                    
                    {comments.filter(c => c.videoId === selectedVideo?.id && c.studentId === user.id).length === 0 && (
                      <Text color="gray.400" textAlign="center" py={4}>
                        아직 제출한 답안이 없습니다.
                      </Text>
                    )}
                  </VStack>
                </Box>
              )}
              
              <Box w="100%">
                <Button onClick={onClose} variant="outline" borderColor="gray.600" color="white" _hover={{ bg: "gray.700" }} w="100%">
                  닫기
                </Button>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};