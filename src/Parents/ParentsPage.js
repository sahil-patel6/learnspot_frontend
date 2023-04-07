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
import { useNavigate } from 'react-router';
import NavBar from '../Components/NavBar';
import { API } from '../utils/API';

import { ParentCard } from './ParentCard';
import {ParentModal } from './ParentModal';

const ParentPage = props => {
  const [user, setUser] = useState(null);
  const [parents, setParents] = useState(null);
  const [activeParent, setActiveParent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isParentOpenModal, setIsParentOpenModal] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const onOpenCreateParentModal = () => {
    setIsParentOpenModal(true);
    setActiveParent(null);
  };
  const onCloseParentModal = parent => {
    setIsParentOpenModal(false);
    if (parent) {
      getParents(user);
    }
  };

  const onOpenUpdateParentModal = parent => {
    setIsParentOpenModal(true);
    setActiveParent(parent);
  };

  const getParents = async user => {
    try {
      setParents(null);
      setActiveParent(null);
      setIsLoading(true);
      const result = await axios.get(API.GET_ALL_PARENTS(user._id), {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(result.data);
      setParents(result.data);
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
        navigate("/signin");
        // window.location.href = '/signin';
      } else {
        getParents(temp);
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
        isLoading || parents === null || parents.length === 0 ? '100vh' : 'full'
      }
    >
      <NavBar user={user} location={"Parents"}/>
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
              All Parents:
            </Text>
            <Spacer />
            <Button onClick={onOpenCreateParentModal}>Create Parent</Button>
          </HStack>
          <Box h={3}></Box>
          {parents === null || parents.length === 0 ? (
            <Center width={'100%'} height={'100%'}>
              <Flex>
                <Text fontSize={'3xl'} fontWeight={'semibold'}>
                  No Parents Found
                </Text>
              </Flex>
            </Center>
          ) : (
            <Wrap>
              {parents &&
                parents.map(parent => (
                  <WrapItem key={parent._id}>
                    <ParentCard
                      parent={parent}
                      reloadParents={getParents}
                      onOpenUpdateParentModal={onOpenUpdateParentModal}
                      user={user}
                    />
                    <Box mx={2} my={5}></Box>
                  </WrapItem>
                ))}
            </Wrap>
          )}
          <ParentModal
            isOpen={isParentOpenModal}
            onClose={onCloseParentModal}
            user={user}
            activeParent={activeParent}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default ParentPage;
