import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import './index.css';

const Modal = (props) => {
  const options = {
    isOpen: props.isOpen,
    closeTimeoutMS: props.closeTimeoutMS,
    style: props.style,
    overlayClassName: props.overlayClassName,
    id: props.id,
    shouldFocusAfterRender: props.shouldFocusAfterRender,
    shouldCloseOnOverlayClick: props.shouldCloseOnOverlayClick,
    shouldCloseOnEsc: props.shouldCloseOnEsc,
    shouldReturnFocusAfterClose: props.shouldReturnFocusAfterClose,
    className: props.className,
    onAfterClose: props.onAfterClose,
    onAfterOpen: props.onAfterOpen,
    onRequestClose: props.onRequestClose,
    appElement: document.getElementById('#root'),
  };

  return <ReactModal {...options}>{props.children}</ReactModal>;
};

Modal.defaultProps = {
  isOpen: false,
  closeTimeoutMS: 300,
  style: { overlay: {}, content: {} },
  overlayClassName: 'ReactModal__Overlay',
  id: null,
  shouldFocusAfterRender: true,
  shouldCloseOnOverlayClick: true,
  shouldCloseOnEsc: true,
  shouldReturnFocusAfterClose: true,
  className: 'ReactModal__Content',
  onAfterClose: (_) => null,
  onAfterOpen: (_) => null,
  onRequestClose: (_) => null,
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  closeTimeoutMS: PropTypes.number,
  style: PropTypes.object,
  overlayClassName: PropTypes.object,
  id: PropTypes.string,
  shouldFocusAfterRender: PropTypes.bool,
  shouldCloseOnOverlayClick: PropTypes.bool,
  shouldCloseOnEsc: PropTypes.bool,
  shouldReturnFocusAfterClose: PropTypes.bool,
  className: PropTypes.object,
  onAfterClose: PropTypes.func,
  onAfterOpen: PropTypes.func,
  onRequestClose: PropTypes.func,
};

export default Modal;
