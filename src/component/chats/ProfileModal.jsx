import { Image } from "@chakra-ui/image";
import { Text } from "@chakra-ui/layout";

import {
  Modal,
  useDisclosure,
  ModalBody,
  Button,
  IconButton,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineEye } from "react-icons/ai";
import { MdVideoCall } from "react-icons/md";
import { useHistory } from "react-router-dom";

const ProfileModal = ({ user, children, isTyping, voiceNote, isRecording }) => {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <HStack spacing={4}>
          {voiceNote.isRecording && (
            <Text fontSize={"10px"}>Recording audio...</Text>
          )}
          {isTyping && <Text fontSize={"10px"}>typing...</Text>}

          <IconButton
            d={{ base: "flex" }}
            onClick={() => history.push("/video")}
            icon={<MdVideoCall />}
          />

          <IconButton
            onClick={onOpen}
            d={{ base: "flex" }}
            icon={<AiOutlineEye />}
          />
        </HStack>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width={{ base: "90vw" }}>
          <ModalHeader fontSize="1.5rem" d="flex" justifyContent="center">
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            alignItems="center"
            w="100%"
            flexDirection="column"
            d="flex"
          >
            <Image
              objectFit="cover"
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              d="flex"
              alignItems="center"
              w="100%"
              flexDirection="column"
              fontWeight="500"
              fontSize="1rem"
            >
              <span>Email :</span> {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
