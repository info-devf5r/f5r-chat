import { useRef, useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import styles from '../../styles/components/Modal/VideoCall.module.css';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../components/Button';
import { toggleModalVideoCall } from '../../store/features/modalSlice';
import Peer from 'simple-peer';

const VideoCallModal = () => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [call, setCall] = useState({});

  const [stream, setStream] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const chat = useSelector((state) => state.chat.currentChat);
  const socket = useSelector((state) => state.chat.socket);
  const isOpen = useSelector((state) => state.modal.modalVideoCall);
  const dispatch = useDispatch();

  const myVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const connectionRef = useRef(null);

  const onClose = () => {
    dispatch(toggleModalVideoCall());
  };

  useEffect(() => {
    if (callRejected) {
      setTimeout(() => {
        setCallRejected(false);
      }, 5000);
    }
  }, [callRejected]);

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        myVideoRef.current.srcObject = stream;
        setStream(stream);
      } catch (err) {
        console.log(err);
      }
    };

    if (isOpen) {
      getUserMedia();

      socket.on('callUser', ({ from, name: callerName, signal }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
      });
    }
    // eslint-disable-next-line
  }, [isOpen]);

  const videoCallUser = () => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: chat.id,
        signalData: data,
        from: user.id,
        name: user.username,
      });
    });

    peer.on('stream', (currentStream) => {
      console.log('stream called');
      userVideoRef.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const endVideoCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();
  };

  const rejectCall = () => {
    setCallRejected(true);
    connectionRef.current.destroy();
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      console.log('answer call');
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      console.log('answer stream');
      userVideoRef.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={{
        base: 'VideoCallModal',
        afterOpen: 'VideoCallModal__after-open',
        beforeClose: 'VideoCallModal__before-close',
      }}
      overlayClassName={{
        base: 'VideoCallOverlay',
        afterOpen: 'VideoCallOverlay__after-open',
        beforeClose: 'VideoCallOverlay__before-close',
      }}
    >
      <div className={styles.container}>
        {myVideoRef && <video muted ref={myVideoRef} autoPlay />}
        {callAccepted && !callEnded && <video ref={userVideoRef} autoPlay />}
      </div>
      <div className={styles.buttons}>
        <Button title='تماس' className='videoCallBtn' onClick={videoCallUser} />

        <Button
          title='قطع تماس'
          className='endVideoCallBtn'
          onClick={endVideoCall}
        />
      </div>
      {call.from !== user.id && call.isReceivingCall && !callAccepted ? (
        <div className={styles.answerGroup}>
          <span className={styles.callStatement}>
            {call.name} در حال تماس است...
          </span>
          <Button
            className='answerCallBtn'
            title='پاسخ دادن'
            onClick={answerCall}
          />
          <Button
            className='answerCallBtn'
            title='رد تماس'
            onClick={rejectCall}
          />
        </div>
      ) : !callAccepted ? (
        <span className={styles.callStatement}>در حال تماس...</span>
      ) : callRejected ? (
        <span className={styles.callStatement}>تماس رد شد</span>
      ) : null}
    </Modal>
  );
};

export default VideoCallModal;
