import React, { useState } from "react";
import "./Control.scss";

function Control({ selfVoice, toggleVoice }) {

    const [sound, setSound] = useState(true);

    const toggleSound = () => {
        document.querySelectorAll(".user__audio").forEach((audio) => {
            if (sound === true) {
                setSound(false);
                audio.muted = true;
            } else {
                setSound(true);
                audio.muted = false;
            }
        })
    }

    return (
        <div className="control__wrap">
            <div className="control">
                <button onClick={toggleVoice} className={selfVoice ? "control__mic" : "control__mic--off"}></button>
                <button className={sound ? "control__headset" : "control__headset--off"} onClick={toggleSound}></button>
            </div>
        </div>
    )
}

export default Control;
