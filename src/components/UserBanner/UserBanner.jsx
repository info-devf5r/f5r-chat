import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "./UserBanner.scss";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";



function UserBanner({ user, status }) {

    let room = useParams().id;
    const [username, setUsername] = useState();


    const getUserName = (id) => {
        axios.get(`${process.env.REACT_APP_ROOM_URL}/${room}`).then((response) => {
            let users = response.data.users;
            for (let user of users) {
                if (user.userID === id) {
                    setUsername(user.username);
                }
            }
        }).catch((e) => console.log(e));
    }

    useEffect(() => {
        setTimeout(() => {
            getUserName(user);
        }, 600);
    }, [])

    return (
        <div className="banner__wrap">
            {status === "join" ? (
                <p className="banner">Wild {username} appeared!</p>
            ) : (
                <p className="banner">{user} fled!</p>
            )}
        </div>
    )
}

export default UserBanner;