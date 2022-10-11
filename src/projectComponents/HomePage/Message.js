import styles from '../../styles/components/HomePage/Message.module.css';
import PropTypes from 'prop-types';
import ModalImage from 'react-modal-image';
import { useDispatch, useSelector } from 'react-redux';
import { setMessageToReply } from '../../store/features/messageSlice';
import { CgFileDocument } from 'react-icons/cg';
// import { useDownloadDocument } from '../../api/useMessage';
import Player from '../Player';

const Message = (props) => {
  const dispatch = useDispatch();
  // const { mutate: downloadDocument } = useDownloadDocument();
  const user = useSelector((state) => state.auth.user);

  if (props.type === 'text') {
    return (
      <div
        id={props.id}
        onClick={props.onClick}
        onDoubleClick={props.onDoubleClick}
        className={styles.container}
        style={{
          justifyContent: `${props.fromSelf ? 'flex-start' : 'flex-end'}`,
        }}
      >
        <div className={styles.replyGroup}>
          {props.replyTo && (
            <div className={styles.replyContainer}>
              {props.replyTo.type === 'text' ? (
                <>
                  <span style={{ marginBottom: '2px', display: 'block' }}>
                    در پاسخ به
                  </span>
                  <h4
                    onClick={() =>
                      props.moveToElement(props.replyTo.id || props.replyTo._id)
                    }
                  >
                    {props.replyTo.content}
                  </h4>
                </>
              ) : props.replyTo.type === 'file' ? (
                <>
                  <span style={{ marginBottom: '2px', display: 'block' }}>
                    در پاسخ به
                  </span>
                  <img
                    onClick={() =>
                      props.moveToElement(props.replyTo.id || props.replyTo._id)
                    }
                    src={`${process.env.REACT_APP_SOCKET_ROUTE}${props.replyTo.content}`}
                    alt='img'
                  />
                </>
              ) : props.replyTo.type === 'audio' ? (
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    props.moveToElement(props.replyTo.id || props.replyTo._id)
                  }
                >
                  <span style={{ marginBottom: '2px', display: 'block' }}>
                    در پاسخ به
                  </span>
                  <Player message={props.message} />
                </div>
              ) : props.replyTo.type === 'document' ? (
                <>
                  <span style={{ marginBottom: '2px', display: 'block' }}>
                    در پاسخ به
                  </span>
                  <div className={styles.replyDocumentGroup}>
                    <h4
                      onClick={() =>
                        props.moveToElement(
                          props.replyTo.id || props.replyTo._id
                        )
                      }
                    >
                      {props.replyTo.content}
                    </h4>
                    <CgFileDocument
                      style={{ marginRight: '5px' }}
                      size={25}
                      color='var(--text-secondary)'
                    />
                  </div>
                </>
              ) : null}
            </div>
          )}
          <div className={styles.content}>
            <img
              className={styles.avatar}
              src={props.avatar}
              alt={props.username}
            />
            <div className={styles.group}>
              <p>{props.message}</p>
              <span>{props.time}</span>
            </div>
          </div>
        </div>
        <div
          className={styles.options}
          style={{ display: `${props.show ? 'block' : 'none'}` }}
        >
          <h2
            onClick={() => dispatch(setMessageToReply(props))}
            className={styles.option}
          >
            پاسخ
          </h2>
          <h2 className={styles.option}>ارسال</h2>
        </div>
      </div>
    );
  } else if (props.type === 'file') {
    return (
      <div
        id={props.id}
        onClick={props.onClick}
        onDoubleClick={props.onDoubleClick}
        style={{
          justifyContent: `${props.fromSelf ? 'flex-start' : 'flex-end'}`,
        }}
        className={[styles.container, styles.container2].join(' ')}
      >
        <div className={styles.replyGroup}>
          {props.replyTo && (
            <div className={styles.replyContainer}>
              {props.replyTo.type === 'text' ? (
                <>
                  <span style={{ marginBottom: '10px', display: 'block' }}>
                    در پاسخ به
                  </span>
                  <h4
                    onClick={() =>
                      props.moveToElement(props.replyTo.id || props.replyTo._id)
                    }
                  >
                    {props.replyTo.content}
                  </h4>
                </>
              ) : props.replyTo.type === 'file' ? (
                <>
                  <span style={{ marginBottom: '10px', display: 'block' }}>
                    در پاسخ به{' '}
                  </span>
                  <img
                    onClick={() =>
                      props.moveToElement(props.replyTo.id || props.replyTo._id)
                    }
                    src={`${process.env.REACT_APP_SOCKET_ROUTE}${props.replyTo.content}`}
                    alt='img'
                  />
                </>
              ) : props.replyTo.type === 'audio' ? (
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    props.moveToElement(props.replyTo.id || props.replyTo._id)
                  }
                >
                  <span style={{ marginBottom: '10px', display: 'block' }}>
                    در پاسخ به
                  </span>
                  <Player message={props.message} />
                </div>
              ) : props.replyTo.type === 'document' ? (
                <>
                  <span style={{ marginBottom: '2px', display: 'block' }}>
                    در پاسخ به
                  </span>
                  <div className={styles.replyDocumentGroup}>
                    <h4
                      onClick={() =>
                        props.moveToElement(
                          props.replyTo.id || props.replyTo._id
                        )
                      }
                    >
                      {props.replyTo.content}
                    </h4>
                    <CgFileDocument
                      style={{ marginRight: '5px' }}
                      size={25}
                      color='var(--text-secondary)'
                    />
                  </div>
                </>
              ) : null}
            </div>
          )}
          <div className={styles.content}>
            <img
              className={styles.avatar}
              src={props.avatar}
              alt={props.username}
            />
            <div className={styles.group}>
              <ModalImage
                small={`${process.env.REACT_APP_SOCKET_ROUTE}${props.message}`}
                large={`${process.env.REACT_APP_SOCKET_ROUTE}${props.message}`}
                alt='img'
                className={styles.img}
              />
              <span>{props.time}</span>
            </div>
          </div>
        </div>
        <div
          className={styles.options}
          style={{ display: `${props.show ? 'block' : 'none'}` }}
        >
          <h2
            onClick={() => dispatch(setMessageToReply(props.data))}
            className={styles.option}
          >
            پاسخ
          </h2>
          <h2 className={styles.option}>ارسال</h2>
        </div>
      </div>
    );
  } else if (props.type === 'audio') {
    return (
      <>
        <div
          id={props.id}
          onClick={props.onClick}
          onDoubleClick={props.onDoubleClick}
          style={{
            justifyContent: `${props.fromSelf ? 'flex-start' : 'flex-end'}`,
          }}
          className={[styles.container, styles.container2].join(' ')}
        >
          <div className={styles.replyGroup}>
            {props.replyTo && (
              <div className={styles.replyContainer}>
                {props.replyTo.type === 'text' ? (
                  <>
                    <span style={{ marginBottom: '10px', display: 'block' }}>
                      در پاسخ به
                    </span>
                    <h4
                      onClick={() =>
                        props.moveToElement(
                          props.replyTo.id || props.replyTo._id
                        )
                      }
                    >
                      {props.replyTo.content}
                    </h4>
                  </>
                ) : props.replyTo.type === 'file' ? (
                  <>
                    <span style={{ marginBottom: '10px', display: 'block' }}>
                      در پاسخ به{' '}
                    </span>
                    <img
                      onClick={() =>
                        props.moveToElement(
                          props.replyTo.id || props.replyTo._id
                        )
                      }
                      src={`${process.env.REACT_APP_SOCKET_ROUTE}${props.replyTo.content}`}
                      alt='img'
                    />
                  </>
                ) : props.replyTo.type === 'audio' ? (
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      props.moveToElement(props.replyTo.id || props.replyTo._id)
                    }
                  >
                    <span style={{ marginBottom: '10px', display: 'block' }}>
                      در پاسخ به
                    </span>
                    <Player message={props.message} />
                  </div>
                ) : props.replyTo.type === 'document' ? (
                  <>
                    <span style={{ marginBottom: '2px', display: 'block' }}>
                      در پاسخ به
                    </span>
                    <div className={styles.replyDocumentGroup}>
                      <h4
                        onClick={() =>
                          props.moveToElement(
                            props.replyTo.id || props.replyTo._id
                          )
                        }
                      >
                        {props.replyTo.content}
                      </h4>
                      <CgFileDocument
                        style={{ marginRight: '5px' }}
                        size={25}
                        color='var(--text-secondary)'
                      />
                    </div>
                  </>
                ) : null}
              </div>
            )}
            <div className={styles.content}>
              <img
                className={styles.avatar}
                src={props.avatar}
                alt={props.username}
              />
              <div className={styles.group}>
                <Player message={props.message} />
                <span>{props.time}</span>
              </div>
            </div>
          </div>
          <div
            className={styles.options}
            style={{ display: `${props.show ? 'block' : 'none'}` }}
          >
            <h2
              onClick={() => dispatch(setMessageToReply(props.data))}
              className={styles.option}
            >
              پاسخ
            </h2>
            <h2 className={styles.option}>ارسال</h2>
          </div>
        </div>
      </>
    );
  } else if (props.type === 'document') {
    return (
      <div
        id={props.id}
        onClick={props.onClick}
        onDoubleClick={props.onDoubleClick}
        className={styles.container}
        style={{
          justifyContent: `${props.fromSelf ? 'flex-start' : 'flex-end'}`,
        }}
      >
        <div className={styles.replyGroup}>
          {props.replyTo && (
            <div className={styles.replyContainer}>
              {props.replyTo.type === 'text' ? (
                <>
                  <span style={{ marginBottom: '2px', display: 'block' }}>
                    در پاسخ به
                  </span>
                  <h4
                    onClick={() =>
                      props.moveToElement(props.replyTo.id || props.replyTo._id)
                    }
                  >
                    {props.replyTo.content}
                  </h4>
                </>
              ) : props.replyTo.type === 'file' ? (
                <>
                  <span style={{ marginBottom: '2px', display: 'block' }}>
                    در پاسخ به
                  </span>
                  <img
                    onClick={() =>
                      props.moveToElement(props.replyTo.id || props.replyTo._id)
                    }
                    src={`${process.env.REACT_APP_SOCKET_ROUTE}${props.replyTo.content}`}
                    alt='img'
                  />
                </>
              ) : props.replyTo.type === 'audio' ? (
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    props.moveToElement(props.replyTo.id || props.replyTo._id)
                  }
                >
                  <span style={{ marginBottom: '2px', display: 'block' }}>
                    در پاسخ به
                  </span>
                  <Player message={props.message} />
                </div>
              ) : props.replyTo.type === 'document' ? (
                <>
                  <span style={{ marginBottom: '2px', display: 'block' }}>
                    در پاسخ به
                  </span>
                  <div className={styles.replyDocumentGroup}>
                    <h4
                      onClick={() =>
                        props.moveToElement(
                          props.replyTo.id || props.replyTo._id
                        )
                      }
                    >
                      {props.replyTo.content.split(`/${user.username}/`)[1]}
                    </h4>
                    <CgFileDocument
                      style={{ marginRight: '5px' }}
                      size={25}
                      color='var(--text-secondary)'
                    />
                  </div>
                </>
              ) : null}
            </div>
          )}
          <div
            className={styles.content}
            onClick={() =>
              // downloadDocument({
              //   file: `${process.env.REACT_APP_SOCKET_ROUTE}${props.message}`,
              // })
              window.open(
                `${process.env.REACT_APP_SOCKET_ROUTE}${props.message}`
              )
            }
          >
            <img
              className={styles.avatar}
              src={props.avatar}
              alt={props.username}
            />
            <CgFileDocument
              style={{ marginRight: '5px' }}
              size={25}
              color='var(--text-secondary)'
            />
            <div className={styles.group}>
              <p>{props.message.split(`/${user.username}/`)[1]}</p>
              <span>{props.time}</span>
            </div>
          </div>
        </div>
        <div
          className={styles.options}
          style={{ display: `${props.show ? 'block' : 'none'}` }}
        >
          <h2
            onClick={() => dispatch(setMessageToReply(props))}
            className={styles.option}
          >
            پاسخ
          </h2>
          <h2 className={styles.option}>ارسال</h2>
        </div>
      </div>
    );
  }
};

Message.propTypes = {
  fromSelf: PropTypes.bool,
  type: PropTypes.string,
  message: PropTypes.string,
  time: PropTypes.string,
  avatar: PropTypes.string,
  username: PropTypes.string,
};

export default Message;
