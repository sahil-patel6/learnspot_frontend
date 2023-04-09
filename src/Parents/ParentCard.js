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
  Badge,
  StackDivider,
  VStack,
} from '@chakra-ui/react';
import { API } from '../utils/API';
import axios from 'axios';
import { ConfirmationModal } from '../Components/ConfirmationModal';

export const ParentCard = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

  const toast = useToast();

  const onCloseConfirmationModal = decision => {
    setIsOpenConfirmationModal(false);
    if (decision) {
      onDeleteParent();
    }
  };

  const onUpdateParent = () => {
    props.onOpenUpdateParentModal(props.parent);
  };

  const onDeleteParent = async () => {
    setIsLoading(true);
    try {
      console.log(props.user._id);
      const result = await axios.delete(
        API.DELETE_PARENT(props.parent._id, props.user._id),
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        }
      );
      console.log(result.data);
      setIsLoading(false);
      props.reloadParents(props.user);
      toast({
        title: 'Deleted Parent Successfully',
        status: 'success',
        duration: '2000',
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'An error occurred',
        description: error.response != null ? error.response.data.error : error.message,
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
              name={props.parent.name}
              src={props.parent.profile_pic}
            />
          </WrapItem>
        </Center>
        <Stack mt="3" spacing="3" divider={<StackDivider />}>
          <Text fontWeight={'bold'} fontSize={'20'} textAlign={'center'}>
            {props.parent.name}
          </Text>
          <HStack>
            <Text fontWeight={'bold'} size={'xs'}>
              Email:{' '}
            </Text>
            <Text size={'xs'}>{props.parent.email}</Text>
          </HStack>
          <HStack>
            <Text fontWeight={'bold'} size={'xs'}>
              Phone:{' '}
            </Text>
            <Text size={'xs'}>{props.parent.phone}</Text>
          </HStack>
          <VStack align={'flex-start'}>
            <Text fontWeight={'bold'} size={'xs'}>
              Students:{' '}
            </Text>
            {props.parent.students.map(student => (
              <Box
                bgColor={'green.200'}
                p={2}
                rounded={5}
                key={student._id}
                w={'full'}
              >
                <Text>{student.name}</Text>
              </Box>
            ))}
          </VStack>

          <HStack>
            <Button colorScheme={'blue'} onClick={onUpdateParent}>
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
