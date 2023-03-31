import React, { useEffect, useRef, useState } from 'react';
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
import { AddTeacherSubjectModal } from './AddTeacherSubjectModal';

export const TeacherModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const formikRef = useRef();

  const onCloseModal = () => {
    setIsLoading(false);
  };

  const [isAddTeacherSubjectModelOpen, setIsAddTeacherSubjectModelOpen] =
    useState(false);

  const onOpenAddTeacherSubjectModel = () => {
    setIsAddTeacherSubjectModelOpen(true);
  };

  const onCloseAddTeacherSubjectModel = subject => {
    setIsAddTeacherSubjectModelOpen(false);
    if (subject) {
      console.log(subject);
      formikRef.current.values.subjects.push(subject);
      formikRef.current.setFieldValue(
        'subjects',
        formikRef.current.values.subjects
      );
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
          onCloseModal();
          props.onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {props.activeTeacher == null ? 'Create' : 'Update'} Teacher Form
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              innerRef={formikRef}
              initialValues={{
                name:
                  props.activeTeacher != null ? props.activeTeacher.name : '',
                email:
                  props.activeTeacher != null ? props.activeTeacher.email : '',
                subjects:
                  props.activeTeacher != null
                    ? props.activeTeacher.subjects.slice()
                    : [],
                plainPassword: '',
              }}
              validateOnChange={false}
              validateOnBlur={false}
              validationSchema={Yup.object({
                name: Yup.string().required('Teacher Name is required'),
                email: Yup.string()
                  .email('Invalid email address')
                  .required('Email is required'),
                subjects: Yup.array().min(1, 'Please add atleast one subject'),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                console.log('SUBMITED');
                try {
                  console.log(props.user._id);
                  let result = null;
                  if (props.activeTeacher == null) {
                    setIsLoading(true);
                    result = await axios.post(
                      API.CREATE_TEACHER(props.user._id),
                      {
                        name: values.name,
                        email: values.email,
                        subjects: values.subjects.map(subject => subject._id),
                        plainPassword: values.plainPassword
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
                    onCloseModal();
                    props.onClose(result.data);
                    toast({
                      title: `${
                        props.activeTeacher == null ? 'Created' : 'Updated'
                      } Teacher Successfully`,
                      status: 'success',
                      duration: '2000',
                      isClosable: true,
                      position: 'top-right',
                    });
                  } else {
                    setIsLoading(true);
                    result = await axios.put(
                      API.UPDATE_TEACHER(
                        props.activeTeacher._id,
                        props.user._id
                      ),
                      {
                        name: values.name,
                        email: values.email,
                        subjects: values.subjects.map(subject => subject._id),
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
                    onCloseModal();
                    props.onClose(result.data);
                    toast({
                      title: `${
                        props.activeTeacher == null ? 'Created' : 'Updated'
                      } Teacher Successfully`,
                      status: 'success',
                      duration: '2000',
                      isClosable: true,
                      position: 'top-right',
                    });
                  }
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
              }}
            >
              {formik => (
                <form onSubmit={formik.handleSubmit}>
                  {formik.touched.name && formik.errors.name ? (
                    <ErrorMessage message={formik.errors.name} />
                  ) : null}
                  <FormLabel htmlFor="name">Teacher Name:</FormLabel>
                  <Input
                    id="name"
                    type="text"
                    {...formik.getFieldProps('name')}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <ErrorMessage message={formik.errors.email} />
                  ) : null}
                  <FormLabel htmlFor="email">Teacher Email:</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    {...formik.getFieldProps('email')}
                  />
                  {props.activeTeacher == null ? (
                    <FormLabel htmlFor="plainPassword">
                      Teacher Password:
                    </FormLabel>
                  ) : null}
                  {props.activeTeacher == null ? (
                    <Input
                      id="plainPassword"
                      type="password"
                      {...formik.getFieldProps('plainPassword')}
                    />
                  ) : null}
                  {formik.touched.subjects && formik.errors.subjects ? (
                    <ErrorMessage message={formik.errors.subjects} />
                  ) : null}
                  <FormLabel>Teacher Subjects: </FormLabel>
                  <List spacing={3}>
                    {formik.values.subjects.map(subject => (
                      <ListItem
                        bg={'blackAlpha.200'}
                        px={3}
                        py={2}
                        borderRadius={3}
                        key={subject._id}
                      >
                        <HStack>
                          <Text>{subject.name}</Text>
                          <Spacer />
                          <DeleteIcon
                            onClick={e => {
                              e.preventDefault();
                              console.log(formik.values.subjects);
                              removeByAttr(
                                formik.values.subjects,
                                '_id',
                                subject._id
                              );
                              formik.setFieldValue(
                                'subjects',
                                formik.values.subjects
                              );
                              // setSelectedSubjects(values.subjects);
                              // console.log(values.subjects);
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
                      onClick={onOpenAddTeacherSubjectModel}
                    >
                      Add Subject
                    </Button>
                  </Center>
                  <ModalFooter>
                    <Button
                      colorScheme="green"
                      mr={3}
                      isLoading={isLoading}
                      type="submit"
                    >
                      {props.activeTeacher == null ? 'Create' : 'Update'}{' '}
                      Teacher
                    </Button>
                    <Button
                      onClick={() => {
                        onCloseModal();
                        props.onClose();
                      }}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </form>
              )}
            </Formik>
            <AddTeacherSubjectModal
              isOpen={isAddTeacherSubjectModelOpen}
              onClose={onCloseAddTeacherSubjectModel}
              user={props.user}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};