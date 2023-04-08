import {
  useToast,
  VStack,
  Center,
  Flex,
  CircularProgress,
  Text,
  Box,
  HStack,
  Spacer,
  Button,
  Wrap,
  WrapItem,
  Badge,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NavBar from '../Components/NavBar';
import { API } from '../utils/API';
import { SemesterModal } from './SemesterModal';
import { SemesterCard } from './SemesterCard';
import { useNavigate, useParams } from 'react-router';

const SemestersPage = props => {
  const { department_id } = useParams();
  console.log(department_id);
  const [user, setUser] = useState(null);
  const [semesters, setSemesters] = useState(null);
  const [activeSemester, setActiveSemester] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [isSemesterOpenModal, setIsSemesterOpenModal] = useState(false);

  const toast = useToast();

  const onOpenCreateSemesterModal = () => {
    setIsSemesterOpenModal(true);
    setActiveSemester(null);
  };
  const onOpenUpdateSemesterModal = semester => {
    setIsSemesterOpenModal(true);
    setActiveSemester(semester);
  };

  const onCloseSemesterModal = Semester => {
    setIsSemesterOpenModal(false);
    if (Semester) {
      getSemesters(user);
    }
  };

  const getSemesters = async user => {
    try {
      setSemesters(null);
      setActiveSemester(null);
      setIsLoading(true);
      const result = await axios.get(
        API.GET_ALL_SEMESTERS(department_id, user._id),
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(result.data);
      if (result.data.semesters) {
        result.data.semesters.map(s => {
          s.credits = 0;
          s.subjects.map(subject => {
            s.credits += subject.credits;
          });
        });
        console.log(result.data);
      }
      setSemesters(result.data);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: 'An error occurred',
        description: error.response.data.error,
        status: 'error',
        duration: '2000',
        isClosable: true,
        position: 'top-right',
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      const temp = JSON.parse(localStorage.getItem('user'));
      setUser(temp);
      if (temp == null || temp._id == null || temp.token == null) {
        console.log('INSIDE YEAY');
        // window.location.href = '/signin';
        navigate('/signin');
      } else {
        getSemesters(temp);
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'An error occurred',
        description: error,
        status: 'error',
        duration: '2000',
        isClosable: true,
        position: 'top-right',
      });
      console.log(error);
    }
  }, []);

  return (
    <VStack align={'flex-start'} width={'100%'} height={'100vh'}>
      <NavBar user={user} />
      {isLoading ? (
        <Center width={'100%'} height={'full'}>
          <Flex>
            <CircularProgress isIndeterminate color="green.300" />
          </Flex>
        </Center>
      ) : (
        <VStack
          paddingStart={8}
          paddingTop={5}
          paddingRight={8}
          align={'flex-start'}
          height={
            semesters === null ||
            semesters.semesters == null ||
            semesters.semesters.length === 0
              ? 'full'
              : 'max'
          }
          width={'100%'}
        >
          <Wrap width={'full'}>
            <Center>
              <Text fontSize={20} fontWeight={'bold'}>
                All Semesters{' '}
                  {semesters != null && semesters.department != null
                    ? `(${semesters.department.name})`
                    : ''}
                :
              </Text>
            </Center>
            <Spacer />
            <Button onClick={onOpenCreateSemesterModal}>Create Semester</Button>
          </Wrap>
          <Box h={3}></Box>
          {semesters === null ||
          semesters.semesters == null ||
          semesters.semesters.length === 0 ? (
            <Center width={'100%'} height={'70%'}>
              <Flex>
                <Text fontSize={'3xl'} fontWeight={'semibold'}>
                  No Semesters Found
                </Text>
              </Flex>
            </Center>
          ) : (
            <Wrap>
              {semesters &&
                semesters.semesters &&
                semesters.semesters.map(semester => (
                  <WrapItem key={semester._id}>
                    <SemesterCard
                      semester={semester}
                      reloadSemesters={getSemesters}
                      onOpenUpdateSemesterModal={onOpenUpdateSemesterModal}
                      user={user}
                    />
                    <Box mx={2} my={10}></Box>
                  </WrapItem>
                ))}
            </Wrap>
          )}
          <SemesterModal
            isOpen={isSemesterOpenModal}
            onClose={onCloseSemesterModal}
            user={user}
            activeSemester={activeSemester}
            department_id={department_id}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default SemestersPage;
