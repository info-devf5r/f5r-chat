import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/components/HomePage/CurrentUser.module.css';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../../components/Input';
import Resource from '../../Resource';
import { BsCameraVideo } from 'react-icons/bs';
import {
  toggleModalGroupProfile,
  toggleModalVideoCall,
} from '../../store/features/modalSlice';
import useWindowSize from '../../hooks/useWindowSize';
import { GiHamburgerMenu } from 'react-icons/gi';
import { toggleSidebarOpen } from '../../store/features/drawerSlice';
import { IoMdClose, IoIosSearch } from 'react-icons/io';

const CurrentUser = (props) => {
  const chat = useSelector((state) => state.chat.currentChat);
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const [inSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, [inSearchOpen]);

  const openModal = () => {
    if (chat.isGroupChat) {
      dispatch(toggleModalGroupProfile());
    }
  };

  if (inSearchOpen) {
    return (
      <div className={styles.container} style={{ paddingBottom: '17px' }}>
        <Input
          fieldClassName={'SearchMessageField'}
          className={'SearchMessageInput'}
          name={'search'}
          type={'text'}
          ref={searchRef}
          icon={Resource.Svg.SEARCH2}
          value={props.filter}
          onChange={(e) => props.setFilter(e.target.value)}
          placeholder={'جستجوی پیام...'}
        />
        <IoMdClose
          size={25}
          onClick={() => {
            setIsSearchOpen(false);
            props.setFilter('');
          }}
          color='var(--text-primary)'
          cursor={'pointer'}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {Object.keys(chat).length > 0 ? (
        <>
          {width <= 900 && (
            <GiHamburgerMenu
              color='var(--text-primary)'
              size={20}
              onClick={() => dispatch(toggleSidebarOpen())}
              style={{ marginRight: '5px' }}
              cursor='pointer'
            />
          )}
          <div
            className={styles.group}
            style={{ cursor: 'pointer' }}
            onClick={openModal}
          >
            <img src={chat.img} alt={chat.username} />
            <h4>{chat.username}</h4>
          </div>
          <div className={styles.group}>
            {!chat.isGroupChat && (
              <BsCameraVideo
                onClick={() => dispatch(toggleModalVideoCall())}
                size={25}
                style={{ cursor: 'pointer', marginLeft: '20px' }}
                color='var(--text-primary)'
              />
            )}
            <IoIosSearch
              onClick={() => {
                setIsSearchOpen(true);
              }}
              size={25}
              color='var(--text-primary)'
              cursor={'pointer'}
            />
          </div>
        </>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {width <= 900 && (
            <GiHamburgerMenu
              cursor={'pointer'}
              color='var(--text-primary)'
              size={20}
              onClick={() => dispatch(toggleSidebarOpen())}
            />
          )}
          <h4 style={{ marginRight: '15px' }}>لطفا چتی را انتخاب کنید</h4>
        </div>
      )}
    </div>
  );
};

CurrentUser.propTypes = {
  filter: PropTypes.string,
  setFilter: PropTypes.func,
};

export default CurrentUser;
