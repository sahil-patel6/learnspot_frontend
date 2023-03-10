import React from 'react';
import { Center, Flex, Text } from '@chakra-ui/react';

const NoPage = () => {
  return (
    <Center width={'100vw'} height={window.screen.height - 250}>
      <Flex>
        <Text fontSize={50} fontWeight={'bold'}>You are in the wrong Place.</Text>
      </Flex>
    </Center>
  );
};

export default NoPage;
