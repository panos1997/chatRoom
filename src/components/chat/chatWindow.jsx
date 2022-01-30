import React, { useEffect, useState } from 'react';
import OnlineStateIcon from '../customIcons/onlineStateIcon';
import { GlobalUtilities } from '../../Utilities/globalUtilities';
import PeopleIcon from '@material-ui/icons/People';
import MenuWithOptions from '../menus/menuWithOptions';
import {useDispatch, useSelector} from 'react-redux';
import MessagesList from './messagesList';
import TypeAndSendMessage from './typeAndSendMessage';
import Tooltip from '@material-ui/core/Tooltip';
import ButtonComponent from '../buttons/buttonComponent';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import SettingsIcon from '@material-ui/icons/Settings';
// import { CirclePicker } from 'react-color';
// import ChatOptions from './chatOptions'; 

let mounted = false;

const ChatWindow = ({setUserLoggedIn, chatUser, chatRoom, socket}) => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');   

    // store vars
    const dispatch = useDispatch();
    const globalBannerStore = useSelector(state => state.globalBanner);
    const chatStore = useSelector(state => state.chat);

    useEffect(() => {
        mounted = true;
        return () => mounted = false;
    }, []);

    useEffect(() => {
        if(!mounted) return;
        socket.on('receive_message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
            GlobalUtilities.chatUtilities.scrollDownToLatestMessage('chatWindow-body');
        });
        socket.on('receive_all_messages', allMessages => {
            setMessages(allMessages);
        });
        socket.on('someone_joined_or_left', allUsers => {
            dispatch({type: 'chat/setChatAllUsers', payload: allUsers});
        });
    // eslint-disable-next-line   
    }, [socket]);

    useEffect(() => {
        document.addEventListener("keydown", (e) => GlobalUtilities.globalBannerUtilities.closeBannerOnEscapeKey(e, globalBannerStore.bannerShow, dispatch));
        return () => document.removeEventListener("keydown", (e) => GlobalUtilities.globalBannerUtilities.closeBannerOnEscapeKey(e, globalBannerStore.bannerShow, dispatch));
    // eslint-disable-next-line
    }, [globalBannerStore.bannerShow]);

    return( 
        <div className='chatWindowWrapper'>
            {/* <ChatOptions
                socket={socket}
                chatUser={chatUser}
                chatRoom={chatRoom}
                setUserLoggedIn={setUserLoggedIn}
            /> */}
            <div className='chatWindow flex-col'>
                <div className='chatWindow-header flex-center-justify-between-row'>
                    <div className='flex-center-row'>
                        <OnlineStateIcon 
                            active={true} 
                            className='margin-b-1'
                        />
                        <div className='margin-l-10'>
                            {chatRoom.name}
                            <span className='chatWindow-header-participantsInfo margin-l-5'>
                                (
                                    <span 
                                        className='participants' 
                                        onClick={() => GlobalUtilities.chatUtilities.showParticipantsBanner(dispatch, chatRoom.name)}>
                                            {chatStore.chatAllUsers?.length === 0 || chatStore.chatAllUsers?.length === 1 
                                                ? `1 person` 
                                                : `${chatStore.chatAllUsers?.length} people`
                                            } 
                                    </span> in the room)
                            </span>
                        </div>
                    </div>
                    <div className='flex-center-row'>
                        <Tooltip title='Exit chat' placement='top-start'>
                            <div className='margin-l-5'>
                                <ButtonComponent 
                                    btnContent={
                                        <div className='flex-center-row'>
                                            <ExitToAppIcon/>
                                        </div>
                                    }
                                    btnProps={{
                                        className: 'globalButton normalButton margin-b-5 margin-r-5',
                                        onClick: () => GlobalUtilities.chatUtilities.logoutFromChat(dispatch, socket, chatUser, chatRoom, setUserLoggedIn)
                                    }}
                                />
                            </div>
                        </Tooltip>
                        <Tooltip title='Delete all messages. The messages will be deleted for everyone in the chat.' placement='top-start' width={50}>
                            <div className='margin-l-5'>
                                <ButtonComponent 
                                    btnContent={
                                        <div className='flex-center-row'>
                                            <DeleteIcon/>
                                        </div>
                                    }
                                    btnProps={{
                                        className: 'globalButton deleteButton margin-b-5',
                                        onClick: () => GlobalUtilities.globalBannerUtilities.showClearChatBanner(dispatch, socket, chatRoom)
                                    }}
                                />
                            </div>
                        </Tooltip>
                        <MenuWithOptions
                            options={[
                                {
                                    icon: <PeopleIcon/>, 
                                    text: 'Participants', 
                                    clickHandler: () => GlobalUtilities.chatUtilities.showParticipantsBanner(dispatch, chatRoom.name)
                                },
                                // {
                                //     icon: <SettingsIcon/>, 
                                //     text: 'Settings', 
                                //     clickHandler: () => {}
                                // }
                            ]}
                        />
                    </div>
                </div>
                
                <MessagesList
                    socket={socket}
                    messages={messages}
                    chatUser={chatUser}
                    chatRoom={chatRoom}
                />
                
                <TypeAndSendMessage
                    chatUser={chatUser}
                    chatRoom={chatRoom}
                    currentMessage={currentMessage}
                    setCurrentMessage={setCurrentMessage}
                    setMessages={setMessages}
                    socket={socket}
                />
            </div>
        </div>
    )
}

export default ChatWindow;