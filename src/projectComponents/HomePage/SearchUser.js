import { useRef } from 'react';
import styles from '../../styles/components/HomePage/SearchUser.module.css';
import PropTypes from 'prop-types';
import { useCreateChat, useAddToGroupChat } from '../../api/useChat';
import { useQueryClient } from 'react-query';
import { toggleModalSingleChat } from '../../store/features/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addToBadgeList, getCurrentChat } from '../../store/features/chatSlice';
import { toast } from 'react-toastify';
import moment from 'jalali-moment';
import Button from '../../components/Button';
import Resource from '../../Resource';

const SearchUser = (props) => {
  const toastRef = useRef();
  const queryClient = useQueryClient();
  const modal = useSelector((state) => state.modal.modalSingleChat);
  const modalAddGroup = useSelector((state) => state.modal.modalGroupProfile);
  const chat = useSelector((state) => state.chat.currentChat);
  const onlineUsers = useSelector((state) => state.user.onlineUsers);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const notify = () => (toastRef.current = toast('لطفا منتظر باشید.'));

  const dismiss = () => toast.dismiss(toastRef.current);

  const onAccessChatSuccess = () => {
    queryClient.invalidateQueries('chats');
    dispatch(toggleModalSingleChat());
    props.setQuery('');
    toast.success('چت با موفقیت ایجاد گردید');
  };
  const onAccessChatError = (error) => {
    console.log(error);
    toast.success('ایجاد چت با خطا مواجه شد');
  };

  const onAddToGroupChatSuccess = (chat) => {
    toast.success('کاربر با موفقیت اضافه شد.');
    dismiss();

    const data = {
      key: chat?._id,
      id: chat?._id,
      users: chat.isGroupChat && chat?.users,
      isOnline:
        !chat.isGroupChat &&
        onlineUsers.some((data) => data.id === chat?.users?.[0]?._id),

      img: chat?.users?.[0]?.avatar
        ? `${process.env.REACT_APP_SOCKET_ROUTE}${chat?.users?.[0]?.avatar}`
        : 'https://cdn3.iconfinder.com/data/icons/generic-avatars/128/avatar_portrait_man_male_5-128.png',

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

  const onAddToGroupChatError = (err) => {
    toast.error(err.response.data.message || 'خطا در افزودن کاربر');
    dismiss();
  };

  const { mutate } = useCreateChat(onAccessChatSuccess, onAccessChatError);
  const { mutate: addToGroup, isLoading: isLoadingAdd } = useAddToGroupChat(
    onAddToGroupChatSuccess,
    onAddToGroupChatError
  );

  const onItemClick = () => {
    if (modal) {
      mutate({ userId: props.id });
    } else if (modalAddGroup) {
      const data = {
        userId: props.id,
        chatId: chat.id,
      };
      addToGroup(data);
    } else {
      dispatch(addToBadgeList(props));
    }
  };

  if (isLoadingAdd) {
    notify();
  }

  return (
    <div className={styles.container}>
      <div className={styles.group}>
        <img src={props.img} alt={props.username} />
        <h4>{props.username}</h4>
      </div>
      <Button
        onClick={onItemClick}
        className='PerformBtn'
        title={!isLoadingAdd && modal ? 'ایجاد چت' : 'افزودن'}
        disabled={isLoadingAdd}
        icon={isLoadingAdd && Resource.Gifs.BTN_LOADER}
      />
    </div>
  );
};

SearchUser.propTypes = {
  img: PropTypes.string,
  username: PropTypes.string,
};

export default SearchUser;
