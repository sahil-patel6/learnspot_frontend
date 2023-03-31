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
  Select,
  Flex,
  CircularProgress,
} from '@chakra-ui/react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { API } from '../utils/API';
import axios from 'axios';
import ErrorMessage from '../Components/ErrorMessage';

export const StudentModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const toast = useToast();

  const onCloseModal = () => {
    setIsLoading(false);
  };

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const getDepartments = async user => {
    try {
      setDepartments(null);
      setIsLoading(true);
      console.log(user);
      const result = await axios.get(API.GET_ALL_DEPARTMENTS(user._id), {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(result.data);
      setDepartments(result.data);
      setIsLoading(false);
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

  useEffect(() => {
    try {
      const temp = JSON.parse(localStorage.getItem('user'));
      setIsLoading(true);
      getDepartments(temp);
      if (props.activeStudent && departments != null) {
        setSelectedDepartment(
          departments.find(
            department =>
              department._id === props.activeStudent.semester.department._id
          )
        );
        setSelectedSemester(props.activeStudent.semester._id);
        console.log('YHHIIIHHH', selectedDepartment, selectedSemester);
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'An error occurred',
        description: error,
        status: 'error',
        duration: '2000',
        isClosable: true,
        position: 'top-right',
      });
      console.log(error);
    }
  }, [props]);

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
            {props.activeStudent == null ? 'Create' : 'Update'} Student Form
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {isLoading ? (
              <Center width={'100%'} height={'100%'}>
                <Flex>
                  <CircularProgress isIndeterminate color="green.300" />
                </Flex>
              </Center>
            ) : (
              <Formik
                initialValues={{
                  name:
                    props.activeStudent != null ? props.activeStudent.name : '',
                  email:
                    props.activeStudent != null
                      ? props.activeStudent.email
                      : '',
                  roll_number:
                    props.activeStudent != null
                      ? props.activeStudent.roll_number
                      : '',
                  department:
                    props.activeStudent != null
                      ? props.activeStudent.semester.department.name
                      : '',
                  semester:
                    props.activeStudent != null
                      ? props.activeStudent.semester.name
                      : '',
                  plainPassword: '',
                }}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={Yup.object({
                  name: Yup.string().required('Student Name is required'),
                  email: Yup.string()
                    .email('Invalid email address')
                    .required('Email is required'),
                  roll_number: Yup.string().required('Roll Number is required'),
                  semester: Yup.string().required('Please select semester'),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  console.log('SUBMITED');
                  try {
                    console.log(props.user._id);
                    let result = null;
                    if (props.activeStudent == null) {
                      setIsLoading(true);
                      console.log(
                        'HELLO BOYSSSS',
                        selectedSemester,
                        selectedDepartment
                      );
                      result = await axios.post(
                        API.CREATE_STUDENT(props.user._id),
                        {
                          name: values.name,
                          email: values.email,
                          roll_number: values.roll_number,
                          semester: selectedSemester._id,
                          plainPassword: values.plainPassword,
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
                          props.activeStudent == null ? 'Created' : 'Updated'
                        } Student Successfully`,
                        status: 'success',
                        duration: '2000',
                        isClosable: true,
                        position: 'top-right',
                      });
                    } else {
                      setIsLoading(true);
                      result = await axios.put(
                        API.UPDATE_STUDENT(
                          props.activeStudent._id,
                          props.user._id
                        ),
                        {
                          name: values.name,
                          email: values.email,
                          roll_number: values.roll_number,
                          semester: selectedSemester._id,
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
                          props.activeStudent == null ? 'Created' : 'Updated'
                        } Student Successfully`,
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
                    <FormLabel htmlFor="name">Student Name:</FormLabel>
                    <Input
                      id="name"
                      type="text"
                      {...formik.getFieldProps('name')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <ErrorMessage message={formik.errors.email} />
                    ) : null}
                    <FormLabel htmlFor="email">Student Email:</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.roll_number && formik.errors.roll_number ? (
                      <ErrorMessage message={formik.errors.roll_number} />
                    ) : null}
                    <FormLabel htmlFor="roll_number">
                      Student Roll Number:
                    </FormLabel>
                    <Input
                      id="roll_number"
                      type="text"
                      {...formik.getFieldProps('roll_number')}
                    />
                    <FormLabel> Department: </FormLabel>
                    <Select
                      placeholder="Select Department"
                      {...formik.getFieldProps('department')}
                      onChange={e => {
                        setSelectedDepartment(
                          departments.find(
                            department => department.name === e.target.value
                          )
                        );
                        formik.setFieldValue('department', e.target.value);
                      }}
                    >
                      {departments.map(department => (
                        <option value={department.name} key={department._id}>
                          {department.name}
                        </option>
                      ))}
                    </Select>
                    <FormLabel> Semester: </FormLabel>
                    <Select
                      placeholder="Select Semester"
                      {...formik.getFieldProps('semester')}
                      onChange={e => {
                        setSelectedSemester(
                          selectedDepartment.semesters.find(
                            semester => semester.name === e.target.value
                          )
                        );
                        formik.setFieldValue('semester', e.target.value);
                      }}
                    >
                      {selectedDepartment != null
                        ? selectedDepartment.semesters.map(semester => (
                            <option value={semester.name} key={semester._id}>
                              {semester.name}
                            </option>
                          ))
                        : null}
                    </Select>

                    {props.activeStudent == null ? (
                      <FormLabel htmlFor="plainPassword">
                        Student Password:
                      </FormLabel>
                    ) : null}
                    {props.activeStudent == null ? (
                      <Input
                        id="plainPassword"
                        type="password"
                        {...formik.getFieldProps('plainPassword')}
                      />
                    ) : null}
                    <ModalFooter>
                      <Button
                        colorScheme="green"
                        mr={3}
                        isLoading={isLoading}
                        type="submit"
                      >
                        {props.activeStudent == null ? 'Create' : 'Update'}{' '}
                        Student
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
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
