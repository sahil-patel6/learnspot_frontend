import React from 'react';
import { Image, Text, Flex, Spacer, HStack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

function NavBar(props) {
  const navigate = useNavigate();

  function logout(e) {
    e.preventDefault();
    console.log('LOGGED OUT');
    localStorage.removeItem('user');
    navigate('/signin');
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
      <HStack>
        <Link to={'/'}>
          <HStack>
            <Image src="/learnspot_logo.png" width="45px" height="45px" p={1} />
            <Text>Learn Spot</Text>
          </HStack>
        </Link>
        {props.user != null && props.user._id != null ? (
          <HStack>
            <Link to="/">
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
            </Link>
            <Link to={`/teachers`}>
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
            </Link>
            <Link to="/students">
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
            </Link>
            <Link to="/parents">
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
            </Link>
          </HStack>
        ) : null}
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
