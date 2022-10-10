import axios from "axios";
import { useEffect, useState } from "react";
import { getColorByName } from "../../utils/utils";
import "./ChatMessage.scss";

function ChatMessage({ message, user, time }) {

    const [userColor, setUserColor] = useState("");

    useEffect(() => {
        setUserColor(getColorByName(user));
    }, [])

    return (
        <div className="message">
            <div className="message__avatar" style={{ "backgroundColor": `#${userColor}` }}></div>
            <div className="message__content">
                <div className="message__content--top">
                    <p className="message__by">{user}</p>
                    <p className="message__time">{time}</p>
                    {/* <button>delete message</button> */}
                </div>
                <p className="message__content--bottom">{message}</p>
            </div>
        </div>
    )
}

export default ChatMessage;