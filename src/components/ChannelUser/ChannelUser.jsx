import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getColorByName } from "../../utils/utils";
import { useSelector } from "react-redux";
import "./ChannelUser.scss";


function ChannelUser({ peer, peerID }) {
    let room = useParams().id;

    const ref = useRef();
    const [username, setUsername] = useState("anonymous")
    const [userColor, setUserColor] = useState("3dsfxc");

    const getUserName = (peerID) => {
        axios.get(`${process.env.REACT_APP_ROOM_URL}/${room}`).then((response) => {
            let users = response.data.voiceUsers;
            for (let user of users) {
                if (user.userID === peerID) {
                    setUsername(user.username);
                }
            }
        }).catch((e) => console.log(e));
    }

    useEffect(() => {
        getUserName(peerID);
        peer.on("stream", (stream) => {
            ref.current.srcObject = stream;
        })
    }, []);

    useEffect(() => {
        setUserColor(getColorByName(username));
    }, [username])

    return (
        <div className="user">
            <audio ref={ref} autoPlay className="user__audio" />
            <div className="user__avatar" style={{ "backgroundColor": `#${userColor}` }}></div>
            <p className="user__name">{username}</p>
            <button className="user__status">
            </button>
        </div>
    )
}

export default ChannelUser;