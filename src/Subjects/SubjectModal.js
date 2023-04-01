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
  Image,
  Box,
} from '@chakra-ui/react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { API } from '../utils/API';
import axios from 'axios';
import ErrorMessage from '../Components/ErrorMessage';
import firebase_storage from '../firebase/firebase';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

export const SubjectModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const inputFile = useRef(null);
  const [pickedSubjectImage, setPickedSubjectImage] = useState(null);

  const pick_image = () => {
    inputFile.current.click();
    // if (
    //   inputFile.current != null &&
    //   inputFile.current.files &&
    //   inputFile.current.files[0]
    // ) {
    //   console.log(inputFile.current.files[0]);
    //   setPickedSubjectImage(URL.createObjectURL(inputFile.current.files[0]));
    // }
  };
  const handleSubjectPictureChange = e => {
    console.log(e.target.files);
    setPickedSubjectImage(e.target.files[0]);
  };

  function getFileNameWithExt(file) {
    const name = file.name;
    const lastDot = name.lastIndexOf('.');

    // const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);

    return {
      name,
      ext,
    };
  }

  const onCloseModal = () => {
    setIsLoading(false);
    setPickedSubjectImage(null);
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
          <ModalHeader>{props.activeSubject == null ? "Create" : "Update"} Subject Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              initialValues={{
                name: props.activeSubject != null ? props.activeSubject.name : '',
                credits: props.activeSubject != null ? props.activeSubject.credits : 2,
              }}
              validateOnChange={false}
              validateOnBlur={false}
              validationSchema={Yup.object({
                name: Yup.string().required('Subject Name is required'),
                credits: Yup.number()
                  .min(2, 'Credits should atleast be 2')
                  .required('Credits is required'),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                console.log('SUBMITED');
                try {
                  console.log(props.user._id);
                  let result = null;
                  if (props.activeSubject == null) {
                    if (pickedSubjectImage == null) {
                      return toast({
                        title: 'Please pick an image',
                        status: 'error',
                        duration: '2000',
                        isClosable: true,
                        position: 'top-right',
                      });
                    }
                    setIsLoading(true);
                    var file_info = getFileNameWithExt(pickedSubjectImage);
                    console.log(pickedSubjectImage);
                    console.log(getFileNameWithExt(pickedSubjectImage));
                    const subject_image_fcs_path = `subjects/${Date.now().toString()}.${
                      file_info.ext
                    }`;
                    const subject_pic_ref = ref(
                      firebase_storage,
                      subject_image_fcs_path
                    );
                    uploadBytes(subject_pic_ref, pickedSubjectImage).then(
                      async snapshot => {
                        const download_url = await getDownloadURL(snapshot.ref);
                        result = await axios.post(
                          API.CREATE_SUBJECT(props.user._id),
                          {
                            name: values.name,
                            semester: props.semester_id,
                            credits: values.credits,
                            pic_url: download_url,
                            fcs_pic_path: subject_image_fcs_path,
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
                          title: `${props.activeSubject == null ? "Created" : "Updated"} Subject Successfully`,
                          status: 'success',
                          duration: '2000',
                          isClosable: true,
                          position: 'top-right',
                        });
                      }
                    );
                  } else {
                    setIsLoading(true);
                    if (pickedSubjectImage) {
                      await deleteObject(
                        ref(firebase_storage, props.activeSubject.fcs_pic_path)
                      );
                      var file_info = getFileNameWithExt(pickedSubjectImage);
                      console.log(pickedSubjectImage);
                      console.log(getFileNameWithExt(pickedSubjectImage));
                      const subject_image_fcs_path = `subjects/${Date.now().toString()}.${
                        file_info.ext
                      }`;
                      const subject_pic_ref = ref(
                        firebase_storage,
                        subject_image_fcs_path
                      );
                      const uploadSnapshot = await uploadBytes(
                        subject_pic_ref,
                        pickedSubjectImage
                      );
                      const download_url = await getDownloadURL(uploadSnapshot.ref);
                      props.activeSubject.pic_url = download_url;
                      props.activeSubject.fcs_pic_path = subject_image_fcs_path;
                    }
                    result = await axios.put(
                      API.UPDATE_SUBJECT(props.activeSubject._id, props.user._id),
                      {
                        name: values.name,
                        credits: values.credits,
                        pic_url: props.activeSubject.pic_url,
                        fcs_pic_path: props.activeSubject.fcs_pic_path,
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
                      title: `${props.activeSubject == null ? "Created" : "Updated"} Subject Successfully`,
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
                  <input
                    type="file"
                    id="file"
                    ref={inputFile}
                    style={{ display: 'none' }}
                    onChange={handleSubjectPictureChange}
                  />
                  {pickedSubjectImage ? (
                    <Image
                      src={URL.createObjectURL(pickedSubjectImage)}
                      borderRadius="lg"
                      height={225}
                      width={'sm'}
                      align={'center'}
                      marginBottom={5}
                      fit="cover"
                      onClick={pick_image}
                    />
                  ) : props.activeSubject != null ? (
                    <Image
                      src={props.activeSubject.pic_url}
                      borderRadius="lg"
                      height={225}
                      width={'sm'}
                      align={'center'}
                      marginBottom={5}
                      fit="cover"
                      onClick={pick_image}
                    />
                  ) : (
                    <Box
                      h={225}
                      w={'sm'}
                      border={'1px black solid'}
                      borderRadius="lg"
                      alignContent={'center'}
                      marginBottom={5}
                      onClick={pick_image}
                    />
                  )}
                  {formik.touched.name && formik.errors.name ? (
                    <ErrorMessage message={formik.errors.name} />
                  ) : null}
                  <FormLabel htmlFor="name">Subject Name:</FormLabel>
                  <Input
                    id="name"
                    type="text"
                    {...formik.getFieldProps('name')}
                  />
                  {formik.touched.credits && formik.errors.credits ? (
                    <ErrorMessage message={formik.errors.credits} />
                  ) : null}
                  <FormLabel htmlFor="credits">Subject Credits:</FormLabel>
                  <Input
                    id="credits"
                    type="number"
                    {...formik.getFieldProps('credits')}
                  />
                  <ModalFooter>
                    <Button
                      colorScheme="green"
                      mr={3}
                      isLoading={isLoading}
                      type="submit"
                    >
                      {props.activeSubject == null ? "Create" : "Update"} Subject
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
