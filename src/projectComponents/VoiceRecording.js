import Resource from '../Resource';

const VoiceRecording = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        style={{ width: '100px', height: '100px' }}
        src={Resource.Gifs.RECORDER}
        alt='recording...'
      />
    </div>
  );
};

export default VoiceRecording;
