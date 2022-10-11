import { useState, useEffect, useRef } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { ImAttachment } from 'react-icons/im';
import { FaTelegramPlane } from 'react-icons/fa';
import { Picker } from 'emoji-mart-virtualized';
import { useFilePicker } from 'use-file-picker';
import 'emoji-mart-virtualized/css/emoji-mart.css';
import styles from '../styles/components/ChatInput.module.css';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {
  getFile,
  add,
  removeMessageToReply,
} from '../store/features/messageSlice';
import moment from 'jalali-moment';
import { useSendMessage, useReplyMessage } from '../api/useMessage';
import { useIncreseUnreadMessages } from '../api/useChat';
import { useSelector } from 'react-redux';
import {
  toggleModalFile,
  toggleModalVoice,
} from '../store/features/modalSlice';
import { useQueryClient } from 'react-query';
import { FaMicrophone } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { CgFileDocument } from 'react-icons/cg';

let id;
const ChatInput = () => {
  const queryClient = useQueryClient();
  const socket = useSelector((state) => state.chat.socket);
  const messageToReply = useSelector((state) => state.message.messageToReply);
  const user = useSelector((state) => state.auth.user);
  const inputRef = useRef();

  const onIncreseUnreadMessagesSuccess = () => {
    queryClient.invalidateQueries('chats');
  };

  const { mutate: increaseUnreadMessages } = useIncreseUnreadMessages(
    onIncreseUnreadMessagesSuccess
  );
  const chat = useSelector((state) => state.chat.currentChat);

  const dispatch = useDispatch();

  const onReplySuccess = (data) => {
    socket?.emit('new message', data);
    dispatch(removeMessageToReply());
  };

  const onSendSuccess = (data) => {
    socket?.emit('new message', data);
  };

  const {
    mutate: sendMessage,
    isLoading: sendLoading,
    isIdle: isIdleSend,
  } = useSendMessage(onSendSuccess);
  const {
    mutate: reply,
    isLoading: replyLoading,
    isIdle: isIdleReply,
  } = useReplyMessage(onReplySuccess);

  const [showEmoji, setShowEmoji] = useState(false);
  const [text, setText] = useState({});

  useEffect(() => {
    id = chat.id;
  }, [chat.id]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [messageToReply]);

  useEffect(() => {
    if ((!sendLoading && isIdleSend) || (!replyLoading && isIdleReply)) {
      socket?.on('message recieved', (recievedData) => {
        console.log('called sockeet');
        console.log(id);
        console.log(recievedData.chat._id);
        if (!id || Object.keys(id).length < 0 || id !== recievedData.chat._id) {
          increaseUnreadMessages({
            chatId: recievedData.chat._id,
            message: recievedData,
          });
        } else {
          dispatch(add(recievedData));
          queryClient.invalidateQueries('chats');
        }
        console.log(recievedData);
      });
    }
    // eslint-disable-next-line
  }, [sendLoading, replyLoading]);

  const [openFileSelector, { filesContent, plainFiles, errors, clear }] =
    useFilePicker({
      readAs: 'Text',
      accept: ['image/*', '.pdf', '.zip', '.rar'],
      multiple: false,
      limitFilesConfig: { max: 1 },
      maxFileSize: 4,
    });

  const selectEmoji = (emoji, e) => {
    inputRef.current.focus();
    setText((state) => ({
      type: 'text',
      message: state?.message?.concat(emoji.native) || emoji.native,
      time: moment().format('HH:mm'),
    }));
  };

  const onChangeText = (e) => {
    setText({
      type: 'text',
      message: e.target.value,
      time: moment().format('HH:mm'),
    });
  };

  useEffect(() => {
    if (filesContent.length > 0) {
      console.log(plainFiles);
      console.log(
        URL.createObjectURL(new Blob([plainFiles[0].path], { type: 'image/*' }))
      );
      if (plainFiles[0].type.includes('image'))
        dispatch(
          getFile({
            type: 'file',
            message: URL.createObjectURL(plainFiles[0]),
            time: moment().format('HH:mm'),
            file: plainFiles[0],
          })
        );
      else
        dispatch(
          getFile({
            type: 'document',
            message: plainFiles[0].name,
            time: moment().format('HH:mm'),
            file: plainFiles[0],
          })
        );
      dispatch(toggleModalFile());
    }
    // eslint-disable-next-line
  }, [filesContent, dispatch]);

  const send = (e) => {
    e.preventDefault();
    setShowEmoji(false);
    const data = {
      content: text.message,
      chatId: chat.id,
      type: text.type,
      time: text.time,
    };
    if (messageToReply) {
      reply([data, messageToReply.id || messageToReply._id]);
    } else {
      sendMessage(data);
    }

    setText({
      type: 'text',
      message: '',
      time: '',
    });
  };

  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setShowEmoji(false);
      const data = {
        content: text.message,
        chatId: chat.id,
        type: text.type,
        time: text.time,
      };
      if (messageToReply) {
        reply([data, messageToReply.id || messageToReply._id]);
      } else {
        sendMessage(data);
      }
      setText({
        type: 'text',
        message: '',
        time: '',
      });
    }
  };

  const i18n = {
    search: 'جستجو',
    clear: 'حذف', // Accessible label on "clear" button
    notfound: 'اموجی پیدا نشد.',
    categories: {
      search: 'نتایج جستجو',
      recent: 'موارد پراستفاده',
      smileys: 'شکلک و لبخند',
      people: 'مردم و اعضای بدن',
      nature: 'حیوانات و طبیعت',
      foods: 'غذا و نوشیدنی',
      activity: 'فعالیت',
      places: 'سفر و اماکن',
      objects: 'اشیا',
      symbols: 'نشانه‌ها',
      flags: 'پرچم‌ها',
      custom: 'سنتی',
    },
  };

  const ref = useRef();

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowEmoji(false);
    }
  };

  if (errors.length) {
    if (errors[0].fileSizeToolarge) {
      toast.error('اندازه فایل حداکثر 4 مگابایت می‌باشد.');
      clear();
    }
  }

  if (!Object.keys(chat).length) {
    return;
  }

  return (
    <div className={styles.wrapper}>
      {messageToReply && messageToReply?.type === 'text' ? (
        <div className={styles.replyContainer}>
          <AiOutlineClose
            onClick={() => dispatch(removeMessageToReply())}
            cursor={'pointer'}
            size={25}
            style={{
              color: 'var(--text-primary)',
              marginLeft: '15px',
              cursor: 'pointer',
            }}
          />
          <h4>{messageToReply?.message}</h4>
        </div>
      ) : messageToReply?.type === 'file' ? (
        <div className={styles.replyContainer}>
          <AiOutlineClose
            onClick={() => dispatch(removeMessageToReply())}
            cursor={'pointer'}
            size={25}
            style={{
              color: 'var(--text-primary)',
              marginLeft: '15px',
              cursor: 'pointer',
            }}
          />
          <img
            src={`${process.env.REACT_APP_SOCKET_ROUTE}${messageToReply?.content}`}
            alt='img'
          />
        </div>
      ) : messageToReply?.type === 'audio' ? (
        <div className={styles.replyContainer}>
          <AiOutlineClose
            onClick={() => dispatch(removeMessageToReply())}
            cursor={'pointer'}
            size={25}
            style={{ color: 'var(--text-primary)', marginLeft: '15px' }}
          />
          <audio controls controlsList='nodownload'>
            <source
              src={`${process.env.REACT_APP_SOCKET_ROUTE}${messageToReply?.content}`}
              type='audio/ogg'
            />
            <source
              src={`${process.env.REACT_APP_SOCKET_ROUTE}${messageToReply?.content}`}
              type='audio/mpeg'
            />
            امکان اجرای ویس برای مرورگر شما وجود ندارد
          </audio>
        </div>
      ) : messageToReply?.type === 'document' ? (
        <div className={styles.replyContainer}>
          <AiOutlineClose
            onClick={() => dispatch(removeMessageToReply())}
            cursor={'pointer'}
            size={25}
            style={{
              color: 'var(--text-primary)',
              marginLeft: '15px',
              cursor: 'pointer',
            }}
          />
          <div className={styles.documentGroup}>
            <CgFileDocument
              style={{ marginLeft: '8px' }}
              size={25}
              color='var(--text-secondary)'
            />
            <h4>{messageToReply?.message.split(`/${user.username}/`)[1]}</h4>
          </div>
        </div>
      ) : null}
      <div className={styles.container}>
        <div className={styles.group}>
          <div ref={ref}>
            <BsEmojiSmile
              size={25}
              color='var(--text-secondary)'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setShowEmoji((state) => !state);
                inputRef.current.focus();
              }}
            />
          </div>
          <input
            ref={inputRef}
            type='text'
            placeholder='تایپ کنید...'
            value={text.message}
            onChange={onChangeText}
            onKeyDown={onEnterPress}
          />
          <ImAttachment
            size={25}
            color='#707072'
            style={{ cursor: 'pointer' }}
            onClick={() => openFileSelector()}
            name='file'
          />
        </div>
        <FaMicrophone
          onClick={() => dispatch(toggleModalVoice())}
          size='25'
          color='var(--text-secondary)'
          style={{ cursor: 'pointer' }}
        />
        <div className={styles.send} onClick={send}>
          <FaTelegramPlane size={20} color='#ffffff' />
        </div>

        <div ref={ref}>
          <Picker
            set='apple'
            showPreview={false}
            showSkinTones={false}
            i18n={i18n}
            style={{
              background: 'var(--background-side)',
              color: 'var(--text-primary)',

              position: 'absolute',
              right: 0,
              bottom: '50px',
              display: `${showEmoji ? 'block' : 'none'}`,
            }}
            // sheetSize={width < 768 ? 16 : 32}
            onClick={selectEmoji}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
