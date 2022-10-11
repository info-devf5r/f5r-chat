import { useMutation, useQuery } from 'react-query';
import axios from 'axios';

const searchUser = async (query) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_ROUTE}/user/search?search=${query}`,
    {
      headers: {
        'auth-token': localStorage.getItem('auth-token'),
      },
    }
  );
  return data;
};

const updateUser = async ([id, userData]) => {
  const { data } = await axios.put(
    `${process.env.REACT_APP_API_ROUTE}/user/update/${id}`,
    JSON.stringify(userData),
    {
      headers: {
        'auth-token': localStorage.getItem('auth-token'),
        'Content-Type': 'application/json',
      },
    }
  );
  return data;
};

const changePassword = async ([id, userData]) => {
  const { data } = await axios.put(
    `${process.env.REACT_APP_API_ROUTE}/user/update/password/${id}`,
    JSON.stringify(userData),
    {
      headers: {
        'auth-token': localStorage.getItem('auth-token'),
        'Content-Type': 'application/json',
      },
    }
  );
  return data;
};

const updateAvatar = async ([id, userData]) => {
  const { data } = await axios.put(
    `${process.env.REACT_APP_API_ROUTE}/user/update/avatar/${id}`,
    userData,
    {
      headers: {
        'auth-token': localStorage.getItem('auth-token'),
      },
    }
  );
  return data;
};

export function useSearchUsers(query, onSuccess, onError) {
  return useQuery(['search', query], () => searchUser(query), {
    onSuccess,
    onError,
    retry: false,
    enabled: false,
    refetchOnMount: false,
  });
}

export function useUpdateUser(onSuccess, onError) {
  return useMutation(updateUser, {
    onSuccess,
    onError,
  });
}

export function useUpdateUserAvatar(onSuccess, onError) {
  return useMutation(updateAvatar, {
    onSuccess,
    onError,
  });
}

export function useChangePassword(onSuccess, onError) {
  return useMutation(changePassword, {
    onSuccess,
    onError,
  });
}
