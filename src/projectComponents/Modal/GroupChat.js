import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Resource from '../../Resource';
import { useSearchUsers } from '../../api/useUser';
import { useCreateGroupChat } from '../../api/useChat';
import SearchUser from '../HomePage/SearchUser';
import styles from '../../styles/components/Modal/GroupChat.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModalGroupChat } from '../../store/features/modalSlice';
import { MdRemoveCircleOutline } from 'react-icons/md';
import Button from '../../components/Button';
import { removeFromBadgeList } from '../../store/features/chatSlice';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const Badge = (props) => {
  const dispatch = useDispatch();
  return (
    <div
      className={styles.Badge}
      onClick={() => dispatch(removeFromBadgeList(props.id))}
    >
      <span>{props.username}</span>
      <MdRemoveCircleOutline size={25} color='crimson' />
    </div>
  );
};

const GroupChatModal = () => {
  const queryClient = useQueryClient();
  const onCreateGroupChatSuccess = () => {
    queryClient.invalidateQueries('chats');
    dispatch(toggleModalGroupChat());
    toast.success('چت با موفقیت ایجاد شد');
  };

  const onCreateGroupChatٍError = (error) => {
    console.log(error);
    toast.error('خطا در ایجاد چت');
  };
  const { mutate: createGroup, isLoading } = useCreateGroupChat(
    onCreateGroupChatSuccess,
    onCreateGroupChatٍError
  );
  const [query, setQuery] = useState();
  const [chat, setChat] = useState();
  const { data, refetch } = useSearchUsers(query);
  const users = useSelector((state) => state.chat.groupBadgeList);
  const isOpen = useSelector((state) => state.modal.modalGroupChat);
  const dispatch = useDispatch();

  useEffect(() => {
    refetch(query);
    // eslint-disable-next-line
  }, [query]);

  const onClose = () => {
    if (!isLoading) dispatch(toggleModalGroupChat());
  };

  const createGroupChat = () => {
    const data = {
      name: chat,
      users,
    };

    createGroup(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={{
        base: 'GroupChatModal',
        afterOpen: 'GroupChatModal__after-open',
        beforeClose: 'GroupChatModal__before-close',
      }}
      overlayClassName={{
        base: 'GroupChatOverlay',
        afterOpen: 'GroupChatOverlay__after-open',
        beforeClose: 'GroupChatOverlay__before-close',
      }}
    >
      <div className={styles.container}>
        <Input
          fieldClassName={'ChatNameField'}
          className={'ChatNameInput'}
          name={'chatName'}
          type={'text'}
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          placeholder={'نام چت'}
        />
        <Input
          fieldClassName={'SearchUserField'}
          className={'SearchUserInput'}
          name={'search'}
          type={'text'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={Resource.Svg.SEARCH2}
          placeholder={'جستجو کاربر...'}
        />
        <div className={styles.users}>
          {data &&
            data.map((user) => {
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
        <div className={styles.addedUsers}>
          {users &&
            users.map((user) => (
              <Badge key={user.id} id={user.id} username={user.username} />
            ))}
        </div>
        <Button
          disabled={isLoading}
          icon={isLoading && Resource.Gifs.BTN_LOADER}
          title={!isLoading && 'ایجاد گروه'}
          className='createGroupBtn'
          onClick={createGroupChat}
        />
      </div>
    </Modal>
  );
};

export default GroupChatModal;
