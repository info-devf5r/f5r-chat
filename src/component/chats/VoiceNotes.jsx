/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { BiSend } from "react-icons/bi";
import Lottie from "react-lottie";
import animationData from "../../utils/animation.json";

const VoiceNotes = ({ voiceNote, sendAudio, setVoiceNote }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const closeVoiceNote = () => {
    stopTimer();
    mediaChunks.current = [];
    setVoiceNote({ ...voiceNote, isClicked: false, audioBlob: null });
  };
  const stopButtonRef = useRef(null); //used to bind event to stop mediaRecorder error

  let mediaStream = useRef(null);
  let mediaRecorder = useRef(null);
  let mediaChunks = useRef([]);

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  // const [hours, setHours] = useState(0);

  const [timeInterval, setTimeInterval] = useState(null);

  const timer = () => {
    setSeconds((seconds) => seconds + 1);
  };

  useEffect(() => {
    if (seconds === 59) {
      setMinutes((minutes) => minutes + 1);
      setSeconds(0);
    }
  }, [seconds, timeInterval]);

  const stopTimer = () => {
    clearInterval(timeInterval);
  };

  const handleStop = () => {
    //saving the blob file
    stopTimer();

    const audioBlob = new Blob(mediaChunks.current);
    setVoiceNote({
      ...voiceNote,
      isClicked: false,
    });

    sendAudio(audioBlob); //send the blob file to the server
    mediaChunks.current = [];
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        mediaStream.current = stream;
        if (mediaStream.current) {
          mediaRecorder.current = new MediaRecorder(mediaStream.current);

          mediaRecorder.current.addEventListener("dataavailable", (e) => {
            if (e.data.size > 0) mediaChunks.current.push(e.data);
          });

          mediaRecorder.current.addEventListener("stop", handleStop);

          if (stopButtonRef && stopButtonRef.current)
            stopButtonRef?.current?.addEventListener(
              "click",
              function onStopClick() {
                mediaRecorder.current.stop();
                this.removeEventListener("click", onStopClick);
              }
            );

          mediaRecorder.current.start();
          startTimer();
        }
      })
      .catch((err) => console.log("Error in useEffect", err));
  }, []);

  const addZeroToSeconds = (seconds) => {
    return seconds < 10 ? `0${seconds}` : seconds;
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      timer();
    }, 1000);
    setTimeInterval(interval);
  };

  return (
    <Flex
      bg="#e0e0e0"
      p={3}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Box w="100%" d={{ base: "none", sm: "flex" }}></Box>
      <Flex
        maxW={"auto"}
        w="100%"
        margin="0 0 0 auto"
        justifyContent={{ base: "space-between", sm: "flex-end" }}
        alignItems={"center"}
      >
        <HStack marginRight={"-2rem"} justifyContent={"flex-end"} w="full">
          <Button
            d="flex"
            justifyContent={"center"}
            variant={"unstyled"}
            onClick={closeVoiceNote}
          >
            <MdDelete className="svg_hover" />
          </Button>
          <Lottie
            style={{ width: "100%" }}
            options={defaultOptions}
            height={30}
            width={200}
          />
        </HStack>
        <Flex w="100%" m="0 0rem">
          <Flex justifyContent={"flex-end"} w="100%" alignItems={"center"}>
            <HStack w="auto" alignItems={"center"}>
              <Text>{minutes} :</Text>
              <Text>{addZeroToSeconds(seconds)}</Text>
            </HStack>
          </Flex>
        </Flex>
        <Button
          d="flex"
          justifyContent={"center"}
          variant={"unstyled"}
          ref={stopButtonRef}
        >
          <BiSend style={{ marginLeft: "1rem", fontSize: "1.2rem" }} />
        </Button>
      </Flex>
    </Flex>
  );
};

export default VoiceNotes;
