import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Resource from '../../Resource';
import { useSearchUsers } from '../../api/useUser';
import { useRenameGroupChat } from '../../api/useChat';
import User from '../HomePage/User';
import SearchUser from '../HomePage/SearchUser';
import styles from '../../styles/components/Modal/GroupProfile.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModalGroupProfile } from '../../store/features/modalSlice';
import { useQueryClient } from 'react-query';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import { getCurrentChat } from '../../store/features/chatSlice';
import moment from 'jalali-moment';

const GroupProfileModal = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.auth.user);
  const chat = useSelector((state) => state.chat.currentChat);
  const onlineUsers = useSelector((state) => state.user.onlineUsers);
  const dispatch = useDispatch();

  const onRenameSuccess = (chat) => {
    toast.success('نام چت با موفقیت تغییر یافت');
    queryClient.invalidateQueries('chats');

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
    onClose();
  };

  const onRenameFail = (err) => {
    toast.error(err.response.data.message || 'خطا در تغییر نام چت');
  };

  const { mutate: renameGroup, isLoading: isLoadingRename } =
    useRenameGroupChat(onRenameSuccess, onRenameFail);

  const [query, setQuery] = useState();
  const [chatName, setChatName] = useState();
  const { data: users, refetch } = useSearchUsers(query);
  const isOpen = useSelector((state) => state.modal.modalGroupProfile);

  useEffect(() => {
    refetch(query);
    // eslint-disable-next-line
  }, [query]);

  const onClose = () => {
    if (!isLoadingRename) dispatch(toggleModalGroupProfile());
  };

  const renameGroupChat = () => {
    const data = {
      chatId: chat.id,
      userId: user.id,
      chatName,
    };

    renameGroup(data);
    setChatName('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={{
        base: 'GroupProfileModal',
        afterOpen: 'GroupProfileModal__after-open',
        beforeClose: 'GroupProfileModal__before-close',
      }}
      overlayClassName={{
        base: 'GroupProfileOverlay',
        afterOpen: 'GroupProfileOverlay__after-open',
        beforeClose: 'GroupProfileOverlay__before-close',
      }}
    >
      <div className={styles.container}>
        <div
          className={styles.chatName}
          style={{
            display: `${chat?.groupAdmin?._id === user.id ? 'flex' : 'none'}`,
          }}
        >
          <Input
            fieldClassName={'ChatNameField'}
            className={'ChatNameInput'}
            name={'chatName'}
            type={'text'}
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            placeholder={'نام چت'}
          />
          <Button
            className='PerformBtn'
            title={!isLoadingRename && 'اعمال'}
            icon={isLoadingRename && Resource.Gifs.BTN_LOADER}
            disabled={isLoadingRename}
            onClick={renameGroupChat}
          />
        </div>

        <h4>اعضای گروه</h4>
        <div className={styles.users}>
          {chat.users?.length > 0 ? (
            chat.users
              .filter((data) => data._id?.toString() !== user.id?.toString())
              .map((user) => {
                return (
                  <User
                    key={user._id}
                    id={user._id}
                    username={user.username}
                    img={
                      user.avatar ||
                      'https://cdn3.iconfinder.com/data/icons/generic-avatars/128/avatar_portrait_man_male_5-128.png'
                    }
                  />
                );
              })
          ) : (
            <h4 style={{ color: 'var(--text-secondary)', margin: '10px 0' }}>
              کاربری وجود ندارد
            </h4>
          )}
        </div>
        <div
          style={{
            display: `${chat?.groupAdmin?._id === user.id ? 'block' : 'none'}`,
          }}
        >
          <h4 style={{ marginTop: '10px' }}>افزودن کاربر جدید</h4>
          <div className={styles.searchUsers}>
            <Input
              fieldClassName={'SearchUserField'}
              className={'SearchUserInput'}
              name={'search'}
              type={'text'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={Resource.Svg.SEARCH2}
              placeholder={'جستجوی کاربر جهت افزودن به گروه'}
            />
            <div>
              {users &&
                users.map((user) => {
                  return (
                    <SearchUser
                      key={user._id}
                      id={user._id}
                      username={user.username}
                      img={
                        user.avatar
                          ? `${process.env.REACT_APP_SOCKET_ROUTE}${user.avatar}`
                          : 'https://cdn3.iconfinder.com/data/icons/generic-avatars/128/avatar_portrait_man_male_5-128.png'
                      }
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GroupProfileModal;
