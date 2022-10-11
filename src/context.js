import axios from "axios";
import { createContext, useEffect, useState, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [closeAlert, setcloseAlert] = useState(false);

  const [notifications, setnotifications] = useState([]);

  const [selectedChat, setSelectedChat] = useState(null);

  //populating all current chats
  const [chats, setchats] = useState(null);

  const [serverMessage, setServerMessage] = useState({
    status: "success",
    message: "",
  });

  //whenever we add a new chat, we need to update the chats state
  const [fetchAgain, setFetchAgain] = useState(false);

  const [fetchLoading, setFetchLoading] = useState(true);

  const [user, setUser] = useState(null);

  const saveUser = (user) => {
    setUser(user);
  };

  const removeUser = () => {
    setUser(null);
  };

  const setMessage = (status, message) => {
    setcloseAlert(true);
    setServerMessage({
      status: status,
      message: message,
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/user/showCurrentUser");
        saveUser(data.data);
      } catch (error) {
        removeUser();
      }
      setFetchLoading(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    let timer = setTimeout(() => {
      setcloseAlert(false);
    }, 1000 * 10);
    return () => clearTimeout(timer);
  }, [closeAlert]);

  return (
    <AppContext.Provider
      value={{
        serverMessage,
        setServerMessage,
        closeAlert,
        fetchAgain,
        setFetchAgain,
        selectedChat,
        chats,
        notifications,
        setnotifications,
        setchats,
        setSelectedChat,
        fetchLoading,
        saveUser,
        removeUser,
        user,
        setMessage,
        setcloseAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
