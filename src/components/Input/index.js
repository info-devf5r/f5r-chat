import React, { forwardRef } from 'react';
import styles from './index.module.css';
import './index.module.css';
import PropTypes from 'prop-types';

const Input = forwardRef((props, ref) => {
  const fieldClasses = [styles.InputField];
  const groupClasses = [styles.InputGroup];
  const classes = [styles.Input];

  if (props.fieldClassName) fieldClasses.push(styles[props.fieldClassName]);
  if (props.groupClassName) groupClasses.push(styles[props.groupClassName]);
  if (props.className) classes.push(styles[props.className]);
  if (props.error) classes.push(styles['error']);

  return (
    <>
      <div
        className={fieldClasses.join(' ')}
        style={{
          border: `${props.error ? '1px solid #e63946' : '1px solid #dce0e4'}`,
        }}
      >
        {props.icon && <img onClick={props.imgClick} src={props.icon} alt='' />}
        <div className={groupClasses.join(' ')}>
          {props.label && <label htmlFor={props.id}>{props.label}</label>}
          {props.kind === 'input' ? (
            <input
              type={props.type}
              className={classes.join(' ')}
              id={props.id}
              name={props.name}
              readOnly={props.readOnly}
              placeholder={props.placeholder}
              onChange={props.onChange}
              ref={ref}
              onBlur={props.onBlur}
              onFocus={props.onFocus}
              onInput={props.onInput}
              onClick={props.onClick}
              value={props.value}
              autoComplete={'off'}
              maxLength={props.maxLength}
              minLength={props.minLength}
              style={props.style}
              disabled={props.disabled}
            />
          ) : (
            <textarea
              id={props.id}
              rows={props.rows}
              cols={props.cols}
              readOnly={props.readOnly}
              value={props.value}
              onFocus={props.onFocus}
              placeholder={props.placeholder}
              onChange={props.onChange}
              onBlur={props.onBlur}
              maxLength={props.maxLength}
              style={props.style}
              className={`Input ${props.className} ${props.error && 'error'}`}
              draggable={false}
              ref={ref}
              disabled={props.disabled}
              name={props.name}
              onInput={props.onInput}
              onClick={props.onClick}
            ></textarea>
          )}
          {props.trailingIcon && <img src={props.trailingIcon} />}
        </div>
      </div>
      {props.error && <h4 className={styles.error}>{props.error}</h4>}
    </>
  );
});

Input.defaultProps = {
  type: null,
  id: null,
  name: null,
  readOnly: false,
  label: null,
  icon: null,
  trailingIcon: null,
  placeholder: null,
  maxLength: null,
  minLength: null,
  className: null,
  error: null,
  fieldClassName: null,
  groupClassName: null,
  theme: null,
  value: null,
  style: null,
  disabled: false,
  kind: 'input',
  cols: null,
  rows: null,
  onChange: (_) => null,
  onBlur: (_) => null,
  onFocus: (_) => null,
  onInput: (_) => null,
  onClick: (_) => null,
  imgClick: (_) => null,
};

Input.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  label: PropTypes.string,
  icon: PropTypes.string,
  trailingIcon: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  className: PropTypes.string,
  fieldClassName: PropTypes.string,
  groupClassName: PropTypes.string,
  theme: PropTypes.string,
  value: PropTypes.string,
  style: PropTypes.object,
  kind: PropTypes.string,
  cols: PropTypes.number,
  rows: PropTypes.number,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onInput: PropTypes.func,
  onClick: PropTypes.func,
  imgClick: PropTypes.func,
};

export default Input;
