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
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NavBar from '../Components/NavBar';
import { API } from '../utils/API';

import { useNavigate, useParams } from 'react-router';
import { SubjectCard } from './SubjectCard';
import { SubjectModal } from './SubjectModal';

const SubjectsPage = props => {
  const { department_id, semester_id } = useParams();
  console.log(department_id, semester_id);
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isSubjectOpenModal, setIsSubjectOpenModal] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const onOpenCreateSubjectModal = () => {
    setIsSubjectOpenModal(true);
    setActiveSubject(null);
  };
  const onCloseSubjectModal = subject => {
    setIsSubjectOpenModal(false);
    if (subject) {
      getSubjects(user);
    }
  };

  const onOpenUpdateSubjectModal = subject => {
    setIsSubjectOpenModal(true);
    setActiveSubject(subject);
  };

  const getSubjects = async user => {
    try {
      setSubjects(null);
      setActiveSubject(null);
      setIsLoading(true);
      const result = await axios.get(
        API.GET_ALL_SUBJECTS(semester_id, user._id),
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(result.data);
      setSubjects(result.data);
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
        getSubjects(temp);
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
          height={subjects === null ||
            subjects.subjects == null ||
            subjects.subjects.length === 0 ? "full":'max'}
          width={'100%'}
        >
          <Wrap width={'full'}>
              <Text fontSize={20} fontWeight={'bold'}>
                All Subjects{' '}
                {subjects != null && subjects.semester != null
                  ? `(${subjects.semester.department.name}->${subjects.semester.name})`
                  : ''}
                :
              </Text>
            <Spacer />
              <Button onClick={onOpenCreateSubjectModal}>Create Subject</Button>
          </Wrap>
          <Box h={3}></Box>
          {subjects === null ||
          subjects.subjects == null ||
          subjects.subjects.length === 0 ? (
            <Center width={'100%'} height={'70%'}>
              <Flex>
                <Text fontSize={'3xl'} fontWeight={'semibold'}>
                  No Subjects Found
                </Text>
              </Flex>
            </Center>
          ) : (
            <Wrap>
              {subjects &&
                subjects.subjects &&
                subjects.subjects.map(subject => (
                  <WrapItem key={subject._id}>
                    <SubjectCard
                      subject={subject}
                      reloadSubjects={getSubjects}
                      onOpenUpdateSubjectModal={onOpenUpdateSubjectModal}
                      user={user}
                    />
                    <Box mx={2} my={5}></Box>
                  </WrapItem>
                ))}
            </Wrap>
          )}
          <SubjectModal
            isOpen={isSubjectOpenModal}
            onClose={onCloseSubjectModal}
            user={user}
            activeSubject={activeSubject}
            department_id={department_id}
            semester_id={semester_id}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default SubjectsPage;
