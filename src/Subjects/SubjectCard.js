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
  Image,
  Center,
  Avatar,
  StackDivider
} from '@chakra-ui/react';
import { API } from '../utils/API';
import axios from 'axios';
import { ConfirmationModal } from '../Components/ConfirmationModal';

export const SubjectCard = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmationModal,setIsOpenConfirmationModal] = useState(false);

  const toast = useToast();

  const onCloseConfirmationModal = (decision) => {
    setIsOpenConfirmationModal(false);
    if (decision){
      onDeleteSubject()
    }
  }

  const onUpdateSubject = () => {
    props.onOpenUpdateSubjectModal(props.subject);
  };

  const onDeleteSubject = async () => {
    setIsLoading(true);
    try {
      console.log(props.user._id);
      const result = await axios.delete(
        API.DELETE_SUBJECT(props.subject._id, props.user._id),
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        }
      );
      console.log(result.data);
      setIsLoading(false);
      props.reloadSubjects(props.user);
      toast({
        title: 'Deleted Subject Successfully',
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
        <Image
          src={props.subject.pic_url}
          borderRadius="lg"
          height={200}
          width={'full'}
          align={'center'}
          fit="cover"
        />
        <Stack divider={<StackDivider />} mt="6" spacing="3">
          <Heading size="md">{props.subject.name}</Heading>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Total Credits
            </Heading>
            <Text pt="2" size="xs">
              {props.subject.credits}
            </Text>
          </Box>
          {props.subject.teacher != null ? (
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Taught By:
              </Heading>
              <HStack mt={1}>
                <Center mt={2}>
                    <Avatar
                      size="xs"
                      name={props.subject.teacher.name}
                      src={props.subject.teacher.profile_pic}
                    />
                </Center>
                <Text pt="2" size="xs">
                  {props.subject.teacher.name}
                </Text>
              </HStack>
            </Box>
          ) : null}
          <HStack>
            <Button colorScheme={'blue'} onClick={onUpdateSubject}>
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
