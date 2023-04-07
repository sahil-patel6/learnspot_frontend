import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Image,
  Text,
  VStack,
  Button,
  Spacer,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const NavLink = ({ children, link, active = true }) => (
  <Link
    px={2}
    py={2}
    rounded={'md'}
    _hover={{ bg: 'blue.500' }}
    to={link.toLowerCase()}
  >
    {' '}
    <Text
      paddingX={3}
      paddingY={2.5}
      borderRadius={5}
      _hover={{ bg: 'blue.500' }}
      bg={active ? 'blue.500' : '#2F855A'}
    >
      {children}
    </Text>
  </Link>
);

export default function NavBar(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  function logout(e) {
    e.preventDefault();
    console.log('LOGGED OUT');
    localStorage.removeItem('user');
    navigate('/signin');
  }

  return (
    <>
      <Box bg={'#2F855A'} px={4} width={'full'} color={'white'}>
        <Flex
          h={16}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          {props.user != null ? (
            <IconButton
              size={'md'}
              icon={
                isOpen ? (
                  <CloseIcon color={'black'} />
                ) : (
                  <HamburgerIcon color={'black'} />
                )
              }
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
              mr={3}
            />
          ) : null}

          <HStack spacing={8} alignItems={'center'}>
            <Link to={'/'}>
              <HStack>
                <Image
                  src="/learnspot_logo.png"
                  width="45px"
                  height="45px"
                  p={1}
                />
                <Text>Learn Spot</Text>
              </HStack>
            </Link>
            {props.user != null ? (
              <HStack
                as={'nav'}
                spacing={4}
                display={{ base: 'none', md: 'flex' }}
              >
                <NavLink
                  link={'/'}
                  active={props.location == null ? true : false}
                >
                  Home
                </NavLink>
                <NavLink
                  link={'/teachers'}
                  active={props.location == 'Teachers' ? true : false}
                >
                  Teachers
                </NavLink>
                <NavLink
                  link={'/students'}
                  active={props.location == 'Students' ? true : false}
                >
                  Students
                </NavLink>
                <NavLink
                  link={'/parents'}
                  active={props.location == 'Parents' ? true : false}
                >
                  Parents
                </NavLink>
              </HStack>
            ) : null}
          </HStack>

          {props.user != null && props.user._id != null ? (
            <Button colorScheme="red" type="submit" onClick={logout} mx={3}>
              Log out
            </Button>
          ) : null}
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={2}>
              {props.user != null ? (
                <>
                  <NavLink
                    link={'/'}
                    active={props.location == null ? true : false}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    link={'/teachers'}
                    active={props.location == 'Teachers' ? true : false}
                  >
                    Teachers
                  </NavLink>
                  <NavLink
                    link={'/students'}
                    active={props.location == 'Students' ? true : false}
                  >
                    Students
                  </NavLink>
                  <NavLink
                    link={'/parents'}
                    active={props.location == 'Parents' ? true : false}
                  >
                    Parents
                  </NavLink>
                </>
              ) : null}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
