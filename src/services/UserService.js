import axios from './BaseService';

export const register = async (newUser) => {
    const user = await axios.post('/users', newUser);
    return user;
};

export const login = async (username, password) => {
    const user = await axios.post('/auth/login', {username, password});
    return user;
};

export const logout = async () => {
    axios.get('/auth/logout');
};

export const getUsers = async () => {
    const users = await axios.get('/users');
    return users.data;
};

export const getUser = async (user_id) => {
    const user = await axios.get(`/users/${user_id}`);
    return user;
};