import { useEffect } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import styles from '../../styles/components/Modal/File.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { toggleModalFile } from '../../store/features/modalSlice';
import {
  removeFile,
  add,
  removeMessageToReply,
} from '../../store/features/messageSlice';
import {
  useUploadMessage,
  useUploadDocument,
  useSendMessage,
  useReplyMessage,
} from '../../api/useMessage';
import { useIncreseUnreadMessages } from '../../api/useChat';
import Resource from '../../Resource/index';
import { toast } from 'react-toastify';
import { CgFileDocument } from 'react-icons/cg';
import { useQueryClient } from 'react-query';

let id;
const FileModal = () => {
  const queryClient = useQueryClient();
  const isOpen = useSelector((state) => state.modal.modalFile);
  const chat = useSelector((state) => state.chat.currentChat);
  const file = useSelector((state) => state.message.file);
  const socket = useSelector((state) => state.chat.socket);
  const messageToReply = useSelector((state) => state.message.messageToReply);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const onUploadSuccess = (data) => {
    const info = {
      content: data,
      time: file.time,
      chatId: chat.id,
      type: file.type,
    };
    if (messageToReply) {
      reply([info, messageToReply.id || messageToReply._id]);
    } else {
      send(info);
    }
  };

  const onUploadDocumentSuccess = (data) => {
    const info = {
      content: data,
      time: file.time,
      chatId: chat.id,
      type: file.type,
    };
    if (messageToReply) {
      reply([info, messageToReply.id || messageToReply._id]);
    } else {
      send(info);
    }
  };

  const onSendSuccess = (data) => {
    toast.success('پیام با موفقیت منتقل شد');
    dispatch(toggleModalFile());
    socket?.emit('new message', data);
  };

  const onReplySuccess = (data) => {
    toast.success('پیام با موفقیت منتقل شد');
    dispatch(toggleModalFile());
    dispatch(removeMessageToReply());
    socket?.emit('new message', data);
  };

  const onIncreseUnreadMessagesSuccess = () => {
    queryClient.invalidateQueries('chats');
  };

  const { mutate: upload, isLoading: isLoadingUpload } =
    useUploadMessage(onUploadSuccess);
  const { mutate: uploadDocument, isLoading: isLoadingUploadDocument } =
    useUploadDocument(onUploadDocumentSuccess);
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

  const disabled =
    isLoadingSend ||
    isLoadingReply ||
    isLoadingUpload ||
    isLoadingUploadDocument;

  const onClose = () => {
    dispatch(toggleModalFile());
    dispatch(removeFile());
  };

  useEffect(() => {
    id = chat.id;
  }, [chat.id]);

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

  const accept = () => {
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('chat', chat.id);
    formData.append('user', user.username);
    if (file.type === 'file') upload(formData);
    else uploadDocument(formData);
  };

  const reject = () => {
    dispatch(removeFile());
    dispatch(toggleModalFile());
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={{
        base: 'FileModal',
        afterOpen: 'FileModal__after-open',
        beforeClose: 'FileModal__before-close',
      }}
      overlayClassName={{
        base: 'FileOverlay',
        afterOpen: 'FileOverlay__after-open',
        beforeClose: 'FileOverlay__before-close',
      }}
    >
      <div className={styles.container}>
        {file.type === 'file' ? (
          <img src={file.message} alt='file' />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginTop: 0, marginLeft: '5px' }}>
              {file.message}
            </span>
            <CgFileDocument size={30} color='var(--text-primary)' />
          </div>
        )}
        <div className={styles.group}>
          <Button
            disabled={disabled}
            className='AcceptBtn'
            title={!disabled && 'انتشار'}
            onClick={accept}
            icon={disabled && Resource.Gifs.BTN_LOADER}
          />
          <Button
            disabled={disabled}
            className='RejectBtn'
            title={'خروج'}
            onClick={reject}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FileModal;
