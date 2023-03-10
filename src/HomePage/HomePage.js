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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [isCreateDepartmentOpenModal, setIsCreateDepartmentOpenModal] =
    useState(false);
  const [isUpdateDepartmentOpenModal, setIsUpdateDepartmentOpenModal] =
    useState(false);

  const toast = useToast();

  const onOpenCreateDepartmentModal = () =>
    setIsCreateDepartmentOpenModal(true);
  const onCloseCreateDepartmentModal = department => {
    setIsCreateDepartmentOpenModal(false);
    if (department) {
      getDepartments(user);
    }
  };

  const onOpenUpdateDepartmentModal = () =>
    setIsUpdateDepartmentOpenModal(true);
  const onCloseUpdateDepartmentModal = department => {
    setIsUpdateDepartmentOpenModal(false);
    if (department) {
      getDepartments(user);
    }
  };

  const getDepartments = async user => {
    try {
      setDepartments(null);
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
        navigate("/signin")
      } else {
        getDepartments(temp);
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
              All DEPARTMENTS:
            </Text>
            <Spacer />
            <Button onClick={onOpenCreateDepartmentModal}>
              Create Department
            </Button>
          </HStack>
          <Box h={3}></Box>
          <Wrap>
            {departments &&
              departments.map(department => (
                <WrapItem key={department._id} my={500}>
                  {/* <Link to={`/department/${department._id}/semesters`}> */}
                    <DepartmentCard
                      department={department}
                      reloadDepartments={getDepartments}
                      onOpenUpdateDepartmentModal={onOpenUpdateDepartmentModal}
                      user={user}
                    />
                    <Box mx={5} my={5}></Box>
                    <DepartmentModal
                      isOpen={isUpdateDepartmentOpenModal}
                      onClose={onCloseUpdateDepartmentModal}
                      user={user}
                      department={department}
                      mode={'Update'}
                    />
                  {/* </Link> */}
                </WrapItem>
              ))}
          </Wrap>
          <DepartmentModal
            isOpen={isCreateDepartmentOpenModal}
            onClose={onCloseCreateDepartmentModal}
            user={user}
            mode={'Create'}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default HomePage;
