import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const uploadFile = async (file) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_ROUTE}/upload/message`,
    file,
    {
      headers: {
        'auth-token': localStorage.getItem('auth-token'),
      },
    }
  );
  return data;
};

const uploadAudio = async (audioBlob) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_ROUTE}/upload/audio`,
    audioBlob,
    {
      headers: {
        'auth-token': localStorage.getItem('auth-token'),
      },
    }
  );
  return data;
};

const uploadDocument = async (document) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_ROUTE}/upload/document`,
    document,
    {
      headers: {
        'auth-token': localStorage.getItem('auth-token'),
      },
    }
  );
  return data;
};

const downloadDocument = async (file) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_ROUTE}/download`,
    JSON.stringify(file),
    {
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token'),
      },
    }
  );
  return data;
};

const getChatMessages = async (id) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_ROUTE}/message/messages/${id}`,
    {
      headers: {
        'auth-token': localStorage.getItem('auth-token'),
      },
    }
  );
  return data;
};

const sendMessage = async (messageData) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_ROUTE}/message/send`,
    JSON.stringify(messageData),
    {
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token'),
      },
    }
  );
  return data;
};

const reply = async ([messageData, messageId]) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_ROUTE}/message/reply/${messageId}`,
    JSON.stringify(messageData),
    {
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token'),
      },
    }
  );
  return data;
};

export function useGetChatMessages(id, onSuccess, onError) {
  return useQuery(['messages', id], () => getChatMessages(id), {
    onSuccess,
    onError,
    retry: false,
    enabled: false,
  });
}

export function useSendMessage(onSuccess, onError) {
  return useMutation(sendMessage, {
    onSuccess,
    onError,
  });
}

export function useReplyMessage(onSuccess, onError) {
  return useMutation(reply, {
    onSuccess,
    onError,
  });
}

export function useUploadMessage(onSuccess, onError) {
  return useMutation(uploadFile, {
    onSuccess,
    onError,
  });
}

export function useDownloadDocument(onSuccess, onError) {
  return useMutation(downloadDocument, {
    onSuccess,
    onError,
  });
}

export function useUploadAudio(onSuccess, onError) {
  return useMutation(uploadAudio, {
    onSuccess,
    onError,
  });
}

export function useUploadDocument(onSuccess, onError) {
  return useMutation(uploadDocument, {
    onSuccess,
    onError,
  });
}
