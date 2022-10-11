import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdPhoneDisabled } from "react-icons/md";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { BiArrowBack, BiPhone } from "react-icons/bi";
import { useHistory } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BackendEndpoint } from "../../utils/BackendEndpoint";

let socket = io(BackendEndpoint);

const VideoCall = () => {
  const history = useHistory();
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [name, setName] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef(null);
  const otherUserVideo = useRef(null);
  const connectionRef = useRef(null);
  const [idToCall, setIdToCall] = useState("");

  //get permission to use camera and microphone
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        //setting attr for our video
        myVideo.current.srcObject = currentStream;
      });

    //add myself to the me socket innod
    socket.on("me", (id) => {
      setMe(id);
    });

    //set details of who to call
    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    //create the perr
    const peer = new Peer({ initiator: false, trickle: false, stream });

    //finally establishing that connection,once we reciee the signal
    //the data passed is the date of who is calling
    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });

    //get the other users stream,the stream passed is the stream of the peron calling
    peer.on("stream", (currentStream) => {
      otherUserVideo.current.srcObject = currentStream;
    });
    console.log(call);
    //this call property are the objects we first got when we emit the calluser in our useEffect
    peer.signal(call.signal);

    //our current connection is equal to our peer
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    //create the perr
    //in this case, becuas we are the one calling,we are the initiator
    const peer = new Peer({ initiator: true, trickle: false, stream: stream });

    //finally establishing that connection,once we reciee the signal
    //the data passed is the date of who is calling
    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    //get the other users stream,the stream passed is the stream of the peron calling
    peer.on("stream", (currentStream) => {
      otherUserVideo.current.srcObject = currentStream;
    });

    //create a connection to check if our call has been answered
    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    //our current connection is equal to our peer
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <Flex py={"50px"}>
      {/* Videoplayer */}
      <Container maxW={"container.xl"}>
        <VStack justifyContent={"center"} w="full" spacing={8}>
          <Flex justifyContent={"space-between"} w="full" alignItems="center">
            <IconButton
              onClick={() => history.goBack()}
              cursor={"pointer"}
              d={{ base: "flex" }}
              icon={<BiArrowBack />}
            />
            <Heading>Video Call</Heading>
            <Box></Box>
          </Flex>

          <SimpleGrid columns={[1, 2]}>
            {/* our own video */}
            {stream && (
              <Flex>
                <VStack>
                  <Text>{name || "Name"}</Text>
                  <video playsInline muted ref={myVideo} autoPlay />
                </VStack>
              </Flex>
            )}

            {callAccepted && !callEnded && (
              <Flex>
                <VStack>
                  <Text>{call.name || "Name"}</Text>
                  <video playsInline muted ref={otherUserVideo} autoPlay />
                </VStack>
              </Flex>
            )}
          </SimpleGrid>

          {/* options */}
          <VStack
            maxWidth={"500px"}
            padding={4}
            w="100%"
            border={"1px solid black"}
          >
            <SimpleGrid columns={2} w="full" spacing={8}>
              <VStack>
                <Text fontWeight={700}>Account Info</Text>
                <FormControl>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                  />
                </FormControl>
                <CopyToClipboard text={me}>
                  <Button w="full" colorScheme={"blue"}>
                    Copy your ID
                  </Button>
                </CopyToClipboard>
              </VStack>
              <VStack>
                <Text fontWeight={700}>Make a call</Text>
                <FormControl>
                  <Input
                    onChange={(e) => setIdToCall(e.target.value)}
                    value={idToCall}
                    placeholder="ID to call"
                  />
                </FormControl>
                {callAccepted && !callEnded ? (
                  <Button
                    leftIcon={<MdPhoneDisabled />}
                    w="full"
                    onClick={leaveCall}
                    colorScheme={"red"}
                  >
                    Hang Up
                  </Button>
                ) : (
                  <Button
                    onClick={() => callUser(idToCall)}
                    leftIcon={<BiPhone />}
                    colorScheme={"blue"}
                    w={"full"}
                  >
                    Call
                  </Button>
                )}
              </VStack>
            </SimpleGrid>
          </VStack>
          {call.isReceivedCall && !callAccepted && (
            <VStack>
              <Text>{call.name} is calling</Text>
              <Button onClick={answerCall} colorScheme="blue">
                Answer Call
              </Button>
            </VStack>
          )}
          {/* notifications */}
        </VStack>
      </Container>
    </Flex>
  );
};

export default VideoCall;
