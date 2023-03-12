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
import { DepartmentModal } from './DepartmentModal';
import { DepartmentCard } from './DepartmentCard';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [isDepartmentOpenModal, setIsDepartmentOpenModal] = useState(false);

  const toast = useToast();

  const onOpenCreateDepartmentModal = () => {
    setIsDepartmentOpenModal(true);
    setActiveDepartment(null);
  };

  const onOpenUpdateDepartmentModal = department => {
    setIsDepartmentOpenModal(true);
    setActiveDepartment(department);
  };

  const onCloseDepartmentModal = department => {
    setIsDepartmentOpenModal(false);
    if (department) {
      getDepartments(user);
    }
  };

  const getDepartments = async user => {
    try {
      setDepartments(null);
      setActiveDepartment(null);
      setIsLoading(true);
      const result = await axios.get(API.GET_ALL_DEPARTMENTS(user._id), {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(result.data);
      setDepartments(result.data);
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
        getDepartments(temp);
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
    <VStack align={'flex-start'}  width={'100%'} height={isLoading || departments ==null || departments.length == 0 ?  "100vh" : "full"}>
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
              All DEPARTMENTS:
            </Text>
            <Spacer />
            <Button onClick={onOpenCreateDepartmentModal}>
              Create Department
            </Button>
          </HStack>
          <Box h={3}></Box>
          {departments == null || departments.length == 0 ? (
            <Center width={'100%'} height={'100%'}>
              <Flex>
                <Text fontSize={'3xl'} fontWeight={'semibold'}>
                  No Departments Found
                </Text>
              </Flex>
            </Center>
          ) : (
            <Wrap>
              {departments &&
                departments.map(department => (
                  <WrapItem key={department._id}>
                    <DepartmentCard
                      department={department}
                      reloadDepartments={getDepartments}
                      onOpenUpdateDepartmentModal={onOpenUpdateDepartmentModal}
                      user={user}
                    />
                    <Box mx={5} my={5}></Box>
                  </WrapItem>
                ))}
            </Wrap>
          )}
          <DepartmentModal
            isOpen={isDepartmentOpenModal}
            onClose={onCloseDepartmentModal}
            user={user}
            activeDepartment={activeDepartment}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default HomePage;
