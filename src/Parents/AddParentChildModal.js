import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { API } from '../utils/API';
import axios from 'axios';

export const AddParentChildModal = props => {
  const [isLoading, setIsLoading] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const toast = useToast();
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const onCloseModal = () => {
    setIsLoading(false);
  };

  const getDepartments = async () => {
    try {
      setDepartments(null);
      setIsLoading(true);
      const result = await axios.get(API.GET_ALL_DEPARTMENTS(props.user._id), {
        headers: {
          Authorization: `Bearer ${props.user.token}`,
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

  const getStudents = async (semester) => {
    try {
      setStudents(null);
      // setIsLoading(true);
      const result = await axios.get(
        API.GET_ALL_STUDENTS_BY_SEMESTER(semester._id, props.user._id),
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        }
      );
      console.log("STUDENTS",result.data);
      setStudents(result.data);
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
      setIsLoading(true);
      getDepartments();
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
  }, []);

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={() => {
          onCloseModal();
          props.onClose(selectedStudent);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Parent Child:</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {isLoading ? (
              <Center width={'100%'} height={'100%'}>
                <Flex>
                  <CircularProgress isIndeterminate color="green.300" />
                </Flex>
              </Center>
            ) : (
              <form>
                <FormLabel> Department: </FormLabel>
                <Select
                  placeholder="Select Department"
                  onChange={e =>
                    setSelectedDepartment(
                      departments.find(
                        department => department.name === e.target.value
                      )
                    )
                  }
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
                  onChange={e => {
                    const semester = selectedDepartment.semesters.find(
                      semester => semester.name === e.target.value
                    )
                    console.log(e.target.value);
                    getStudents(semester);
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
                <FormLabel> Child: </FormLabel>
                <Select
                  placeholder="Select Child"
                  onChange={e =>
                    setSelectedStudent(
                      students.find(student => student.name === e.target.value)
                    )
                  }
                >
                  {students != null
                    ? students.map(student => (
                        <option value={student.name} key={student._id}>
                          {student.name}
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
                    onClick={e => {
                      e.preventDefault();
                      if (selectedStudent != null) {
                        props.onClose(selectedStudent);
                      } else {
                        toast({
                          title: 'Please Select the child',
                          status: 'error',
                          duration: '2000',
                          isClosable: true,
                          position: 'top-right',
                        });
                      }
                    }}
                  >
                    Add Child
                  </Button>
                  <Button
                    onClick={() => {
                      onCloseModal();
                      props.onClose(selectedStudent);
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
