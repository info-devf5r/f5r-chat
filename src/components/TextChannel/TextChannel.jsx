import ChatMessage from "../ChatMessage/ChatMessage";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import About from "../About/About";
import UserBanner from "../UserBanner/UserBanner";
import "./TextChannel.scss"
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";


function TextChannel({ socket }) {
    let room = useParams().id;
    const [messageHistory, setMessageHistory] = useState([]);
    const user = useSelector((state) => state.user.value);


    const getMsgs = () => {
        axios.get(`${process.env.REACT_APP_ROOM_URL}/${room}`).then(response => {
            const msgs = response.data.messageHistory;
            setMessageHistory(msgs);
        }).catch(e => console.log(e));
    }

    const postMsg = (msg) => {
        axios.post(`${process.env.REACT_APP_ROOM_URL}/${room}`, msg).then(() => {
            return;
        }).catch(e => console.log(e));
    }

    const emitMsg = async (msg) => {
        socket.emit("sendMsg", { msg, room });
    }

    const sendMsg = async (e) => {
        e.target.content.classList.remove("text__input--invalid");
        e.preventDefault();
        let message = e.target.content.value;
        if (!message || message.trim() === "") {
            e.target.content.classList.add("text__input--invalid");
            return;
        }

        let now = new Date(Date.now());
        let minute = now.getMinutes();
        if (minute < 10) {
            minute = "0" + minute;
        }
        let hour = now.getHours();
        if (hour < 10) {
            hour = "0" + hour;
        }

        let msg = {
            message: message,
            username: user.username,
            time: `${hour}:${minute}`
        }

        await emitMsg(msg);
        setMessageHistory([...messageHistory, msg]);
        postMsg(msg);
        e.target.reset();
    }

    const receiveMsg = () => {
        socket.on("receiveMsg", (data) => {
            setMessageHistory((messageHistory) => [...messageHistory, data]);
        })
    }

    useEffect(() => {
        receiveMsg();
    }, [socket])

    useEffect(() => {
        getMsgs();
    }, [])

    const messagesEndRef = useRef();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom()
    }, [messageHistory]);

    const newJoin = () => {
        socket.on("newJoin", (data) => {
            let msg = {
                status: "join",
                user: data
            }
            setMessageHistory((messageHistory) => [...messageHistory, msg]);
        })
    }

    useEffect(() => {
        newJoin();
    }, [socket])

    return (
        <div className="text">
            <div className="text__head">
                <p className="text__title">Text channel</p>
                <About />
            </div>
            <div className="text__messages">
                {messageHistory.map((msg) => {
                    if ("status" in msg) {
                        return <UserBanner key={msg.user} user={msg.user} status={msg.status} />
                    } else {
                        return <ChatMessage key={msg.messageID} message={msg.message} user={msg.username} time={msg.time} />
                    }
                })}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMsg} className="text__input">
                <label htmlFor="content">
                    <input name="content" className="text__input--box" autoComplete="off" />
                </label>
            </form>
        </div >
    )
}

export default TextChannel;