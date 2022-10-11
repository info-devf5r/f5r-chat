import { useEffect, useState, useRef } from 'react';

import { FaPlay, FaPause } from 'react-icons/fa';

const Player = (props) => {
  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (secs < 10) {
      secs = '0' + secs;
    }

    return minutes + ':' + secs;
  }

  const audioPlayer = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const [isPlay, setIsPlay] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (audioPlayer.current.ended) {
      setIsPlay(false);
      setCurrentTime(0);
      audioPlayer.current.currentTime = 0;
    }
  });

  const play = () => {
    audioPlayer.current.play();
    setIsPlay(true);
  };

  const pause = () => {
    audioPlayer.current.pause();
    setIsPlay(false);
  };

  const setSpeed = (speed) => {
    audioPlayer.current.playbackRate = speed;
  };

  const onPlaying = () => {
    setCurrentTime(audioPlayer.current.currentTime);
    setSeekValue(
      (audioPlayer.current.currentTime / audioPlayer.current.duration) * 100
    );
  };

  return (
    <div className='sound-container'>
      <div className='sound'>
        <audio
          src={
            props.message
              ? `${process.env.REACT_APP_SOCKET_ROUTE}${props.message}`
              : props.mediaUrl
          }
          ref={audioPlayer}
          onTimeUpdate={onPlaying}
        >
          Your browser does not support the
          <code>audio</code> element.
        </audio>
        <br />
        <input
          type='range'
          style={{ direction: 'ltr' }}
          min='0'
          max='100'
          step='1'
          value={seekValue}
          onChange={(e) => {
            const seekto =
              audioPlayer.current.duration * (+e.target.value / 100);
            audioPlayer.current.currentTime = seekto;
            setSeekValue(e.target.value);
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '5px',
          }}
        >
          {isPlay ? (
            <FaPause
              color='var(--text-secondary)'
              onClick={pause}
              size={25}
              cursor='pointer'
            />
          ) : (
            <FaPlay
              color='var(--text-secondary)'
              onClick={play}
              size={25}
              cursor='pointer'
            />
          )}

          {/* <button onClick={() => setSpeed(0.5)}>0.5x</button>
          <button onClick={() => setSpeed(1)}>1x</button>
          <button onClick={() => setSpeed(1.5)}>1.5x</button>
          <button onClick={() => setSpeed(2)}>2x</button> */}
        </div>
      </div>
      <p
        style={{
          fontSize: '16px',
          marginRight: 'auto',
          color: 'var(--text-secondary)',
        }}
      >
        {`${formatTime(currentTime) || '00:00'} `}
      </p>
    </div>
  );
};

export default Player;
