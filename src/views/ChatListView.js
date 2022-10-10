import React, { useEffect, useState } from 'react';
import { List, ListItem, Divider, ListItemText, ListItemAvatar, Typography, Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ChannelForm from '../components/ChannelForm';
import { useAuth } from '../auth/AuthProvider';
import * as ChannelService from '../services/ChannelService';
import socket from '../services/Sockets';

function ChatListView(props) {
    const auth = useAuth();

    async function addChannel(channelInfo) {
        await ChannelService.addChannel(channelInfo, auth.user._id);
    }

    async function leaveChannel(channel) {
        await ChannelService.leaveChannel(channel);
        auth.leaveChannel(channel);
    }

    useEffect(() => {
        socket.emit('join-room', auth.user._id);
        return () => {
            socket.off('leave-room', auth.user._id);
        }
    }, []);

    useEffect(() => {
        socket.on('add-channel', (channel) => { auth.addChannel(channel) });
        return () => {
            socket.off('add-channel');
        }
    }, []);

    return (
        <div>
            <ChannelForm addChannel={addChannel} />
            <List sx={{ width: 360, maxWidth: 360, bgcolor: 'background.paper' }}>
                {auth.user.channels.map(channel => 
                        (<ListItem key={channel._id} alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt="Participant Name" src="defaultprofileimage.png" />
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Link to={channel._id}>{channel.name || 'Unnamed Group Chat'}</Link>}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Participants:&nbsp;
                                        </Typography>
                                        {channel.participants.map(member=>member.username).join(", ")}
                                        <Button onClick={() => leaveChannel(channel._id)}>Leave Channel</Button>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>)
                )}
            </List>
        </div>
    )
}

export default ChatListView;