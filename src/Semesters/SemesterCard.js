import React, { useState } from 'react';
import {
  Stack,
  StackDivider,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Box,
  Button,
  HStack,
  Spacer,
  useToast,
} from '@chakra-ui/react';
import { API } from '../utils/API';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const SemesterCard = props => {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const onUpdateSemester = () => {
    props.onOpenUpdateSemesterModal(props.semester);
  };

  const onDeleteSemester = async () => {
    setIsLoading(true);
    try {
      console.log(props.user._id);
      const result = await axios.delete(
        API.DELETE_SEMESTER(props.semester._id, props.user._id),
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        }
      );
      console.log(result.data);
      setIsLoading(false);
      props.reloadSemesters(props.user);
      toast({
        title: 'Deleted Semester Successfully',
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
    <Card bg={'blackAlpha.100'} minW={"sm"} mb={5}>
      <Link to={`${props.semester._id}/subjects`}>
        <CardHeader>
          <Heading size="md">Semester Name: {props.semester.name}</Heading>
        </CardHeader>
      </Link>
      <CardBody>
        <Link to={`${props.semester._id}/subjects`}>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Total Subjects
              </Heading>
              <Text pt="2" fontSize="sm">
                {props.semester.subjects.length}
              </Text>
            </Box>
          </Stack>
        </Link>
        <HStack marginTop={5}>
          <Button colorScheme={'blue'} onClick={onUpdateSemester}>
            Update
          </Button>
          <Spacer />
          <Button
            colorScheme={'red'}
            onClick={onDeleteSemester}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
};
