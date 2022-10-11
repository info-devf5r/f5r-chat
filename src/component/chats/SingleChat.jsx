/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Center,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import "../styles.css";
import uuid from "react-uuid";
import Picker from "emoji-picker-react";
import { VscSmiley } from "react-icons/vsc";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useGlobalContext } from "../../context";
import { getSender, getSenderFull } from "../../utils/ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupChat from "./UpdateGroupChat";
import ScrollableChat from "./ScrollableChat";
import { AiFillAudio } from "react-icons/ai";
import VoiceNotes from "./VoiceNotes";
import { BackendEndpoint } from "../../utils/BackendEndpoint";
import axios from "axios";

//socket io to emit
//this is where the realtime chat will be implemented
const EndPoint = BackendEndpoint;
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const {
    selectedChat,
    user,
    notifications,
    setnotifications,
    setSelectedChat,
  } = useGlobalContext();
  const [voiceNote, setVoiceNote] = useState({
    isClicked: false,
    audioBlob: null,
    isRecording: false,
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const onEmojiClick = (e, emObject) => {
    setNewMessage((prevState) => prevState + emObject.emoji);
  };

  useEffect(() => {
    socket = io(EndPoint);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("voiceRecord", () =>
      setVoiceNote({ ...voiceNote, isRecording: true })
    );
    socket.on("stopVoiceRecord", () =>
      setVoiceNote({ ...voiceNote, isRecording: false })
    );
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    if (!socketConnected) return;
    if (voiceNote.isClicked) {
      if (!voiceNote.isRecording) {
        socket.emit("voiceRecord", selectedChat._id);
        setVoiceNote({ ...voiceNote, isRecording: false });
      }
    } else {
      setVoiceNote({ ...voiceNote, isRecording: false });
      socket.emit("stopVoiceRecord", selectedChat._id);
    }
  }, [voiceNote.isClicked]);

  //fetching messages on mount
  useEffect(() => {
    fetchMessage();

    //to compare with previous message whether it is same or not to check notifications
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    //create an event listener for the server socket to emit
    socket.on("message received", (newMessage) => {
      //if another user sends me a message, i should receive it but instead as a notification
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        //if notification doesnt exist twice, add it
        if (!notifications.some((e) => e.userId === newMessage.userId)) {
          setnotifications([...notifications, newMessage]);

          //update list of chats
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
    //we have to emit or call the new message in backend to run which be done when we fetch chats from backend
  });

  const sendAudio = async (audioBlob) => {
    if (!audioBlob) return; //if no audio, return
    try {
      //if audio, send it to backend
      const formData = new FormData();
      formData.append("chatId", selectedChat._id);
      formData.append("content", audioBlob, `audio${uuid()}.wav`);
      const { data } = await axios.post(`/api/message`, formData);

      socket.emit("new message", data);
      //append new message to the list
      setMessages([...messages, data]);
    } catch (error) {
      //if error, show error
      toast({
        title: "Error",
        description: error.response.data.msg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      setShowEmoji(false);
      socket.emit("typing", selectedChat._id);
      try {
        const formData = new FormData();

        formData.append("content", newMessage);
        formData.append("chatId", selectedChat._id);

        const { data } = await axios.post(`/api/message`, formData);

        socket.emit("new message", data);
        setNewMessage("");
        //append new message to the list
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error",
          description: error.response.data.msg,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const fetchMessage = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`);
      setMessages(data);

      //emitting joinging user into the room created
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.msg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //Typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    //decides when to stop typing, if user is not typing, then stop
    let lastTypingTime = new Date().getTime();
    const timerLenth = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLenth && typing) {
        setTyping(false);
        socket.emit("stop typing", selectedChat._id);
      }
    }, timerLenth);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "1rem", md: "30px" }}
            py={3}
            px={2}
            w="100%"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<BiArrowBack />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  voiceNote={voiceNote}
                  isTyping={isTyping}
                  user={getSenderFull(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChat
                  chatName={selectedChat.chatName}
                  fetchMessage={fetchMessage}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Box>
          <Box overflowY={"hidden"} padding="1rem" pt={0} w="100%" h="100%">
            <Box
              borderRadius={"lg"}
              d="flex"
              flexDirection={"column"}
              justifyContent={"flex-end"}
              w="100%"
              h="100%"
              bg="#e8e8e8"
            >
              {loading ? (
                <Spinner alignSelf={"center"} margin="auto" />
              ) : (
                <>
                  <div className="message">
                    {messages && messages.length > 0 && (
                      <ScrollableChat messages={messages} />
                    )}
                  </div>
                  <FormControl isRequired mt={3} onKeyDown={sendMessage}>
                    {voiceNote.isClicked ? (
                      <VoiceNotes
                        selectedChat={selectedChat}
                        setVoiceNote={setVoiceNote}
                        voiceNote={voiceNote}
                        sendAudio={sendAudio}
                      />
                    ) : (
                      <Flex
                        bg="#e0e0e0"
                        position="relative"
                        alignItems={"center"}
                      >
                        <Box
                          opacity={showEmoji ? 1 : 0}
                          visibility={showEmoji ? "visible" : "hidden"}
                          left="1%"
                          right={"1%"}
                          bottom="150%"
                          position={"absolute"}
                        >
                          <Picker
                            pickerStyle={{ width: "100%" }}
                            onEmojiClick={onEmojiClick}
                          />
                        </Box>

                        <Center
                          onClick={() => {
                            setShowEmoji(!showEmoji);
                          }}
                          px={3}
                        >
                          <VscSmiley />
                        </Center>
                        <Input
                          onFocus={() => setShowEmoji(false)}
                          variant="filled"
                          borderWidth={"2px"}
                          borderColor={"blue.100"}
                          boxShadow={"sm"}
                          bg="#e0e0e0"
                          resize={"none"}
                          placeholder="Type a message"
                          value={newMessage}
                          onChange={typingHandler}
                        />

                        <AiFillAudio
                          onClick={() =>
                            setVoiceNote({ ...voiceNote, isClicked: true })
                          }
                          style={{ margin: "0 10px", cursor: "pointer" }}
                          size="1.2rem"
                        />
                      </Flex>
                    )}
                  </FormControl>
                </>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Box
          d="flex"
          justifyContent={"center"}
          fontSize={"3xl"}
          h="100%"
          alignItems="center"
        >
          <Text>Click on a user to start chatting</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
