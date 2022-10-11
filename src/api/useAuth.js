import { useMutation, useQuery } from 'react-query';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_ROUTE}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const uploadAvatar = async (file) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_ROUTE}/upload/avatar`,
    file,
    {
      headers: {
        'auth-token': localStorage.getItem('auth-token'),
      },
    }
  );
  return data;
};

const login = async (userData) => {
  const { data } = await axiosInstance.post(
    '/auth/login',
    JSON.stringify(userData)
  );
  axios.defaults.headers.common['auth-token'] = data.token;
  localStorage.setItem('auth-token', data.token);
  return data;
};

const register = async (userData) => {
  const { data } = await axiosInstance.post(
    '/auth/register',
    JSON.stringify(userData)
  );
  axios.defaults.headers.common['auth-token'] = data.token;
  localStorage.setItem('auth-token', data.token);
  return data;
};

const getUser = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_ROUTE}/auth/user`,
    {
      headers: {
        'auth-token': localStorage.getItem('auth-token'),
      },
    }
  );
  axios.defaults.headers.common['auth-token'] = data.token;
  return data;
};

export function useUploadAvatar(onSuccess, onError) {
  return useMutation(uploadAvatar, {
    onSuccess,
    onError,
  });
}

export function useLogin(onSuccess, onError) {
  return useMutation(login, {
    onSuccess,
    onError,
  });
}

export function useRegister(onSuccess, onError) {
  return useMutation(register, {
    onSuccess,
    onError,
  });
}

export function useUser(onSuccess, onError) {
  return useQuery('user', getUser, {
    onSuccess,
    onError,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
