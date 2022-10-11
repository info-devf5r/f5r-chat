import { useState, useEffect } from 'react';
import Resource from '../../Resource';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import VoiceRecorder from '../VoiceRecording';
import styles from '../../styles/components/Modal/Voice.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModalVoice } from '../../store/features/modalSlice';
import { add, removeMessageToReply } from '../../store/features/messageSlice';
import {
  useUploadAudio,
  useSendMessage,
  useReplyMessage,
} from '../../api/useMessage';
import { useIncreseUnreadMessages } from '../../api/useChat';
import { BsFillStopCircleFill, BsRecordCircleFill } from 'react-icons/bs';
import { FaMicrophoneAlt } from 'react-icons/fa';
import moment from 'jalali-moment';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useQueryClient } from 'react-query';
import Player from '../Player';

let id;
const VoiceModal = () => {
  const queryClient = useQueryClient();
  const [blob, setBlob] = useState(null);
  const isOpen = useSelector((state) => state.modal.modalVoice);
  const chat = useSelector((state) => state.chat.currentChat);
  const socket = useSelector((state) => state.chat.socket);
  const user = useSelector((state) => state.auth.user);
  const messageToReply = useSelector((state) => state.message.messageToReply);
  const dispatch = useDispatch();

  const onStop = (url, data) => {
    console.log(data);
    setBlob(data);
  };

  const { status, clearBlobUrl, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true, onStop });

  const onUploadSuccess = (data) => {
    const info = {
      content: data,
      time: moment().format('HH:mm'),
      chatId: chat.id,
      type: 'audio',
    };
    if (messageToReply) {
      reply([info, messageToReply.id || messageToReply._id]);
    } else {
      send(info);
    }
  };

  const onSendSuccess = (data) => {
    dispatch(toggleModalVoice());

    socket?.emit('new message', data);
    socket?.on('message recieved', (recievedData) => {
      console.log('called sockeet');
      dispatch(add(recievedData));
    });
  };

  const onReplySuccess = (data) => {
    dispatch(toggleModalVoice());
    dispatch(removeMessageToReply());
    socket?.emit('new message', data);
    socket?.on('message recieved', (recievedData) => {
      console.log('called sockeet');
      dispatch(add(recievedData));
    });
  };

  const onIncreseUnreadMessagesSuccess = () => {
    queryClient.invalidateQueries('chats');
  };

  useEffect(() => {
    id = chat.id;
  }, [chat.id]);

  const { mutate: upload, isLoading: isLoadingUpload } =
    useUploadAudio(onUploadSuccess);
  const {
    mutate: send,
    isLoading: isLoadingSend,
    isIdle: isIdleSend,
  } = useSendMessage(onSendSuccess);
  const {
    mutate: reply,
    isLoading: isLoadingReply,
    isIdle: isIdleReply,
  } = useReplyMessage(onReplySuccess);

  const { mutate: increaseUnreadMessages } = useIncreseUnreadMessages(
    onIncreseUnreadMessagesSuccess
  );

  const disabled = isLoadingSend || isLoadingReply || isLoadingUpload;

  useEffect(() => {
    if ((!isLoadingSend && isIdleSend) || (!isLoadingReply && isIdleReply)) {
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
  }, [isLoadingSend, isLoadingReply]);

  const onClose = () => {
    dispatch(toggleModalVoice());
  };

  const accept = () => {
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('chat', chat.id);
    formData.append('user', user.username);
    console.log(formData);
    upload(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={{
        base: 'VoiceModal',
        afterOpen: 'VoiceModal__after-open',
        beforeClose: 'VoiceModal__before-close',
      }}
      overlayClassName={{
        base: 'VoiceOverlay',
        afterOpen: 'VoiceOverlay__after-open',
        beforeClose: 'VoiceOverlay__before-close',
      }}
    >
      <div className={styles.container}>
        {status === 'recording' ? (
          <VoiceRecorder />
        ) : status === 'idle' ? (
          <FaMicrophoneAlt size={55} color='#00B84A' />
        ) : (
          status === 'stopped' &&
          mediaBlobUrl && <Player mediaUrl={mediaBlobUrl} />
        )}
        {status !== 'stopped' && (
          <div className={styles.group}>
            <BsRecordCircleFill
              color='#00B84A'
              style={{ cursor: 'pointer' }}
              size={28}
              onClick={startRecording}
            />
            <BsFillStopCircleFill
              size={28}
              color='#00B84A'
              style={{ cursor: 'pointer' }}
              onClick={stopRecording}
            />
          </div>
        )}
        {status === 'stopped' && mediaBlobUrl && (
          <div className={styles.group}>
            <Button
              name='file'
              className='videoCallBtn'
              disabled={disabled}
              title={!disabled && 'انتشار'}
              icon={disabled && Resource.Gifs.BTN_LOADER}
              onClick={accept}
            />
            <Button
              className='endVideoCallBtn'
              title='حذف'
              onClick={clearBlobUrl}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VoiceModal;
