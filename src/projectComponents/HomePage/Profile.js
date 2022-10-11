import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/components/HomePage/Profile.module.css';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { AiOutlinePlusCircle, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { HiOutlineLogout } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { IoSettingsOutline } from 'react-icons/io5';
import {
  toggleModalGroupChat,
  toggleModalProfile,
  toggleModalSetting,
  toggleModalSingleChat,
} from '../../store/features/modalSlice';
import Dropdown from '../../components/Dropdown';
import { logoutUser } from '../../store/features/authSlice';
import { getCurrentChat } from '../../store/features/chatSlice';

const Profile = (props) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const socket = useSelector((state) => state.chat.socket);

  const ref = useRef();

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShow(false);
    }
  };

  return (
    <div className={styles.container}>
      <IoSettingsOutline
        cursor={'pointer'}
        onClick={() => dispatch(toggleModalSetting())}
        size={30}
        color='var(--text-primary)'
      />
      <div
        className={styles.user}
        onClick={() => dispatch(toggleModalProfile())}
      >
        <img
          src={
            user.avatar
              ? `${process.env.REACT_APP_SOCKET_ROUTE}${user.avatar}`
              : props.profileImg
          }
          alt={user.username || props.username}
        />
        <h4>{user.username || props.username}</h4>
      </div>
      <Dropdown ref={ref} show={show} onClick={() => setShow(!show)}>
        <div className={styles.chatgroup}>
          <AiOutlinePlusCircle
            onClick={() => {
              dispatch(toggleModalSingleChat());
              setShow(false);
            }}
            size={28}
            color='var(--text-secondary)'
            style={{ marginBottom: '15px', cursor: 'pointer' }}
          />
          <AiOutlineUsergroupAdd
            onClick={() => {
              dispatch(toggleModalGroupChat());
              setShow(false);
            }}
            color='var(--text-secondary)'
            size={30}
            style={{ marginBottom: '15px', cursor: 'pointer' }}
          />
          <HiOutlineLogout
            onClick={() => {
              socket.disconnect();
              dispatch(logoutUser());
              dispatch(getCurrentChat({}));
            }}
            color='var(--text-secondary)'
            size={28}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </Dropdown>
    </div>
  );
};

Profile.propTypes = {
  profileImg: PropTypes.string,
  username: PropTypes.string,
};

export default Profile;
