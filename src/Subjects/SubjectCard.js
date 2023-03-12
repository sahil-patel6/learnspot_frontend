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
} from '@chakra-ui/react';
import { API } from '../utils/API';
import axios from 'axios';

export const SubjectCard = props => {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

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
        description: error.response,
        status: 'error',
        duration: '2000',
        isClosable: true,
        position: 'top-right',
      });
      setIsLoading(false);
    }
  };

  return (
    <Card bg={'blackAlpha.100'} maxW={'sm'}>
      <CardBody>
        <Image
          src={props.subject.pic_url}
          alt="Green double couch with wooden legs"
          borderRadius="lg"
          height={225}
          width={'sm'}
          align={"center"}
          fit="cover"
        />
        <Stack mt="6" spacing="6">
          <Heading size="md">{props.subject.name}</Heading>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Total Credits
            </Heading>
            <Text pt="2" size="xs">
              {props.subject.credits}
            </Text>
          </Box>
          <HStack>
            <Button colorScheme={'blue'} onClick={onUpdateSubject}>
              Update
            </Button>
            <Spacer />
            <Button
              colorScheme={'red'}
              onClick={onDeleteSubject}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
};
