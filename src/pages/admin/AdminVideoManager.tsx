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
  AlertDialogFooter,
  Switch,
  FormControl,
  FormLabel,
  Divider
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { SessionStorageManager, SessionStorageKeys } from '../../utils/sessionStorage';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  school: string;
  grade: number;
  week: number;
  videoUrl: string;
  isPublic: boolean;
  validUntil?: string;
  createdAt: string;
  author: string;
}

interface AdminVideoManagerProps {
  onUpdate: () => void;
}

// YouTube URL을 임베드 URL로 변환하는 함수
const getYouTubeEmbedUrl = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  
  return url;
};

export const AdminVideoManager: React.FC<AdminVideoManagerProps> = ({ onUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [deleteVideoId, setDeleteVideoId] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    school: '',
    grade: 2,
    week: 1,
    videoUrl: '',
    isPublic: true,
    validUntil: ''
  });
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const schools = ['서울고등학교', '강남고등학교', '중앙고등학교'];
  const grades = [1, 2, 3];
  const weeks = Array.from({ length: 20 }, (_, i) => i + 1);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    const storedVideos = SessionStorageManager.get<VideoItem[]>(SessionStorageKeys.VIDEOS, []);
    setVideos(storedVideos);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.videoUrl.trim() || !formData.school) {
      toast({
        title: '모든 필드를 입력해주세요',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    // YouTube URL 유효성 검사
    const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(formData.videoUrl)) {
      toast({
        title: '유효한 YouTube URL을 입력해주세요',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    const newVideo: VideoItem = {
      id: editingVideo?.id || Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      school: formData.school,
      grade: formData.grade,
      week: formData.week,
      videoUrl: formData.videoUrl.trim(),
      isPublic: formData.isPublic,
      validUntil: formData.validUntil || undefined,
      createdAt: editingVideo?.createdAt || new Date().toISOString().split('T')[0],
      author: '이동인'
    };

    let updatedVideos;
    if (editingVideo) {
      updatedVideos = videos.map(video => 
        video.id === editingVideo.id ? newVideo : video
      );
    } else {
      updatedVideos = [newVideo, ...videos];
    }

    setVideos(updatedVideos);
    SessionStorageManager.set(SessionStorageKeys.VIDEOS, updatedVideos);
    
    resetForm();
    onClose();
    onUpdate();
    
    toast({
      title: editingVideo ? '영상이 수정되었습니다' : '영상이 등록되었습니다',
      status: 'success',
      duration: 2000,
    });
  };

  const handleEdit = (video: VideoItem) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      school: video.school,
      grade: video.grade,
      week: video.week,
      videoUrl: video.videoUrl,
      isPublic: video.isPublic,
      validUntil: video.validUntil || ''
    });
    onOpen();
  };

  const handleDelete = (videoId: string) => {
    setDeleteVideoId(videoId);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    const updatedVideos = videos.filter(video => video.id !== deleteVideoId);
    setVideos(updatedVideos);
    SessionStorageManager.set(SessionStorageKeys.VIDEOS, updatedVideos);
    
    onDeleteClose();
    onUpdate();
    
    toast({
      title: '영상이 삭제되었습니다',
      status: 'success',
      duration: 2000,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      school: '',
      grade: 2,
      week: 1,
      videoUrl: '',
      isPublic: true,
      validUntil: ''
    });
    setEditingVideo(null);
  };

  const openYouTubeVideo = (url: string) => {
    window.open(url, '_blank');
  };

  const groupedVideos = videos.reduce((acc, video) => {
    const key = `${video.school}-${video.grade}학년`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(video);
    return acc;
  }, {} as Record<string, VideoItem[]>);

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="white">
          영상 보강 관리 ({videos.length}개)
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
          새 영상 추가
        </Button>
      </HStack>

      <VStack spacing={6} align="stretch">
        {Object.entries(groupedVideos).map(([schoolGrade, schoolVideos]) => (
          <Card key={schoolGrade} bg="gray.800" border="1px solid" borderColor="gray.600">
            <CardBody>
              <Text fontSize="lg" fontWeight="bold" color="#7A5AF8" mb={4}>
                📚 {schoolGrade} ({schoolVideos.length}개)
              </Text>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                {schoolVideos
                  .sort((a, b) => a.week - b.week)
                  .map((video) => (
                    <GridItem key={video.id}>
                      <Card bg="gray.700" border="1px solid" borderColor="gray.600" h="100%">
                        <CardBody>
                          <VStack spacing={3} align="stretch" h="100%">
                            <HStack justify="space-between" wrap="wrap">
                              <Badge colorScheme="purple" size="sm">{video.week}주차</Badge>
                              <Badge colorScheme={video.isPublic ? "green" : "orange"} size="sm">
                                {video.isPublic ? "전체 공개" : "권한 부여"}
                              </Badge>
                            </HStack>
                            
                            <Text fontWeight="bold" color="white" fontSize="sm" noOfLines={2}>
                              {video.title}
                            </Text>
                            
                            <Text fontSize="xs" color="gray.300" noOfLines={3} flex="1">
                              {video.description}
                            </Text>
                            
                            {!video.isPublic && video.validUntil && (
                              <Text fontSize="xs" color="orange.300">
                                📅 유효기간: {video.validUntil}
                              </Text>
                            )}
                            
                            <Text fontSize="xs" color="gray.400">
                              등록일: {video.createdAt}
                            </Text>
                            
                            <HStack spacing={1} mt="auto">
                              <IconButton
                                aria-label="YouTube에서 보기"
                                icon={<ExternalLinkIcon />}
                                size="xs"
                                variant="outline"
                                borderColor="red.600"
                                color="red.400"
                                _hover={{ bg: "red.900" }}
                                onClick={() => openYouTubeVideo(video.videoUrl)}
                              />
                              <IconButton
                                aria-label="수정"
                                icon={<EditIcon />}
                                size="xs"
                                variant="outline"
                                borderColor="gray.600"
                                color="white"
                                _hover={{ bg: "gray.600" }}
                                onClick={() => handleEdit(video)}
                              />
                              <IconButton
                                aria-label="삭제"
                                icon={<DeleteIcon />}
                                size="xs"
                                variant="outline"
                                borderColor="red.600"
                                color="red.400"
                                _hover={{ bg: "red.900" }}
                                onClick={() => handleDelete(video.id)}
                              />
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    </GridItem>
                  ))}
              </Grid>
            </CardBody>
          </Card>
        ))}

        {videos.length === 0 && (
          <Card bg="gray.700" border="1px solid" borderColor="gray.600">
            <CardBody textAlign="center" py={12}>
              <Text color="gray.400">등록된 영상이 없습니다.</Text>
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* 영상 추가/수정 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white" mx={4}>
          <ModalHeader color="#7A5AF8">
            {editingVideo ? '영상 정보 수정' : '새 영상 추가'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="100%">
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <Box>
                    <Text mb={2} fontWeight="semibold">영상 제목</Text>
                    <Input
                      placeholder="영상 제목을 입력하세요"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      bg="gray.700"
                      borderColor="gray.600"
                      _focus={{ borderColor: "#7A5AF8" }}
                    />
                  </Box>
                </GridItem>

                <GridItem>
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
                </GridItem>

                <GridItem>
                  <HStack>
                    <Box flex="1">
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
                    <Box flex="1">
                      <Text mb={2} fontWeight="semibold">주차</Text>
                      <Select
                        value={formData.week}
                        onChange={(e) => setFormData({ ...formData, week: Number(e.target.value) })}
                        bg="gray.700"
                        borderColor="gray.600"
                        _focus={{ borderColor: "#7A5AF8" }}
                      >
                        {weeks.map(week => (
                          <option key={week} value={week}>{week}주차</option>
                        ))}
                      </Select>
                    </Box>
                  </HStack>
                </GridItem>

                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <Box>
                    <Text mb={2} fontWeight="semibold">YouTube URL</Text>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      bg="gray.700"
                      borderColor="gray.600"
                      _focus={{ borderColor: "#7A5AF8" }}
                    />
                  </Box>
                </GridItem>

                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <Box>
                    <Text mb={2} fontWeight="semibold">영상 설명</Text>
                    <Textarea
                      placeholder="영상에 대한 설명을 입력하세요"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      minH="100px"
                      bg="gray.700"
                      borderColor="gray.600"
                      _focus={{ borderColor: "#7A5AF8" }}
                    />
                  </Box>
                </GridItem>
              </Grid>

              <Divider borderColor="gray.600" />

              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w="100%">
                <GridItem>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="isPublic" mb="0" color="white">
                      전체 공개
                    </FormLabel>
                    <Switch
                      id="isPublic"
                      isChecked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      colorScheme="purple"
                    />
                  </FormControl>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    비공개 시 권한 부여된 학생만 시청 가능
                  </Text>
                </GridItem>

                {!formData.isPublic && (
                  <GridItem>
                    <Box>
                      <Text mb={2} fontWeight="semibold" fontSize="sm">유효기간 (선택사항)</Text>
                      <Input
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        bg="gray.700"
                        borderColor="gray.600"
                        _focus={{ borderColor: "#7A5AF8" }}
                        size="sm"
                      />
                    </Box>
                  </GridItem>
                )}
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
                  {editingVideo ? '수정' : '등록'}
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
              영상 삭제
            </AlertDialogHeader>
            <AlertDialogBody>
              정말로 이 영상을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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