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
  Wrap,
  ListItem,
  UnorderedList,
  Center,
} from '@chakra-ui/react';
import { API } from '../utils/API';
import axios from 'axios';
import { ConfirmationModal } from '../Components/ConfirmationModal';

export const TeacherCard = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmationModal,setIsOpenConfirmationModal] = useState(false);

  const toast = useToast();

  const onCloseConfirmationModal = (decision) => {
    setIsOpenConfirmationModal(false);
    if (decision){
      onDeleteTeacher()
    }
  }

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
    <Card bg={'blackAlpha.100'} minW={'xs'} mb={5}>
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
        <Stack mt="6" spacing="6">
          <Heading size="md">{props.teacher.name}</Heading>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Email:
            </Heading>
            <Text pt="2" size="xs">
              {props.teacher.email}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Phone No:
            </Heading>
            <Text pt="2" size="xs">
              {props.teacher.phone}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Subjects:
            </Heading>
            <Wrap>
              <UnorderedList>
                {props.teacher.subjects.map(subject => (
                  <ListItem pt="2" size="xs" key={subject._id}>
                    <Text>{subject.name}</Text>
                  </ListItem>
                ))}
              </UnorderedList>
            </Wrap>
          </Box>
          <HStack>
            <Button colorScheme={'blue'} onClick={onUpdateTeacher}>
              Update
            </Button>
            <Spacer />
            <Button
              colorScheme={'red'}
              onClick={()=>{setIsOpenConfirmationModal(true)}}
              isLoading={isLoading}
            >
              Delete
            </Button>
            <ConfirmationModal isOpen={isOpenConfirmationModal} onClose={onCloseConfirmationModal}/>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
};
