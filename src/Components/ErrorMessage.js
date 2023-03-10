import React from 'react'
import {
    Box,
  } from '@chakra-ui/react';

const ErrorMessage = props => {
  return (<Box
    fontSize={15}
    bg={'red'}
    color={'white'}
    py={3}
    px={5}
    borderRadius={8}
    my={2}
  >
    {props.message}
  </Box>
  )
}


export default ErrorMessage