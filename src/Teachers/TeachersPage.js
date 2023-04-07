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
  InputLeftElement,
  InputGroup,
  Input,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../Components/NavBar';
import { API } from '../utils/API';

import { TeacherCard } from './TeacherCard';
import { TeacherModal } from './TeacherModal';

const TeachersPage = props => {
  const [user, setUser] = useState(null);
  const [teachers, setTeachers] = useState(null);
  const [originalTeachers, setOriginalTeachers] = useState(null);
  const [activeTeacher, setActiveTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isTeacherOpenModal, setIsTeacherOpenModal] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const onOpenCreateTeacherModal = () => {
    setIsTeacherOpenModal(true);
    setActiveTeacher(null);
  };
  const onCloseTeacherModal = teacher => {
    setIsTeacherOpenModal(false);
    if (teacher) {
      getTeachers(user);
    }
  };

  const onOpenUpdateTeacherModal = teacher => {
    setIsTeacherOpenModal(true);
    setActiveTeacher(teacher);
  };

  const searchTeachers = (value)=>{
    console.log(value)
    if (value==""){
      setTeachers(originalTeachers);
    }else{
      let searchedTeachers = [];
      originalTeachers.map((t)=>{
        if (t.name.toLowerCase().includes(value.toLowerCase())){
          searchedTeachers.push(t);
        }
      })
      setTeachers(searchedTeachers);
    }
  }


  const getTeachers = async user => {
    try {
      setTeachers(null);
      setOriginalTeachers(null);
      setActiveTeacher(null);
      setIsLoading(true);
      const result = await axios.get(API.GET_ALL_TEACHERS(user._id), {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(result.data);
      setTeachers(result.data);
      setOriginalTeachers(result.data);
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
        navigate('/signin');
        // window.location.href = '/signin';
      } else {
        getTeachers(temp);
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
      <NavBar user={user} location={'Teachers'} />
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
          height={teachers === null || teachers.length === 0 ? 'full' : 'max'}
          width={'100%'}
        >
          <Wrap width={'100%'}>
              <Text fontSize={20} fontWeight={'bold'}>
                All Teachers:
              </Text>
            <Spacer />
            <InputGroup w={'xs'}>
              <InputLeftElement
                pointerEvents="none"
                children={<Search2Icon color="gray.300" />}
              />
              <Input type="text" placeholder="Search Teachers" onChange={(e)=>searchTeachers(e.target.value)} />
            </InputGroup>

            <Button onClick={onOpenCreateTeacherModal}>Create Teacher</Button>
          </Wrap>
          <Box h={3}></Box>
          {teachers === null || teachers.length === 0 ? (
            <Center width={'100%'} height={'55%'}>
              <Flex>
                <Text fontSize={'3xl'} fontWeight={'semibold'}>
                  No Teachers Found
                </Text>
              </Flex>
            </Center>
          ) : (
            <Wrap>
              {teachers &&
                teachers.map(teacher => (
                  <WrapItem key={teacher._id}>
                    <TeacherCard
                      teacher={teacher}
                      reloadTeachers={getTeachers}
                      onOpenUpdateTeacherModal={onOpenUpdateTeacherModal}
                      user={user}
                    />
                    <Box mx={2} my={5}></Box>
                  </WrapItem>
                ))}
            </Wrap>
          )}
          <TeacherModal
            isOpen={isTeacherOpenModal}
            onClose={onCloseTeacherModal}
            user={user}
            activeTeacher={activeTeacher}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default TeachersPage;
