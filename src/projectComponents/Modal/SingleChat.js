import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Resource from '../../Resource';
import { useSearchUsers } from '../../api/useUser';
import SearchUser from '../HomePage/SearchUser';
import styles from '../../styles/components/Modal/SingleChat.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModalSingleChat } from '../../store/features/modalSlice';

const SingleChatModal = () => {
  const [query, setQuery] = useState();
  const { data, refetch } = useSearchUsers(query);
  const isOpen = useSelector((state) => state.modal.modalSingleChat);
  const dispatch = useDispatch();

  useEffect(() => {
    refetch(query);
    // eslint-disable-next-line
  }, [query]);

  const onClose = () => {
    dispatch(toggleModalSingleChat());
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={{
        base: 'SingleChatModal',
        afterOpen: 'SingleChatModal__after-open',
        beforeClose: 'SingleChatModal__before-close',
      }}
      overlayClassName={{
        base: 'SingleChatOverlay',
        afterOpen: 'SingleChatOverlay__after-open',
        beforeClose: 'SingleChatOverlay__before-close',
      }}
    >
      <div className={styles.container}>
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
                  setQuery={setQuery}
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
    </Modal>
  );
};

export default SingleChatModal;
