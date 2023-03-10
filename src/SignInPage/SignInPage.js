import {
  Center,
  Button,
  FormLabel,
  Image,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { API } from '../utils/API';
import axios from 'axios';
import ErrorMessage from '../Components/ErrorMessage';
import NavBar from '../Components/NavBar';
import { useNavigate } from 'react-router';

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const temp = JSON.parse(localStorage.getItem('user'));
      setUser(temp);
      if (temp != null && temp._id != null && temp.token != null) {
        console.log('INSIDE YEAY');
        // window.location.href = '/';
        navigate("/")
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <VStack>
      <NavBar user={user} />
      <Center>
        <VStack textAlign="center" fontSize="xl" p="10px" spacing={8}>
          <Image src="/learnspot_logo.png" width="150px" height="150px" />
          <Text>Welcome To Learn Spot !!</Text>
          <Formik
            initialValues={{ email: '', password: '' }}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={Yup.object({
              email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
              password: Yup.string()
                .min(8, 'Password should have alteast 8 characters')
                .required('Password is required'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              setIsLoading(true);
              try {
                const result = await axios.post(API.SIGNIN_URL, {
                  email: values.email,
                  plainPassword: values.password,
                });
                console.log(result.data);
                localStorage.setItem('user', JSON.stringify(result.data));
                setIsLoading(false);

                toast({
                  title: 'Logged in successfully',
                  status: 'success',
                  duration: '2000',
                  isClosable: true,
                  position: 'top-right',
                });
                // window.location.href = '/';
                navigate("/");
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
                {formik.touched.email && formik.errors.email ? (
                  <ErrorMessage message={formik.errors.email} />
                ) : null}
                <FormLabel htmlFor="email">Email Address:</FormLabel>
                <Input
                  id="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.password && formik.errors.password ? (
                  <ErrorMessage message={formik.errors.password} />
                ) : null}
                <FormLabel htmlFor="password">Password:</FormLabel>
                <Input
                  id="password"
                  type="password"
                  {...formik.getFieldProps('password')}
                />
                <Button
                  colorScheme="green"
                  type="submit"
                  my={5}
                  isLoading={isLoading}
                >
                  Login
                </Button>
              </form>
            )}
          </Formik>
        </VStack>
      </Center>
    </VStack>
  );
};

export default SignInPage;
