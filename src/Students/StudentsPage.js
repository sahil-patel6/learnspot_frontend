import { Search2Icon } from '@chakra-ui/icons';
import {
  useToast,
  VStack,
  Center,
  Flex,
  CircularProgress,
  Text,
  Box,
  Spacer,
  Button,
  Wrap,
  WrapItem,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../Components/NavBar';
import { API } from '../utils/API';
import { PromoteStudentsModal } from './PromoteStudentModal';

import { StudentCard } from './StudentCard';
import { StudentModal } from './StudentModal';

const StudentPage = props => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState(null);
  const [originalStudents, setOriginalStudents] = useState(null);
  const [activeStudent, setActiveStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isStudentOpenModal, setIsStudentOpenModal] = useState(false);
  const [isPromoteStudentsOpenModal, setIsPromoteStudentsOpenModal] =
    useState(false);

  const toast = useToast();
  const navigate = useNavigate();

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
      setOriginalStudents(null);
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
      setOriginalStudents(result.data);
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

  const searchStudents = value => {
    console.log(value);
    if (value == '') {
      setStudents(originalStudents);
    } else {
      let searchedStudents = [];
      originalStudents.map(s => {
        if (s.name.toLowerCase().includes(value.toLowerCase())) {
          searchedStudents.push(s);
        }
      });
      setStudents(searchedStudents);
    }
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      const temp = JSON.parse(localStorage.getItem('user'));
      setUser(temp);
      if (temp == null || temp._id == null || temp.token == null) {
        console.log('INSIDE YEAY');
        navigate('/signin');
        // window.location.href = '/signin';
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
    <VStack align={'flex-start'} width={'100%'} height={'100vh'}>
      <NavBar user={user} location={'Students'} />
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
          height={students === null || students.length === 0 ? 'full' : 'max'}
          width={'100%'}
        >
          <Wrap width={'100%'}>
            <Text fontSize={20} fontWeight={'bold'}>
              All Students:
            </Text>
            <Spacer />
            <InputGroup w={'xs'}>
              <InputLeftElement
                pointerEvents="none"
                children={<Search2Icon color="gray.300" />}
              />
              <Input
                type="text"
                placeholder="Search Students"
                onChange={e => searchStudents(e.target.value)}
              />
            </InputGroup>
            <Button onClick={onOpenCreateStudentModal}>Create Student</Button>
            <Button onClick={() => setIsPromoteStudentsOpenModal(true)}>
              Promote Students
            </Button>
          </Wrap>
          <Box h={3}></Box>
          {students === null || students.length === 0 ? (
            <Center width={'100%'} height={'60%'}>
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

          <PromoteStudentsModal
            isOpen={isPromoteStudentsOpenModal}
            onClose={(data) => {
              setIsPromoteStudentsOpenModal(false);
              if (data){
                getStudents(user);
              }
            }}
            user={user}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default StudentPage;
