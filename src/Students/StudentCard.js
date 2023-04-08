import React, { useState } from 'react';
import {
  Stack,
  Card,
  CardBody,
  Heading,
  Text,
  Box,
  Button,
  HStack,
  Spacer,
  useToast,
  Avatar,
  WrapItem,
  Center,
  StackDivider,
} from '@chakra-ui/react';
import { API } from '../utils/API';
import axios from 'axios';
import { ConfirmationModal } from '../Components/ConfirmationModal';

export const StudentCard = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

  const toast = useToast();

  const onCloseConfirmationModal = decision => {
    setIsOpenConfirmationModal(false);
    if (decision) {
      onDeleteStudent();
    }
  };
  const onUpdateStudent = () => {
    props.onOpenUpdateStudentModal(props.student);
  };

  const onDeleteStudent = async () => {
    setIsLoading(true);
    try {
      console.log(props.user._id);
      const result = await axios.delete(
        API.DELETE_STUDENT(props.student._id, props.user._id),
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        }
      );
      console.log(result.data);
      setIsLoading(false);
      props.reloadStudents(props.user);
      toast({
        title: 'Deleted Student Successfully',
        status: 'success',
        duration: '2000',
        isClosable: true,
        position: 'top-right',
      });
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
  return (
    <Card bg={'blackAlpha.100'} w={'xs'} mb={5}>
      <CardBody>
        <Center>
          <WrapItem>
            <Avatar
              size="2xl"
              name={props.student.name}
              src={props.student.profile_pic}
            />
          </WrapItem>
        </Center>
        <Stack mt="3" spacing="3" divider={<StackDivider />}>
          <Text fontWeight={'bold'} fontSize={'20'} textAlign={'center'}>
            {props.student.name}
          </Text>
          <HStack>
            <Text fontWeight={'bold'} size={'xs'}>
              Email:{' '}
            </Text>
            <Text size={'xs'}>{props.student.email}</Text>
          </HStack>
          <HStack>
            <Text fontWeight={'bold'} size={'xs'}>
              Roll Number:{' '}
            </Text>
            <Text size={'xs'}>{props.student.roll_number}</Text>
          </HStack>
          <HStack>
            <Text fontWeight={'bold'} size={'xs'}>
              Phone:{' '}
            </Text>
            <Text size={'xs'}>{props.student.phone}</Text>
          </HStack>
          <HStack>
            <Text fontWeight={'bold'} size={'xs'}>
              Course:{' '}
            </Text>
            <Box bgColor={'green.200'} px={2} py={1} rounded={5}>
              <Text>{props.student.semester.department.name}</Text>
            </Box>
            <Box bgColor={'green.200'} px={2} py={1} rounded={5}>
              <Text>{props.student.semester.name}</Text>
            </Box>
          </HStack>
          <HStack>
            <Button colorScheme={'blue'} onClick={onUpdateStudent}>
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
