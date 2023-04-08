import React, { useRef, useState } from 'react';
import {
  Modal,
  ModalBody,
  FormLabel,
  Input,
  Button,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalContent,
  useToast,
  Spacer,
  Text,
  ListItem,
  List,
  HStack,
  Center,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { API } from '../utils/API';
import axios from 'axios';
import ErrorMessage from '../Components/ErrorMessage';
import { AddParentChildModal } from './AddParentChildModal';
import { ConfirmationModal } from '../Components/ConfirmationModal';

export const ParentModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const toast = useToast();

  const formikRef = useRef();

  const refreshState = () => {
    setIsLoading(false);
  };

  const onCloseConfirmationModal = decision => {
    setIsOpenConfirmationModal(false);
    if (decision) {
      setConfirmation(true);
      formikRef.current.submitForm();
    }
  };

  const [isAddParentChildModelOpen, setIsAddParentChildModelOpen] =
    useState(false);

  const onOpenAddParentChildModel = () => {
    setIsAddParentChildModelOpen(true);
  };

  const onCloseAddParentChildModel = student => {
    setIsAddParentChildModelOpen(false);
    if (student) {
      console.log(student);

      const s = formikRef.current.values.students.find(
        s => s._id == student._id
      );
      if (!s) {
        formikRef.current.values.students.push(student);
        formikRef.current.setFieldValue(
          'students',
          formikRef.current.values.students
        );
      }
    }
  };

  var removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (
        arr[i] &&
        arr[i].hasOwnProperty(attr) &&
        arguments.length > 2 &&
        arr[i][attr] === value
      ) {
        arr.splice(i, 1);
      }
    }
    return arr;
  };

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={() => {
          props.onClose();
          refreshState();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {props.activeParent == null ? 'Create' : 'Update'} Parent Form
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              innerRef={formikRef}
              initialValues={{
                name: props.activeParent != null ? props.activeParent.name : '',
                email:
                  props.activeParent != null ? props.activeParent.email : '',
                phone:
                  props.activeParent != null ? props.activeParent.phone : '',
                students:
                  props.activeParent != null
                    ? props.activeParent.students.slice()
                    : [],
                plainPassword: '',
              }}
              validateOnChange={false}
              validateOnBlur={false}
              validationSchema={Yup.object({
                name: Yup.string().required('Parent Name is required'),
                email: Yup.string()
                  .email('Invalid email address')
                  .required('Email is required'),
                phone: Yup.string()
                  .length(10, 'Phone number should be valid')
                  .required('Phone number is required'),
                students: Yup.array().min(1, 'Please add atleast one child'),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                console.log('SUBMITED');
                try {
                  console.log(props.user._id);
                  let result = null;
                  if (props.activeParent == null) {
                    if (values.plainPassword.length < 8) {
                      toast({
                        title: 'Password should contain atleast 8 characters',
                        status: 'error',
                        duration: '2000',
                        isClosable: true,
                        position: 'top-right',
                      });
                      return;
                    }
                    if (!confirmation) {
                      setIsOpenConfirmationModal(true);
                      return;
                    }

                    setIsLoading(true);
                    result = await axios.post(
                      API.CREATE_PARENT(props.user._id),
                      {
                        name: values.name,
                        email: values.email,
                        phone: values.phone,
                        students: values.students.map(student => student._id),
                        plainPassword: values.plainPassword,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${props.user.token}`,
                        },
                      }
                    );
                    setIsLoading(true);
                    console.log(result.data, "PARENT's CHILD");
                    setIsLoading(false);
                    props.onClose(result.data);
                    refreshState();
                    toast({
                      title: `${
                        props.activeParent == null ? 'Created' : 'Updated'
                      } Parent Successfully`,
                      status: 'success',
                      duration: '2000',
                      isClosable: true,
                      position: 'top-right',
                    });
                  } else {
                    if (!confirmation) {
                      setIsOpenConfirmationModal(true);
                      return;
                    }

                    setIsLoading(true);
                    result = await axios.put(
                      API.UPDATE_PARENT(props.activeParent._id, props.user._id),
                      {
                        name: values.name,
                        email: values.email,
                        phone: values.phone,
                        students: values.students.map(student => student._id),
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${props.user.token}`,
                        },
                      }
                    );

                    setIsLoading(true);
                    console.log(result.data);
                    setIsLoading(false);
                    props.onClose(result.data);
                    refreshState();
                    toast({
                      title: `${
                        props.activeParent == null ? 'Created' : 'Updated'
                      } Parent Successfully`,
                      status: 'success',
                      duration: '2000',
                      isClosable: true,
                      position: 'top-right',
                    });
                  }
                  setConfirmation(false);
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
                  setConfirmation(false);
                  setIsLoading(false);
                }
              }}
            >
              {formik => (
                <form onSubmit={formik.handleSubmit}>
                  {formik.touched.name && formik.errors.name ? (
                    <ErrorMessage message={formik.errors.name} />
                  ) : null}
                  <FormLabel htmlFor="name">Parent Name:</FormLabel>
                  <Input
                    id="name"
                    type="text"
                    {...formik.getFieldProps('name')}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <ErrorMessage message={formik.errors.email} />
                  ) : null}
                  <FormLabel htmlFor="email">Parent Email:</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    {...formik.getFieldProps('email')}
                  />
                  
                  {formik.touched.phone && formik.errors.phone ? (
                      <ErrorMessage message={formik.errors.phone} />
                    ) : null}
                    <FormLabel htmlFor="phone">Parent Phone:</FormLabel>
                    <Input
                      id="phone"
                      type="number"
                      {...formik.getFieldProps('phone')}
                    />
                  {props.activeParent == null ? (
                    <FormLabel htmlFor="plainPassword">
                      Parent Password:
                    </FormLabel>
                  ) : null}
                  {props.activeParent == null ? (
                    <Input
                      id="plainPassword"
                      type="password"
                      {...formik.getFieldProps('plainPassword')}
                    />
                  ) : null}
                  {formik.touched.students && formik.errors.students ? (
                    <ErrorMessage message={formik.errors.students} />
                  ) : null}
                  <FormLabel>Parent students: </FormLabel>
                  <List spacing={3}>
                    {formik.values.students.map(student => (
                      <ListItem
                        bg={'blackAlpha.200'}
                        px={3}
                        py={2}
                        borderRadius={3}
                        key={student._id}
                      >
                        <HStack>
                          <Text>{student.name}</Text>
                          <Spacer />
                          <DeleteIcon
                            onClick={e => {
                              e.preventDefault();
                              console.log(formik.values.students);
                              removeByAttr(
                                formik.values.students,
                                '_id',
                                student._id
                              );
                              formik.setFieldValue(
                                'students',
                                formik.values.students
                              );
                              // setSelectedstudents(values.students);
                              // console.log(values.students);
                            }}
                          />
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                  <Center>
                    <Button
                      colorScheme={'green'}
                      mt={3}
                      onClick={onOpenAddParentChildModel}
                    >
                      Add Child
                    </Button>
                  </Center>
                  <ModalFooter>
                    <Button
                      colorScheme="green"
                      mr={3}
                      isLoading={isLoading}
                      type="submit"
                    >
                      {props.activeParent == null ? 'Create' : 'Update'} Parent
                    </Button>
                    <Button
                      onClick={() => {
                        props.onClose();
                        refreshState();
                      }}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </form>
              )}
            </Formik>
            <AddParentChildModal
              isOpen={isAddParentChildModelOpen}
              onClose={onCloseAddParentChildModel}
              user={props.user}
            />
            <ConfirmationModal
              isOpen={isOpenConfirmationModal}
              onClose={onCloseConfirmationModal}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
