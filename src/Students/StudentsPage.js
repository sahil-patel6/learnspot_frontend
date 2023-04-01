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

import { StudentCard } from './StudentCard';
import {StudentModal } from './StudentModal';

const StudentPage = props => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState(null);
  const [activeStudent, setActiveStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isStudentOpenModal, setIsStudentOpenModal] = useState(false);

  const toast = useToast();

  const onOpenCreateStudentModal = () => {
    setIsStudentOpenModal(true);
    setActiveStudent(null);
  };
  const onCloseStudentModal = student => {
    setIsStudentOpenModal(false);
    if (student) {
      getStudents(user);
    }
  };

  const onOpenUpdateStudentModal = student => {
    setIsStudentOpenModal(true);
    setActiveStudent(student);
  };

  const getStudents = async user => {
    try {
      setStudents(null);
      setActiveStudent(null);
      setIsLoading(true);
      const result = await axios.get(API.GET_ALL_STUDENTS(user._id), {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(result.data);
      setStudents(result.data);
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
        window.location.href = '/signin';
      } else {
        getStudents(temp);
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
    <VStack
      align={'flex-start'}
      width={'100%'}
      height={
        isLoading || students === null || students.length === 0 ? '100vh' : 'full'
      }
    >
      <NavBar user={user} location={"Students"}/>
      {isLoading ? (
        <Center width={'100%'} height={'100%'}>
          <Flex>
            <CircularProgress isIndeterminate color="green.300" />
          </Flex>
        </Center>
      ) : (
        <VStack
          paddingStart={10}
          paddingTop={5}
          paddingRight={10}
          align={'flex-start'}
          height={'100%'}
          width={'100%'}
          paddingBottom={10}
        >
          <HStack width={'100%'} align={'center'}>
            <Text fontSize={20} fontWeight={'bold'}>
              All Students:
            </Text>
            <Spacer />
            <Button onClick={onOpenCreateStudentModal}>Create Student</Button>
          </HStack>
          <Box h={3}></Box>
          {students == null || students.length == 0 ? (
            <Center width={'100%'} height={'100%'}>
              <Flex>
                <Text fontSize={'3xl'} fontWeight={'semibold'}>
                  No Students Found
                </Text>
              </Flex>
            </Center>
          ) : (
            <Wrap>
              {students &&
                students.map(student => (
                  <WrapItem key={student._id}>
                    <StudentCard
                      student={student}
                      reloadStudents={getStudents}
                      onOpenUpdateStudentModal={onOpenUpdateStudentModal}
                      user={user}
                    />
                    <Box mx={2} my={5}></Box>
                  </WrapItem>
                ))}
            </Wrap>
          )}
          <StudentModal
            isOpen={isStudentOpenModal}
            onClose={onCloseStudentModal}
            user={user}
            activeStudent={activeStudent}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default StudentPage;
