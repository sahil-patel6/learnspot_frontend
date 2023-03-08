import React from 'react';
import {
  ChakraProvider,
  Center,
  theme,
} from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Center>Hello World</Center>
    </ChakraProvider>
  );
}

export default App;
