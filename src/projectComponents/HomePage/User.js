import { useRef } from 'react';
import styles from '../../styles/components/HomePage/SearchUser.module.css';
import PropTypes from 'prop-types';
import Button from '../../components/Button';
import Resource from '../../Resource';
import { useRemoveFromGroupChat } from '../../api/useChat';
import { useQueryClient } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'jalali-moment';
import { toast } from 'react-toastify';
import { getCurrentChat } from '../../store/features/chatSlice';

const User = (props) => {
  const queryClient = useQueryClient();
  const chat = useSelector((state) => state.chat.currentChat);
  const onlineUsers = useSelector((state) => state.user.onlineUsers);
  const user = useSelector((state) => state.auth.user);
  const toastRef = useRef();
  const dispatch = useDispatch();

  const notify = () => (toastRef.current = toast('لطفا منتظر باشید.'));

  const dismiss = () => toast.dismiss(toastRef.current);

  const onRemoveFromGroupChatSuccess = (chat) => {
    toast.success('کاربر با موفقیت حذف گردید.');
    queryClient.invalidateQueries('chats');
    dismiss();

    const data = {
      key: chat?._id,
      id: chat?._id,
      users: chat.isGroupChat && chat?.users,
      isOnline:
        !chat.isGroupChat &&
        onlineUsers.some((data) => data.id === chat?.users?.[0]?._id),

      img:
        chat?.users?.[0]?.avatar ||
        'https://cdn3.iconfinder.com/data/icons/generic-avatars/128/avatar_portrait_man_male_5-128.png',

      username: chat?.isGroupChat ? chat?.chatName : chat?.users[0].username,

      lastMsg:
        chat?.latestMessage?.type === 'text'
          ? chat?.latestMessage?.content
          : chat?.latestMessage?.type === 'file' ||
            chat?.latestMessage?.type === 'document'
          ? 'محتوای فایلی'
          : chat?.latestMessage?.type === 'audio'
          ? 'محتوای صوتی'
          : '',

      time:
        chat?.latestMessage?.createdAt &&
        moment(chat?.latestMessage?.createdAt).format('jYYYY/jMM/jDD'),

      unreadMessages: chat?.unreadMessages.filter(
        (message, index, array) =>
          message.sender !== user.id && array.indexOf(message) === index
      ),
      isGroupChat: chat?.isGroupChat,
      groupAdmin: chat?.groupAdmin,
    };

    dispatch(getCurrentChat(data));
  };

  const onRemoveFromGroupChatFail = (err) => {
    toast.error(err.response.data.message || 'خطا در حذف کاربر');
    dismiss();
  };

  const { mutate, isLoading } = useRemoveFromGroupChat(
    onRemoveFromGroupChatSuccess,
    onRemoveFromGroupChatFail
  );

  const onItemClick = () => {
    if (chat?.groupAdmin?._id === user.id) {
      const data = {
        chatId: chat.id,
        userId: props.id,
      };
      mutate(data);
    }
  };

  if (isLoading) {
    notify();
  }

  return (
    <div className={styles.container}>
      <div className={styles.group}>
        <img src={props.img} alt={props.username} />
        <h4>{props.username}</h4>
      </div>
      {chat?.groupAdmin?._id === user.id && (
        <Button
          onClick={onItemClick}
          className='PerformBtn'
          title={!isLoading && 'حذف'}
          disabled={isLoading}
          icon={isLoading && Resource.Gifs.BTN_LOADER}
        />
      )}
    </div>
  );
};

User.propTypes = {
  img: PropTypes.string,
  username: PropTypes.string,
};

export default User;
