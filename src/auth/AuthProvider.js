import React, { useState, createContext, useEffect } from 'react';
import { login, logout } from '../services/UserService';
import { useNavigate } from 'react-router-dom';

let AuthContext = createContext(null);

export function AuthProvider(props) {
    let [user, setUser] = useState(localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')): null);
    let navigate = useNavigate();

    let signin = async (username, password) => {
        const authenticated_user = await login(username, password);
        setUser(authenticated_user.data);
        localStorage.setItem('user', JSON.stringify(authenticated_user.data));
        navigate('../channels', { replace: true });
    };

    let signout = async () => {
        await logout();
        localStorage.removeItem('user');
        setUser(null);
    };

    let addChannel = (channel) => {
        setUser(user => ({...user, channels: [...user.channels, channel]}));
    }

    let leaveChannel = (channelId) => {
        setUser(user => ({...user, channels: user.channels.filter(channel => channel._id !== channelId)}));
    }

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    let value = { user, signin, signout, addChannel, leaveChannel };

    return <AuthContext.Provider value={value}> {props.children} </AuthContext.Provider>;
}

export function useAuth() {
    return React.useContext(AuthContext);
}