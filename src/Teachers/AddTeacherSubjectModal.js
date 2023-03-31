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

export const AddTeacherSubjectModal = props => {
  const [isLoading, setIsLoading] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const toast = useToast();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);

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
          props.onClose(selectedSubject);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Teacher Subject:</ModalHeader>
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
                  onChange={e =>
                    setSelectedSemester(
                      selectedDepartment.semesters.find(
                        semester => semester.name === e.target.value
                      )
                    )
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
                <FormLabel> Subject: </FormLabel>
                <Select
                  placeholder="Select Subject"
                  onChange={e =>
                    setSelectedSubject(
                      selectedSemester.subjects.find(
                        subject => subject.name === e.target.value
                      )
                    )
                  }
                >
                  {selectedSemester != null
                    ? selectedSemester.subjects.map(subject => (
                        <option value={subject.name} key={subject._id}>
                          {subject.name}
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
                    onClick={(e)=>{
                      e.preventDefault();
                      if (selectedSubject!=null){
                        props.onClose(selectedSubject);
                      }else{
                        toast({
                          title: "Please Select the subject",
                          status: 'error',
                          duration: '2000',
                          isClosable: true,
                          position: 'top-right',
                        });
                      }
                    }}
                  >
                    Add Subject
                  </Button>
                  <Button
                    onClick={() => {
                      onCloseModal();
                      props.onClose(selectedSubject);
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
