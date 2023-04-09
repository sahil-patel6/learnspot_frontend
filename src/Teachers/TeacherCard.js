import React, { useState } from 'react';
import {
  Stack,
  Card,
  CardBody,
  Text,
  Box,
  Button,
  HStack,
  Spacer,
  useToast,
  Avatar,
  WrapItem,
  Center,
  VStack,
  StackDivider,
} from '@chakra-ui/react';
import { API } from '../utils/API';
import axios from 'axios';
import { ConfirmationModal } from '../Components/ConfirmationModal';

export const TeacherCard = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

  const toast = useToast();

  const onCloseConfirmationModal = decision => {
    setIsOpenConfirmationModal(false);
    if (decision) {
      onDeleteTeacher();
    }
  };

  const onUpdateTeacher = () => {
    props.onOpenUpdateTeacherModal(props.teacher);
  };

  const onDeleteTeacher = async () => {
    setIsLoading(true);
    try {
      console.log(props.user._id);
      const result = await axios.delete(
        API.DELETE_TEACHER(props.teacher._id, props.user._id),
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        }
      );
      console.log(result.data);
      setIsLoading(false);
      props.reloadTeachers(props.user);
      toast({
        title: 'Deleted Teacher Successfully',
        status: 'success',
        duration: '2000',
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'An error occurred',
        description:
          error.response != null ? error.response.data.error : error.message,
        status: 'error',
        duration: '2000',
        isClosable: true,
        position: 'top-right',
      });
      setIsLoading(false);
    }
  };
  return (
    <Card bg={'blackAlpha.100'} w={'xs'} mb={5}>
      <CardBody>
        <Center>
          <WrapItem>
            <Avatar
              size="2xl"
              name={props.teacher.name}
              src={props.teacher.profile_pic}
            />
          </WrapItem>
        </Center>
        <Stack mt="3" spacing="3" divider={<StackDivider />}>
          <Text fontWeight={'bold'} fontSize={'20'} textAlign={'center'}>
            {props.teacher.name}
          </Text>
          <HStack>
            <Text fontWeight={'bold'} size={'xs'}>
              Email:{' '}
            </Text>
            <Text size={'xs'}>{props.teacher.email}</Text>
          </HStack>
          <HStack>
            <Text fontWeight={'bold'} size={'xs'}>
              Phone:{' '}
            </Text>
            <Text size={'xs'}>{props.teacher.phone}</Text>
          </HStack>
          <VStack align={'flex-start'}>
            <Text fontWeight={'bold'} size={'xs'}>
              Subjects:{' '}
            </Text>
            {props.teacher.subjects.map(subject => (
              <HStack
                bgColor={'green.200'}
                p={2}
                rounded={10}
                key={subject._id}
                w={'full'}
              >
                <Center>
                  <WrapItem>
                    <Avatar
                      size="sm"
                      name={subject.name}
                      src={subject.pic_url}
                    />
                  </WrapItem>
                </Center>

                <Text>{subject.name}</Text>
              </HStack>
            ))}
          </VStack>
          <HStack>
            <Button colorScheme={'blue'} onClick={onUpdateTeacher}>
              Update
            </Button>
            <Spacer />
            <Button
              colorScheme={'red'}
              onClick={() => {
                setIsOpenConfirmationModal(true);
              }}
              isLoading={isLoading}
            >
              Delete
            </Button>
            <ConfirmationModal
              isOpen={isOpenConfirmationModal}
              onClose={onCloseConfirmationModal}
            />
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
};
