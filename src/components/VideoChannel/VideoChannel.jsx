import React, { useEffect } from "react";
import About from "../About/About";
import "./VideoChannel.scss";


function VideoChannel({ userVideo }) {


    return (
        <div className="video">
            <div className="text__head">
                <p className="text__title">Video channel</p>
                <About />
            </div>
            <div className="video__section">
                <video src={userVideo} muted playsInline autoPlay className="video__frame" />
                {/* {peersVid.map((peer) => {
                    return (
                        <video key={peer.peerID} src={peer.peer} className="video__frame" ></video>)
                })} */}
            </div>
        </div >
    )
}

export default VideoChannel;