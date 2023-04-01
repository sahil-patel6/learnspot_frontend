import React from 'react';
import { Image, Text, Flex, Spacer, HStack, Button } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router';

function NavBar(props) {
  const navigate = useNavigate();

  function onAppLogoCick() {
    navigate('/');
  }
  function logout(e) {
    e.preventDefault();
    console.log('LOGGED OUT');
    localStorage.removeItem('user');
    navigate('/');
  }

  return (
    <Flex
      minW="100%"
      bgColor="#2F855A"
      minH="50px"
      align={'center'}
      px="10px"
      color={'white'}
      fontSize="16px"
    >
      <HStack onClick={onAppLogoCick} cursor={'pointer'}>
        <Image src="/learnspot_logo.png" width="45px" height="45px" p={1} />
        <Text>Learn Spot</Text>
        <a href="/">
          <Text
            ml={5}
            paddingX={3}
            paddingY={1.5}
            borderRadius={3}
            _hover={{ bg: 'blue.500' }}
            bg={props.location == null ? 'blue.500' : '#2F855A'}
          >
            Home
          </Text>
        </a>
        <a href="/teachers">
          <Text
            ml={5}
            paddingX={3}
            paddingY={1.5}
            borderRadius={3}
            _hover={{ bg: 'blue.500' }}
            bg={props.location === 'Teachers' ? 'blue.500' : '#2F855A'}
          >
            Teacher
          </Text>
        </a>
        <a href="/students">
          <Text
            ml={5}
            paddingX={3}
            paddingY={1.5}
            borderRadius={3}
            _hover={{ bg: 'blue.500' }}
            bg={props.location === 'Students' ? 'blue.500' : '#2F855A'}
          >
            Students
          </Text>
        </a>
        <a href="/parents">
          <Text
            ml={5}
            paddingX={3}
            paddingY={1.5}
            borderRadius={3}
            _hover={{ bg: 'blue.500' }}
            bg={props.location === 'Parents' ? 'blue.500' : '#2F855A'}
          >
            Parents
          </Text>
        </a>
      </HStack>
      <Spacer />
      {props.user != null && props.user._id != null ? (
        <Button colorScheme="red" type="submit" onClick={logout} mx={3}>
          Log out
        </Button>
      ) : null}
    </Flex>
  );
}

export default NavBar;
