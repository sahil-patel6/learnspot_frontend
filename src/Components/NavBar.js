import React from 'react';
import { Image, Text, Flex, Spacer, HStack, Button } from '@chakra-ui/react';

function NavBar(props) {
  function onAppLogoCick() {
    window.location.href = '/';
  }
  function logout(e) {
    e.preventDefault();
    console.log('LOG OUT');
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  // console.log(props);

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
