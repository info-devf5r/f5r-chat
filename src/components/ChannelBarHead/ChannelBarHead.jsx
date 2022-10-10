import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useState } from "react";
import { useSelector } from "react-redux";

function ChannelBarHead() {
    const user = useSelector((state) => state.user.value);
    const [clicked, setClicked] = useState(false);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setClicked(true);
            setTimeout(() => {
                setClicked(false);
            }, 1000);
        });
    }

    return (
        <div className="channel__head">
            <p className="channel__welcome">👋 {user.username}</p>
            {clicked ?
                (<OverlayTrigger trigger="hover"
                    placement="bottom"
                    overlay={
                        <Tooltip id={"tooltip-bottom"} className="channel__share--tooltip" >
                            copied
                        </Tooltip>
                    }
                >
                    <button className="channel__share" onClick={copyLink}></button>
                </OverlayTrigger>)
                :
                (<OverlayTrigger trigger={["hover", "focus"]}
                    placement="bottom"
                    overlay={
                        <Tooltip id="tooltip-bottom" className="channel__share--tooltip">
                            share link
                        </Tooltip>
                    }
                >
                    <button className="channel__share" onClick={copyLink}></button>
                </OverlayTrigger>)
            }
        </div>
    )
}

export default ChannelBarHead;