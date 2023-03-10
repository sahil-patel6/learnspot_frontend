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

export const DepartmentModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.mode} Department Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              initialValues={{
                name: props.department != null ? props.department.name : '',
                description:
                  props.department != null ? props.department.description : '',
                total_years:
                  props.department != null ? props.department.total_years : '',
              }}
              validateOnChange={false}
              validateOnBlur={false}
              validationSchema={Yup.object({
                name: Yup.string().required('Department name is required'),
                description: Yup.string()
                  .min(
                    8,
                    'Department Description should have alteast 8 characters'
                  )
                  .required('Department Description is required'),
                total_years: Yup.number()
                  .min(1, 'Total years should be atleast 1')
                  .max(5, 'Total years should be less than 5')
                  .required('Total Years is required'),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                console.log('SUBMITED');
                setIsLoading(true);
                try {
                  console.log(props.user._id);
                  let result = null;
                  if (props.mode == 'Create') {
                    result = await axios.post(
                      API.CREATE_DEPARTMENT(props.user._id),
                      {
                        name: values.name,
                        description: values.description,
                        total_years: values.total_years,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${props.user.token}`,
                        },
                      }
                    );
                  } else {
                    result = await axios.put(
                      API.UPDATE_DEPARTMENT(
                        props.department._id,
                        props.user._id
                      ),
                      {
                        name: values.name,
                        description: values.description,
                        total_years: values.total_years,
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
                    title: `${props.mode}d Department Successfully`,
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
                  <FormLabel htmlFor="name">Department Name:</FormLabel>
                  <Input
                    id="name"
                    type="text"
                    {...formik.getFieldProps('name')}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <ErrorMessage message={formik.errors.description} />
                  ) : null}
                  <FormLabel htmlFor="description">
                    Department Description:
                  </FormLabel>
                  <Input
                    id="description"
                    type="text"
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.total_years && formik.errors.total_years ? (
                    <ErrorMessage message={formik.errors.total_years} />
                  ) : null}
                  <FormLabel htmlFor="total_years">
                    Department Total Years:
                  </FormLabel>
                  <Input
                    id="total_years"
                    type="number"
                    {...formik.getFieldProps('total_years')}
                  />

                  <ModalFooter>
                    <Button
                      colorScheme="green"
                      mr={3}
                      isLoading={isLoading}
                      type="submit"
                    >
                      {props.mode} Department
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
