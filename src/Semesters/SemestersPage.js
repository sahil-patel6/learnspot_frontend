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
      setSemesters(result.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: 'An error occurred',
        description: error.response,
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
    <VStack align={'flex-start'} width={'100%'} height={isLoading || semesters ==null || semesters.length == 0 ?  "100vh" : "full"}>
      <NavBar user={user} />
      {isLoading ? (
        <Center width={'100%'} height={'100%'}>
          <Flex>
            <CircularProgress isIndeterminate color="green.300" />
          </Flex>
        </Center>
      ) : (
        <VStack
          paddingStart={20}
          paddingTop={5}
          paddingRight={20}
          align={'flex-start'}
          height={'100%'}
          width={'100%'}
          paddingBottom={10}
        >
          <HStack width={'100%'} align={'center'}>
            <Text fontSize={20} fontWeight={'bold'}>
              All Semesters:
            </Text>
            <Spacer />
            <Button onClick={onOpenCreateSemesterModal}>Create Semester</Button>
          </HStack>
          <Box h={3}></Box>
          {semesters == null || semesters.length == 0 ? (
            <Center width={'100%'} height={'100%'}>
              <Flex>
                <Text fontSize={'3xl'} fontWeight={'semibold'}>
                  No Semesters Found
                </Text>
              </Flex>
            </Center>
          ) : (
            <Wrap>
              {semesters &&
                semesters.map(semester => (
                  <WrapItem key={semester._id}>
                    <SemesterCard
                      semester={semester}
                      reloadSemesters={getSemesters}
                      onOpenUpdateSemesterModal={onOpenUpdateSemesterModal}
                      user={user}
                    />
                    <Box mx={5} my={5}></Box>
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
