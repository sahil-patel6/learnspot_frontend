import React, { useState, useRef } from 'react';
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
import { ConfirmationModal } from '../Components/ConfirmationModal';

export const DepartmentModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const toast = useToast();
  const formikRef = useRef();

  const onCloseConfirmationModal = decision => {
    setIsOpenConfirmationModal(false);
    if (decision) {
      setConfirmation(true);
      formikRef.current.submitForm();
    }
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {props.activeDepartment == null ? 'Create' : 'Update'} Department
            Form
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              innerRef={formikRef}
              initialValues={{
                name:
                  props.activeDepartment != null
                    ? props.activeDepartment.name
                    : '',
                description:
                  props.activeDepartment != null
                    ? props.activeDepartment.description
                    : '',
                total_years:
                  props.activeDepartment != null
                    ? props.activeDepartment.total_years
                    : '',
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
                try {
                  let result = null;

                  if (!confirmation) {
                    setIsOpenConfirmationModal(true);
                    return;
                  }
                  setIsLoading(true);
                  if (props.activeDepartment == null) {
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
                        props.activeDepartment._id,
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
                  setIsLoading(false);
                  props.onClose(result.data);
                  toast({
                    title: `${
                      props.activeDepartment == null ? 'Created' : 'Updated'
                    } Department Successfully`,
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
                      {props.activeDepartment == null ? 'Create' : 'Update'}{' '}
                      Department
                    </Button>
                    <Button onClick={() => props.onClose()}>Cancel</Button>
                  </ModalFooter>
                  <ConfirmationModal
                    isOpen={isOpenConfirmationModal}
                    onClose={onCloseConfirmationModal}
                  />
                </form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
