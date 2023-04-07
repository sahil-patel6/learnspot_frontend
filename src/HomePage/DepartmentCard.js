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
import { ConfirmationModal } from '../Components/ConfirmationModal';

export const DepartmentCard = props => {
  const [isLoading, setIsLoading] = useState(false);

  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

  const toast = useToast();

  const onCloseConfirmationModal = decision => {
    setIsOpenConfirmationModal(false);
    if (decision) {
      onDeleteDepartment();
    }
  };

  const onUpdateDepartment = () => {
    props.onOpenUpdateDepartmentModal(props.department);
  };

  const onDeleteDepartment = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        API.DELETE_DEPARTMENT(props.department._id, props.user._id),
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        }
      );
      setIsLoading(false);
      props.reloadDepartments(props.user);
      toast({
        title: 'Deleted Department Successfully',
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
    <Card bg={'blackAlpha.100'} minW={'sm'} mb={5}>
      <Link to={`/department/${props.department._id}/semesters`}>
        <CardHeader>
          <Heading size="md">Department Name: {props.department.name}</Heading>
        </CardHeader>
      </Link>
      <CardBody>
        <Link to={`/department/${props.department._id}/semesters`}>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Description
              </Heading>
              <Text pt="2" fontSize="sm">
                {props.department.description}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Total Years
              </Heading>
              <Text pt="2" fontSize="sm">
                {props.department.total_years}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Total Semesters
              </Heading>
              <Text pt="2" fontSize="sm">
                {props.department.semesters.length}
              </Text>
            </Box>
          </Stack>
        </Link>
        <HStack marginTop={5}>
          <Button colorScheme={'blue'} onClick={onUpdateDepartment}>
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
      </CardBody>
    </Card>
  );
};
