import axios from './BaseService';

export const getComments = async (channelId) => {
    let comments = await axios.get('/comments', {params: {channel: channelId}});
    return comments.data;
};

export const postComment = async (comment) => {
    let newComment = await axios.post('/comments', comment);
    return newComment.data;
}

export const deleteComment = async (commentId) => {
    await axios.delete(`/comments/${commentId}`);
}