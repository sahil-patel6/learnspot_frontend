import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  ModalBody,
  FormLabel,
  Button,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalContent,
  useToast,
  Center,
  Select,
  Flex,
  CircularProgress,
  Box,
  Text,
  Checkbox,
} from '@chakra-ui/react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { API } from '../utils/API';
import axios from 'axios';
import ErrorMessage from '../Components/ErrorMessage';
import { ConfirmationModal } from '../Components/ConfirmationModal';

export const PromoteStudentsModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedToSemester, setSelectedToSemester] = useState(null);

  const [students, setStudents] = useState(null);

  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const toast = useToast();
  const formikRef = useRef();

  const refreshState = () => {
    setSelectedDepartment(null);
    setSelectedSemester(null);
    setSelectedToSemester(null);
    setDepartments([]);
    setStudents(null);
    setIsLoading(false);
    setIsStudentsLoading(false);
  };

  const onCloseConfirmationModal = decision => {
    setIsOpenConfirmationModal(false);
    if (decision) {
      setConfirmation(true);
      formikRef.current.submitForm();
    }
  };

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const getStudents = async (user, semester) => {
    try {
      setStudents(null);
      formikRef.current.setFieldValue('students', []);
      setIsStudentsLoading(true);
      const result = await axios.get(
        API.GET_ALL_STUDENTS_BY_SEMESTER(semester, user._id),
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log(result.data);
      setStudents(
        result.data.map(s => {
          return { ...s, promote: true };
        })
      );
      formikRef.current.setFieldValue(
        'students',
        result.data.map(s => {
          return { ...s, promote: true };
        })
      );
      console.log(students, 'GET STUDENTS');
      setIsStudentsLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: 'An error occurred',
        description: error.response != null ? error.response.data.error : error.message && error,
        status: 'error',
        duration: '2000',
        isClosable: true,
        position: 'top-right',
      });
      setIsStudentsLoading(false);
    }
  };

  const getDepartments = async user => {
    try {
      setStudents(null);
      setDepartments(null);
      refreshState();
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
        description: error.response != null ? error.response.data.error : error.message,
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
          props.onClose();
          refreshState();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Promote Students Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Center width={'100%'} height={'100%'}>
                <Flex>
                  <CircularProgress isIndeterminate color="green.300" />
                </Flex>
              </Center>
            ) : (
              <Formik
                innerRef={formikRef}
                initialValues={{
                  department:
                    selectedDepartment == null ? '' : selectedDepartment.name,
                  semester:
                    selectedSemester == null ? '' : selectedSemester.name,
                  toSemester:
                    selectedToSemester == null ? '' : selectedToSemester.name,
                  students: students ?? [],
                }}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={Yup.object({
                  department: Yup.string().required('Please select Department'),
                  semester: Yup.string().required('Please select semester'),
                  toSemester: Yup.string().required(
                    'Please select to semester'
                  ),
                  students: Yup.array().min(
                    1,
                    'Please select atleast one student to promote'
                  ),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  console.log('SUBMITED');
                  try {
                    console.log(props.user._id);
                    let result = null;
                    console.log(selectedSemester,selectedToSemester, 'INSIDE SUNBMIT');
                    if (students == null){
                      toast({
                        title: 'Please select department and semester',
                        status: 'error',
                        duration: '2000',
                        isClosable: true,
                        position: 'top-right',
                      });
                      return; 
                    }
                    if (!students.find(s => s.promote === true)){
                      toast({
                        title: 'Please select atleast one student to promote',
                        status: 'error',
                        duration: '2000',
                        isClosable: true,
                        position: 'top-right',
                      });
                      return;
                    }
                    if (selectedSemester._id == selectedToSemester._id){
                      toast({
                        title: 'Semester and promote to semester should be diffrent',
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
                    console.log(
                      'HELLO BOYSSSS',
                      selectedSemester,
                      selectedDepartment
                    );
                    let selectedStudents = [];
                    students.map(s => {
                      if (s.promote) {
                        selectedStudents.push(s._id);
                      }
                    });
                    result = await axios.post(
                      API.PROMOTE_STUDENTS(props.user._id),
                      {
                        students: selectedStudents,
                        semester: selectedToSemester._id,
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
                      title: 'Promoted Student Successfully',
                      status: 'success',
                      duration: '2000',
                      isClosable: true,
                      position: 'top-right',
                    });
                    setConfirmation(false);
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
                    setConfirmation(false);
                  }
                }}
              >
                {formik => (
                  <form onSubmit={formik.handleSubmit}>
                    {formik.touched.department && formik.errors.department ? (
                      <ErrorMessage message={formik.errors.department} />
                    ) : null}
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
                        setSelectedSemester(null);
                        setSelectedToSemester(null);
                        formik.setFieldValue('department', e.target.value);
                      }}
                      value={
                        selectedDepartment == null
                          ? ''
                          : selectedDepartment.name
                      }
                    >
                      {departments.map(department => (
                        <option value={department.name} key={department._id}>
                          {department.name}
                        </option>
                      ))}
                    </Select>
                    {formik.touched.semester && formik.errors.semester ? (
                      <ErrorMessage message={formik.errors.semester} />
                    ) : null}
                    <FormLabel> Semester: </FormLabel>
                    <Select
                      placeholder="Select Semester"
                      {...formik.getFieldProps('semester')}
                      onChange={async e => {
                        const semester = selectedDepartment.semesters.find(
                          semester => semester.name === e.target.value
                        );
                        setSelectedSemester(semester);
                        formik.setFieldValue('semester', e.target.value);
                        if (semester) {
                          await getStudents(props.user, semester._id);
                        }
                      }}
                      value={
                        selectedSemester == null ? '' : selectedSemester.name
                      }
                    >
                      {selectedDepartment != null
                        ? selectedDepartment.semesters.map(semester => (
                            <option value={semester.name} key={semester._id}>
                              {semester.name}
                            </option>
                          ))
                        : null}
                    </Select>
                    {formik.touched.students && formik.errors.students ? (
                      <ErrorMessage message={formik.errors.students} />
                    ) : null}
                    <FormLabel>Select Students: </FormLabel>
                    {!isStudentsLoading &&
                    students != null &&
                    students.length !== 0 ? (
                      <Text
                        textAlign={'right'}
                        cursor={'pointer'}
                        mb={1}
                        onClick={() => {
                          if (!students.find(s => s.promote === true)) {
                            students.map(s => {
                              s.promote = true;
                            });
                            setStudents([...students]);
                          } else {
                            students.map(s => {
                              s.promote = false;
                            });
                            setStudents([...students]);
                          }
                        }}
                      >
                        {!students.find(s => s.promote === true)
                          ? 'Select All'
                          : 'UnSelect All'}
                      </Text>
                    ) : null}
                    <Box
                      mb={3}
                      maxH={250}
                      overflow={'scroll'}
                      overflowX={'hidden'}
                      className={'scroll'}
                    >
                      {isStudentsLoading ? (
                        <Center>
                          <Flex>
                            <CircularProgress
                              isIndeterminate
                              color="green.300"
                            />
                          </Flex>
                        </Center>
                      ) : students == null ? (
                        'Please select department and semester'
                      ) : students.length === 0 ? (
                        'No Students Found'
                      ) : (
                        <Box>
                          {students.map(s => (
                            <Checkbox
                              key={s._id}
                              colorScheme="green"
                              isChecked={s.promote}
                              w={'full'}
                              bg={'gray.300'}
                              mt={2}
                              py={2}
                              px={3}
                              fontSize={16}
                              rounded={10}
                              onChange={e => {
                                console.log(e.target.checked);
                                s.promote = e.target.checked;
                                // const ss = students;
                                setStudents([...students]);
                                // console.log(
                                //   'PRINTING ONLY PROMOTABLE STUDENTS'
                                // );

                                // setStudents(ss);
                                students.map(s => {
                                  if (s.promote) {
                                    console.log(s.name);
                                  }
                                });
                              }}
                              value={s._id}
                            >
                              <Text>{s.name}</Text>
                            </Checkbox>
                          ))}
                        </Box>
                      )}
                    </Box>
                    {formik.touched.toSemester && formik.errors.toSemester ? (
                      <ErrorMessage message={formik.errors.toSemester} />
                    ) : null}
                    <FormLabel> Promote to Semester: </FormLabel>
                    <Select
                      placeholder="Select Promote to Semester"
                      {...formik.getFieldProps('toSemester')}
                      onChange={e => {
                        const semester = selectedDepartment.semesters.find(
                          semester => semester.name === e.target.value
                        );
                        setSelectedToSemester(semester);
                        if (semester) {
                          formik.setFieldValue('toSemester', e.target.value);
                        }
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

                    <ModalFooter>
                      <Button
                        colorScheme="green"
                        mr={3}
                        isLoading={isLoading}
                        type="submit"
                      >
                        Promote Students
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
                    <ConfirmationModal
                      isOpen={isOpenConfirmationModal}
                      onClose={onCloseConfirmationModal}
                    />
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
