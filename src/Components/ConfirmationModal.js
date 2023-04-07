import React from 'react';
import {
  Modal,
  ModalBody,
  Button,
  ModalOverlay,
  ModalHeader,
  Box,
  ModalCloseButton,
  ModalContent,
} from '@chakra-ui/react';

export const ConfirmationModal = props => {
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={() => {
          props.onClose(false);
        }}
        isCentered
        size={'xs'}
        
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you want to proceed?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box textAlign={'end'}>
            <Button
              colorScheme="green"
              mr={3}
              type="button"
              onClick={() => {
                props.onClose(true);
              }}
            >
              Yes
            </Button>
            <Button
              onClick={() => {
                props.onClose(false);
              }}
            >
              No
            </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
