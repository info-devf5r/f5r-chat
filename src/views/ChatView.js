import Comment from '../components/Comment';
import InputBar from '../components/InputBar';
import { Box, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getComments, postComment } from '../services/CommentService';
import { useParams } from "react-router-dom";
import { useAuth } from '../auth/AuthProvider';
import socket from '../services/Sockets';

function ChatView(props) {
    const [comments, setComments] = useState([]);
    let auth = useAuth();
    let params = useParams();

    useEffect(() => {
        getComments(params.channelId).then(comments => {setComments(comments)});
        socket.emit('join-room', params.channelId);
        return () => {
            socket.emit('leave-room', params.channelId);
        };
    }, []);

    useEffect(() => {
        socket.on('message', (message) => setComments([...comments, message]));
        return () => {
            socket.off('message');
        }
    }, [comments]);

    async function handleMessageChange(message) {
        let newMessage = await postComment({channel: params.channelId, sender: auth.user._id, text: message});
        socket.emit('send-message', newMessage);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
            <Container sx={{ flexGrow: 1 }}>
                {
                    comments.map(comment => (
                        <Comment key={comment._id} message={comment} inbound={auth.user._id !== comment.sender._id} />
                    ))
                }
            </Container>
            <InputBar handleMessageChange={ handleMessageChange } />
        </Box>
    )
}

export default ChatView;