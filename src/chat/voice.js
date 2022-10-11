import { useAlert } from 'react-alert'
import React, { useState } from 'react'
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'

export default function Voice({ sessionID }) {
  const [recordState, setRecordState] = useState()
  const alert = useAlert()

  const toggleRecording = () => {
    if (!recordState || recordState === RecordState.STOP) {
      setRecordState(RecordState.START)
    } else if (recordState === RecordState.START) {
      setRecordState(RecordState.STOP)
    }
  }

  const onStop = async (audioData) => {
    if (audioData.blob.size < 1048576) {//1 MB
      alert.show(`Processing your voice...`, { type: 'info', timeout: 5000 })
      try {
        const signedLambdaResponse = await fetch(`https://jm58k3wyo5.execute-api.us-east-1.amazonaws.com/default/moo-chat-signed-url-lambda?sessionID=${sessionID}`)
        const signedUrl = await signedLambdaResponse.text()
        await fetch(signedUrl, { method: `PUT`, body: audioData.blob })
      }
      catch (ex) {
        alert.show('Voice processing failed', { type: `error` })
        console.log(ex)
      }
    } else {
      alert.show('Recording is too long', { type: `error` })
    }
  }

  return (<div>
    <label onClick={toggleRecording}>
      <i className={`fas fa-microphone record-voice ${recordState === RecordState.START ? 'recording' : ''}`}></i>
    </label>
    <AudioReactRecorder state={recordState} onStop={onStop} />
  </div>)
}