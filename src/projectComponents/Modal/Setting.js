import { useState } from 'react';
import Modal from '../../components/Modal';
import styles from '../../styles/components/Modal/Setting.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModalSetting } from '../../store/features/modalSlice';
import { IoMoonOutline } from 'react-icons/io5';
import { HiOutlineSun } from 'react-icons/hi';
import useLocalStorage from 'use-local-storage';

const SettingModal = (props) => {
  const isOpen = useSelector((state) => state.modal.modalSetting);
  const dispatch = useDispatch();

  const [localTheme] = useLocalStorage('chatly-theme');
  const [theme, setTheme] = useState(localTheme);

  const onClose = () => {
    dispatch(toggleModalSetting());
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={{
        base: 'SettingModal',
        afterOpen: 'SettingModal__after-open',
        beforeClose: 'SettingModal__before-close',
      }}
      overlayClassName={{
        base: 'SettingOverlay',
        afterOpen: 'SettingOverlay__after-open',
        beforeClose: 'SettingOverlay__before-close',
      }}
    >
      <div className={styles.container}>
        <h2>تنظیمات</h2>
        <div className={styles.theme}>
          <span>تم :</span>

          <div
            style={{
              background: `${theme === 'dark' ? 'transparent' : '#258C60'}`,
            }}
          >
            <HiOutlineSun
              color={`${theme === 'dark' ? '#258C60' : '#ffffff'}`}
              size={20}
              onClick={() => {
                props.setTheme('light');
                setTheme('light');
              }}
            />
          </div>
          <div
            style={{
              backgroundColor: `${
                theme === 'light' ? 'transparent' : '#258C60'
              }`,
            }}
          >
            <IoMoonOutline
              color={`${theme === 'light' ? '#258C60' : '#ffffff'}`}
              size={18}
              onClick={() => {
                props.setTheme('dark');
                setTheme('dark');
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingModal;
