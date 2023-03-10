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
import { Link } from 'react-router-dom';

const SemestersPage = props => {
  const { department_id } = useParams();
  console.log(department_id);
  const [user, setUser] = useState(null);
  const [semesters, setSemesters] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [isCreateSemesterOpenModal, setIsCreateSemesterOpenModal] =
    useState(false);
  const [isUpdateSemesterOpenModal, setIsUpdateSemesterOpenModal] =
    useState(false);

  const toast = useToast();

  const onOpenCreateSemesterModal = () => setIsCreateSemesterOpenModal(true);
  const onCloseCreateSemesterModal = Semester => {
    setIsCreateSemesterOpenModal(false);
    if (Semester) {
      getSemesters(user);
    }
  };

  const onOpenUpdateSemesterModal = () => setIsUpdateSemesterOpenModal(true);
  const onCloseUpdateSemesterModal = Semester => {
    setIsUpdateSemesterOpenModal(false);
    if (Semester) {
      getSemesters(user);
    }
  };

  const getSemesters = async user => {
    try {
      setSemesters(null);
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
        navigate("/signin")
      } else {
        getSemesters(temp);
      }
      setIsLoading(false);
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
    <VStack align={'flex-start'}>
      <NavBar user={user} />
      {isLoading ? (
        <Center width={'100vw'} height={window.screen.height - 250}>
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
        >
          <HStack minW={window.screen.width - 150} align={'center'}>
            <Text fontSize={20} fontWeight={'bold'}>
              All Semesters:
            </Text>
            <Spacer />
            <Button onClick={onOpenCreateSemesterModal}>Create Semester</Button>
          </HStack>
          <Box h={3}></Box>
          <Wrap>
            {semesters &&
              semesters.map(semester => (
                <WrapItem key={semester._id} my={500}>
                    <SemesterCard
                      semester={semester}
                      reloadSemesters={getSemesters}
                      onOpenUpdateSemesterModal={onOpenUpdateSemesterModal}
                      user={user}
                    />
                    <Box mx={5} my={5}></Box>
                    <SemesterModal
                      isOpen={isUpdateSemesterOpenModal}
                      onClose={onCloseUpdateSemesterModal}
                      user={user}
                      semester={semester}
                      mode={'Update'}
                    />
                  {/* </Link> */}
                </WrapItem>
              ))}
          </Wrap>
          <SemesterModal
            isOpen={isCreateSemesterOpenModal}
            onClose={onCloseCreateSemesterModal}
            user={user}
            mode={'Create'}
            department_id={department_id}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default SemestersPage;
