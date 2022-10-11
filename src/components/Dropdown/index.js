import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';
import { BiDotsVerticalRounded } from 'react-icons/bi';

const Dropdown = forwardRef((props, ref) => {
  return (
    <div className={styles.container}>
      <div ref={ref} style={{ display: 'flex' }}>
        <BiDotsVerticalRounded
          style={{ cursor: 'pointer' }}
          size={30}
          id={'dot'}
          color='var(--text-primary)'
          onClick={props.onClick}
        />
      </div>
      <div
        className={styles.dropdown}
        style={{
          display: `${props.show ? 'block' : 'none'}`,
          opacity: `${props.show ? 1 : 0}`,
          transition: 'all .5s ease',
        }}
      >
        {props.children}
      </div>
    </div>
  );
});

Dropdown.propTypes = {
  show: PropTypes.bool,
};

export default Dropdown;
