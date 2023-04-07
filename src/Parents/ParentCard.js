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

export const ParentCard = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmationModal,setIsOpenConfirmationModal] = useState(false);

  const toast = useToast();

  const onCloseConfirmationModal = (decision) => {
    setIsOpenConfirmationModal(false);
    if (decision){
      onDeleteParent()
    }
  }

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
              name={props.parent.name}
              src={props.parent.profile_pic}
            />
          </WrapItem>
        </Center>
        <Stack mt="6" spacing="6">
          <Heading size="md">{props.parent.name}</Heading>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Email:
            </Heading>
            <Text pt="2" size="xs">
              {props.parent.email}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Phone No:
            </Heading>
            <Text pt="2" size="xs">
              {props.parent.phone}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Students:
            </Heading>
            <Wrap>
              <UnorderedList>
                {props.parent.students.map(parent => (
                  <ListItem pt="2" size="xs" key={parent._id}>
                    <Text key={parent._id}>{parent.name}</Text>
                  </ListItem>
                ))}
              </UnorderedList>
            </Wrap>
          </Box>
          <HStack>
            <Button colorScheme={'blue'} onClick={onUpdateParent}>
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
