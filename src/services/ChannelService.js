import axios from './BaseService';

export const getChannels = async () => {
    let channels = await axios.get('/channels');
    return channels.data;
}

export const addChannel = async (channelInfo, admin) => {
    let newChannel = await axios.post('/channels', {...channelInfo, admin} );
    return newChannel.data;
}

export const addMember = async (channelId, newMemberId) => {
    let newMember = await axios.post(`/channels/${channelId}`, {params: {user: newMemberId}});
    return newMember.data;
}

export const leaveChannel = async (channelId) => {
    await axios.post(`/channels/${channelId}/leave`);
}

export const deleteChannel = async (channelId) => {
    await axios.delete(`/channels/${channelId}`);
}