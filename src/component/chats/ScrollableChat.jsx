/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useGlobalContext } from "../../context";
import parse from "html-react-parser";
import {
  Display24HoursTimeFormat,
  isSame,
  isSameSenderMargin,
  isSameUser,
} from "../../utils/ChatLogics";
const ScrollableChat = ({ messages }) => {
  const lastMessage = React.useRef();
  //scroll to view if messages changes
  useEffect(() => {
    lastMessage.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const { user } = useGlobalContext();
  return (
    <ScrollableFeed>
      {messages &&
        messages.length > 0 &&
        messages.map((message, index) => {
          return (
            <Flex px={2} alignItems={"center"} key={index}>
              {/* container for each message */}
              <span
                style={{
                  backgroundColor: `${
                    message.sender._id === user.userId ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(
                    messages,
                    message,
                    index,
                    user.userId
                  ),
                  marginTop: isSameUser(messages, message, index) ? 3 : 10,
                  borderRadius: "10px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                <span style={{ display: "flex", justifyContent: "flex-start" }}>
                  <Text fontWeight={"400"} fontSize={".6rem"}>
                    {parse(isSame(messages, message, index, user.userId))}
                  </Text>
                </span>

                {/* show audio if contents starts with /audios */}
                {message.content.startsWith("/audios") ? (
                  <span className="audio_wrapper">
                    <audio
                      style={{ height: "40px" }}
                      controls
                      src={message.content}
                    />
                  </span>
                ) : (
                  <span style={{ alignItems: "center" }}>
                    {message.content}
                  </span>
                )}

                {/* display the time the message was sent */}
                <span
                  ref={lastMessage}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Text fontWeight={"400"} fontSize={".6rem"}>
                    {Display24HoursTimeFormat(message.createdAt)}
                  </Text>
                </span>
              </span>
            </Flex>
          );
        })}
    </ScrollableFeed>
  );
};
export default ScrollableChat;
