import React from 'react';
import styles from './index.module.css';
import PropTypes from 'prop-types';
import './index.module.css';

const Button = (props) => {
  const classes = [styles.Button];
  if (props.className) classes.push(styles[props.className]);
  if (props.theme) classes.push(styles[props.theme]);
  return (
    <button
      type='submit'
      className={classes.join(' ')}
      id={props.id}
      onClick={props.onClick}
      style={props.style}
      disabled={props.disabled}
    >
      {props.icon && <img src={props.icon} alt='' />}
      {props.title}
    </button>
  );
};

Button.defaultProps = {
  icon: null,
  id: null,
  className: null,
  theme: null,
  onClick: null,
  style: null,
  title: null,
  disabled: false,
};

Button.propTypes = {
  icon: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  theme: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
  title: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
