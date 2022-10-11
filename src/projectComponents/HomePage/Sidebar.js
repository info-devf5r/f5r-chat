import { useState } from 'react';
import Input from '../../components/Input';
import Profile from './Profile';
import ChatUser from './ChatUser';
import Resource from '../../Resource';
import styles from '../../styles/components/HomePage/Sidebar.module.css';
import { useGetAllChats } from '../../api/useChat';
import moment from 'jalali-moment';
import Loader from '../Loader';
import { useSelector } from 'react-redux';
import useWindowSize from '../../hooks/useWindowSize';
import { toggleSidebarOpen } from '../../store/features/drawerSlice';
import { useDispatch } from 'react-redux';

const Sidebar = () => {
  const [filter, setFilter] = useState();
  const { data, isLoading } = useGetAllChats();
  const user = useSelector((state) => state.auth.user);
  const onlineUsers = useSelector((state) => state.user.onlineUsers);
  const sidebarOpen = useSelector((state) => state.drawer.sidebarOpen);
  const { width } = useWindowSize();
  const dispatch = useDispatch();

  return (
    <>
      <div
        className={styles.container}
        style={{
          zIndex: '100',
          transition: 'all .5s ease',
          transform: `${
            width < 900 && sidebarOpen
              ? 'translateX(0)'
              : width < 900 && !sidebarOpen
              ? 'translateX(400px)'
              : width > 900 && 'translateX(0)'
          }`,
        }}
      >
        <Profile
          username='ارشیا'
          profileImg='https://cdn3.iconfinder.com/data/icons/generic-avatars/128/avatar_portrait_man_male_5-128.png'
        />
        <Input
          fieldClassName={'SearchUserField'}
          className={'SearchUserInput'}
          name={'search'}
          type={'text'}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          icon={Resource.Svg.SEARCH2}
          placeholder={'جستجو کاربر یا گروه...'}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <div className={styles.chatlist}>
            {filter
              ? data &&
                data
                  .filter((chat) =>
                    chat.isGroupChat
                      ? chat.chatName.includes(filter)
                      : chat.users[0].username.includes(filter)
                  )
                  .map((chat) => {
                    return (
                      <ChatUser
                        key={chat?._id}
                        id={chat?._id}
                        users={chat.isGroupChat && chat?.users}
                        isOnline={
                          !chat.isGroupChat &&
                          onlineUsers.some(
                            (data) => data.id === chat?.users?.[0]?._id
                          )
                        }
                        img={
                          chat.isGroupChat
                            ? 'https://cdn3.iconfinder.com/data/icons/generic-avatars/128/avatar_portrait_man_male_5-128.png'
                            : chat?.users[0].avatar
                            ? `${process.env.REACT_APP_SOCKET_ROUTE}${chat?.users[0].avatar}`
                            : 'https://cdn3.iconfinder.com/data/icons/generic-avatars/128/avatar_portrait_man_male_5-128.png'
                        }
                        username={
                          chat?.isGroupChat
                            ? chat?.chatName
                            : chat?.users[0].username
                        }
                        lastMsg={
                          chat?.latestMessage?.type === 'text'
                            ? chat?.latestMessage?.content
                            : chat?.latestMessage?.type === 'file' ||
                              chat?.latestMessage?.type === 'document'
                            ? 'محتوای فایلی'
                            : chat?.latestMessage?.type === 'audio'
                            ? 'محتوای صوتی'
                            : ''
                        }
                        time={
                          chat?.latestMessage?.createdAt &&
                          moment(chat?.latestMessage?.createdAt).format(
                            'jYYYY/jMM/jDD'
                          )
                        }
                        unreadMessages={chat?.unreadMessages.filter(
                          (message, index, array) =>
                            message.sender !== user.id &&
                            array.indexOf(message) === index
                        )}
                        isGroupChat={chat?.isGroupChat}
                        groupAdmin={chat?.groupAdmin}
                      />
                    );
                  })
              : data &&
                data.map((chat) => {
                  return (
                    <ChatUser
                      key={chat?._id}
                      id={chat?._id}
                      users={chat.isGroupChat && chat?.users}
                      isOnline={
                        !chat.isGroupChat &&
                        onlineUsers.some(
                          (data) => data.id === chat?.users?.[0]?._id
                        )
                      }
                      img={
                        chat.isGroupChat
                          ? 'https://cdn3.iconfinder.com/data/icons/generic-avatars/128/avatar_portrait_man_male_5-128.png'
                          : chat?.users[0].avatar
                          ? `${process.env.REACT_APP_SOCKET_ROUTE}${chat?.users[0].avatar}`
                          : 'https://cdn3.iconfinder.com/data/icons/generic-avatars/128/avatar_portrait_man_male_5-128.png'
                      }
                      username={
                        chat?.isGroupChat
                          ? chat?.chatName
                          : chat?.users[0].username
                      }
                      lastMsg={
                        chat?.latestMessage?.type === 'text'
                          ? chat?.latestMessage?.content
                          : chat?.latestMessage?.type === 'file' ||
                            chat?.latestMessage?.type === 'document'
                          ? 'محتوای فایلی'
                          : chat?.latestMessage?.type === 'audio'
                          ? 'محتوای صوتی'
                          : ''
                      }
                      time={
                        chat?.latestMessage?.createdAt &&
                        moment(chat?.latestMessage?.createdAt).format(
                          'jYYYY/jMM/jDD'
                        )
                      }
                      unreadMessages={chat?.unreadMessages.filter(
                        (message, index, array) =>
                          message.sender !== user.id &&
                          array.indexOf(message) === index
                      )}
                      isGroupChat={chat?.isGroupChat}
                      groupAdmin={chat?.groupAdmin}
                    />
                  );
                })}
          </div>
        )}
      </div>
      {width < 900 && sidebarOpen && (
        <div
          onClick={() => dispatch(toggleSidebarOpen())}
          style={{
            background: 'rgba(0,0,0,.3)',
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            zIndex: '1',
          }}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
