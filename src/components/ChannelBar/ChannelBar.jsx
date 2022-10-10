import axios from "axios";
import Peer from "simple-peer";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ChannelUser from "../ChannelUser/ChannelUser";
import ChannelBarHead from "../ChannelBarHead/ChannelBarHead";
import Control from "../Control/Control";
import { setColor } from "../../reducers/userColor";
import { getColorByName } from "../../utils/utils";
import soundOnIcon from "../../assets/soundon.svg";
import soundOffIcon from "../../assets/soundoff.svg";
import { ICE_SERVERS } from "../../utils/mediaUtils";
import "./ChannelBar.scss";

function ChannelBar({ socket }) {

    let room = useParams().id;
    const user = useSelector((state) => state.user.value);
    const [voiceEnter, setVoiceEnter] = useState(false);

    const userAudio = useRef();
    const [peers, setPeers] = useState([]);
    const socketRef = useRef(socket);
    const peersRef = useRef([]);

    const newVoiceUser = () => {
        axios.put(`${process.env.REACT_APP_ROOM_URL}/${room}/user`, { username: user.username, userID: user.userID })
            .then((response) => {
                return;
            }).catch(e => console.log(e));
    }

    const enterVoice = () => {
        if (voiceEnter === true) return;
        setVoiceEnter(true);
        newVoiceUser();
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {
                userAudio.current.srcObject = stream;
                socketRef.current.emit("joinVoice", room);
                socketRef.current.on("allUsers", (users) => {
                    let peers = [];
                    users.forEach((user) => {
                        const peer = createPeer(user.userID, socketRef.current.id, stream);
                        peersRef.current.push({ peerID: user.userID, peer });
                        peers.push({ peerID: user.userID, peer });
                    })
                    setPeers(peers);
                })

                socketRef.current.on("voiceJoined", (payload) => {
                    const peer = addPeer(payload.signal, payload.caller, stream);
                    peersRef.current.push({ peerID: payload.caller, peer })
                    const peerObj = {
                        peerID: payload.caller,
                        peer
                    }
                    setPeers((users) => [...users, peerObj]);
                });

                socketRef.current.on("receiveSgn", (payload) => {
                    const sgn = peersRef.current.find((peer) => peer.peerID === payload.id);
                    sgn.peer.signal(payload.signal);
                });

                socketRef.current.on("disc", (userID) => {
                    const peerObj = peersRef.current.find(peer => peer.peerID === userID);
                    if (peerObj) {
                        peerObj.peer.destroy();
                    }
                    const peers = peersRef.current.filter(peer => peer.peerID !== userID);
                    peersRef.current = peers;
                    setPeers(peers);
                })

                socketRef.current.on("voiceConfig", (payload) => {
                    setVoiceConfig(payload);
                })
            })
    }

    const createPeer = (userToSignal, caller, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
            config: { iceServers: ICE_SERVERS }
        });

        peer.on("signal", (signal) => {
            socketRef.current.emit("sendSgn", { userToSignal, caller, signal })
        })

        return peer;
    }

    const addPeer = (incomingSignal, caller, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
            config: { iceServers: ICE_SERVERS }
        })

        peer.on("signal", (signal) => {
            socketRef.current.emit("returnSgn", { signal, caller })
        })
        peer.signal(incomingSignal);
        return peer;
    }

    const dispatch = useDispatch();
    const userColor = useSelector((state) => state.avatar.value);


    useEffect(() => {
        dispatch(setColor(getColorByName(user.username)));
    }, [user.username])

    const [selfVoice, setSelfVoice] = useState(true);
    const [voiceConfig, setVoiceConfig] = useState([]);

    const toggleVoice = () => {
        if (userAudio.current.srcObject) {
            userAudio.current.srcObject.getTracks().forEach((track) => {
                if (track.enabled) {
                    socketRef.current.emit("voiceConfig", [...voiceConfig, {
                        userID: socketRef.current.id,
                        selfVoice: false,
                    }]);
                    track.enabled = false;
                    setSelfVoice(false);
                } else {
                    socketRef.current.emit("voiceConfig", [...voiceConfig, {
                        userID: socketRef.current.id,
                        selfVoice: true,
                    }]);
                    track.enabled = true;
                    setSelfVoice(true);
                }
            });
        }
    }

    return (
        <div className="channel">
            <ChannelBarHead />
            <button className="channel__voice" onClick={enterVoice}> voice</button>
            {voiceEnter &&
                <div className="user">
                    <audio ref={userAudio} muted autoPlay />
                    <div className="user__avatar" style={{ "backgroundColor": `#${userColor}` }}></div>
                    <p className="user__name user__name--self">{user.username}</p>
                    <button className="user__status">
                        <img className="user__status--icon" src={selfVoice ? soundOnIcon : soundOffIcon} alt="sound" onClick={toggleVoice} />
                    </button>
                </div>
            }
            <div className="channel__users">
                {Array.from(new Set(peers.map((peer) => {
                    return (
                        <ChannelUser key={peer.peerID} peer={peer.peer} peerID={peer.peerID} />
                    )
                })))}
            </div>
            <Control toggleVoice={toggleVoice} selfVoice={selfVoice} />
        </div>
    )
}

export default ChannelBar;