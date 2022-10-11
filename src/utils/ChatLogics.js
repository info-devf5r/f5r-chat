//return name of the user to chat
export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?.userId ? users[1]?.name : users[0]?.name;
};

export const getSenderPic = (loggedUser, users) => {
  return users[0]?._id === loggedUser?.userId ? users[1]?.pic : users[0]?.pic;
};

//returning all details about the user
export const getSenderFull = (loggedUser, users) => {
  return users[0]?._id === loggedUser?.userId ? users[1] : users[0];
};

export const getSenderName = (messages, message, index) => {
  return message?.sender?.name;
};

//isSameSender, showing sender at the right, receiver at the left

export const isSameSender = (
  messages,
  currentMessageMapping,
  index,
  userId
) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1]?.sender?._id !== currentMessageMapping?.sender?._id ||
      messages[index + 1]?.sender?._id === undefined) &&
    messages[index]?.sender?._id !== userId
  );
};

export const isSame = (messages, currentMessage, index, userId) => {
  if (!currentMessage.chat.isGroupChat) {
    return `<b></b>`;
  }
  if (
    index <= messages.length - 1 &&
    (currentMessage?.sender?._id !== messages[index - 1]?.sender._id ||
      messages[index - 1]?.sender?._id === undefined) &&
    messages[index].sender._id !== userId
  ) {
    return `<b>${currentMessage.sender.name}</b>`;
  }
  return `<b></b`;
};

export const isLastMessage = (messages, index, userId) => {
  return (
    index === messages?.length - 1 &&
    messages[messages?.length - 1].sender?._id !== userId &&
    messages[messages.length - 1].sender?._id
  );
};

export const showLastMessage = (chat, userLogin) => {
  const LastSender = chat?.latestMessage?.sender;
  const newUser = chat?.users?.find((user) => user?._id === LastSender);
  return userLogin?.userId !== newUser?._id
    ? `<b>${newUser?.name}: </b>${chat?.latestMessage?.content}`
    : `${chat?.latestMessage?.content}`;
};

//setting margins
export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1]?.sender?._id === m?.sender?._id &&
    messages[i]?.sender?._id !== userId
  )
    return 0;
  else if (
    (i < messages?.length - 1 &&
      messages[i + 1]?.sender?._id !== m?.sender?._id &&
      messages[i]?.sender?._id !== userId) ||
    (i === messages.length - 1 && messages[i]?.sender?._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, currentMessage, index) => {
  return (
    index > 0 &&
    messages[index - 1]?.sender?._id === currentMessage?.sender?._id
  );
};

export function Display24HoursTimeFormat(time) {
  const date = new Date(time);
  let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  hours = hours < 10 ? "0" + hours : hours;
  var minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  time = hours + ":" + minutes;
  return time;
}
