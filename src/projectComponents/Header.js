import { useState } from 'react';
import Resource from '../Resource';
import styles from '../styles/components/Header.module.css';
import { IoMoonOutline } from 'react-icons/io5';
import { HiOutlineSun } from 'react-icons/hi';
import { BsBell } from 'react-icons/bs';
import moment from 'jalali-moment';
import useLocalStorage from 'use-local-storage';

const Header = (props) => {
  const [localTheme] = useLocalStorage('chatly-theme');
  const [theme, setTheme] = useState(localTheme);
  return (
    <header className={styles.container}>
      <div className={styles.theme}>
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
            backgroundColor: `${theme === 'light' ? 'transparent' : '#258C60'}`,
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

      <span>{moment().format('jYYYY/jMM/jDD')}</span>

      <div className={styles.notif}>
        <BsBell size={22} color='var(--text-secondary)' />
        <img className={styles.dot} src={Resource.Svg.DOT} alt='dot-icon' />
      </div>
    </header>
  );
};

export default Header;
