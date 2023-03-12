import React, { useState } from 'react';
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
} from '@chakra-ui/react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { API } from '../utils/API';
import axios from 'axios';
import ErrorMessage from '../Components/ErrorMessage';

export const SemesterModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.activeSemester == null ? "Create" : "Update"} Semester Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              initialValues={{
                name: props.activeSemester != null ? props.activeSemester.name : '',
              }}
              validateOnChange={false}
              validateOnBlur={false}
              validationSchema={Yup.object({
                name: Yup.string().required('semester name is required'),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                console.log('SUBMITED');
                setIsLoading(true);
                try {
                  console.log(props.user._id);
                  let result = null;
                  if (props.activeSemester == null) {
                    result = await axios.post(
                      API.CREATE_SEMESTER(props.user._id),
                      {
                        name: values.name,
                        department: props.department_id,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${props.user.token}`,
                        },
                      }
                    );
                  } else {
                    result = await axios.put(
                      API.UPDATE_SEMESTER(props.activeSemester._id, props.user._id),
                      {
                        name: values.name,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${props.user.token}`,
                        },
                      }
                    );
                  }
                  console.log(result.data);
                  setIsLoading(false);
                  props.onClose(result.data);
                  toast({
                    title: `${props.activeSemester == null ? "Created" : "Updated"} semester Successfully`,
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
              }}
            >
              {formik => (
                <form onSubmit={formik.handleSubmit}>
                  {formik.touched.name && formik.errors.name ? (
                    <ErrorMessage message={formik.errors.name} />
                  ) : null}
                  <FormLabel htmlFor="name">Semester Name:</FormLabel>
                  <Input
                    id="name"
                    type="text"
                    {...formik.getFieldProps('name')}
                  />
                  <ModalFooter>
                    <Button
                      colorScheme="green"
                      mr={3}
                      isLoading={isLoading}
                      type="submit"
                    >
                      {props.activeSemester == null ? "Create" : "Update"} Semester
                    </Button>
                    <Button onClick={()=>props.onClose()}>Cancel</Button>
                  </ModalFooter>
                </form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
