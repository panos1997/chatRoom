import React, { useEffect, useState } from 'react';
import OnlineStateIcon from './customIcons/onlineStateIcon';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import ButtonComponent from './buttons/buttonComponent';
import { GlobalUtilities } from '../Utilities/globalUtilities';
import Tooltip from '@material-ui/core/Tooltip';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuWithOptions from './menus/menuWithOptions';
import {useDispatch, useSelector} from 'react-redux';
import { Avatar } from '@material-ui/core';
import { CirclePicker } from 'react-color';

const ChatWindow = ({setUserLoggedIn, chatUser, chatRoom, socket}) => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');   

    // store vars
    const dispatch = useDispatch();
    const globalBannerStore = useSelector(state => state.globalBanner);
    const chatStore = useSelector(state => state.chat);

    useEffect(() => {
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
    }, [socket]);

    useEffect(() => {
        document.addEventListener("keydown", (e) => GlobalUtilities.globalBannerUtilities.closeBannerOnEscapeKey(e, globalBannerStore.bannerShow, dispatch));
        return () => document.removeEventListener("keydown", (e) => GlobalUtilities.globalBannerUtilities.closeBannerOnEscapeKey(e, globalBannerStore.bannerShow, dispatch));
    // eslint-disable-next-line
    }, [globalBannerStore.bannerShow]);

    return( 
        <div className='chatWindowWrapper'>
            <div className='flex-center-end'>
                <Tooltip title='Exit chat' placement='top-start'>
                    <div>
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
                <Tooltip title='Delete all messages. The messages will be deleted only for you.' placement='top-start' width={50}>
                    <div>
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
            </div>
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
                    <MenuWithOptions
                        options={[
                            {
                                icon: <PeopleIcon/>, 
                                text: 'Participants', 
                                clickHandler: () => GlobalUtilities.chatUtilities.showParticipantsBanner(dispatch, chatRoom.name)
                            },
                            {
                                icon: <SettingsIcon/>, 
                                text: 'Settings', 
                                clickHandler: () => GlobalUtilities.chatUtilities.showParticipantsBanner(dispatch, chatRoom.name)
                            }
                        ]}
                    />
                </div>
                <div className='chatWindow-body flex-center-col margin-t-10'>
                    {
                        messages.map((messageItem, index) => {
                            return (
                                <div key={index} className={`chatWindow-body-message flex-col margin-t-5 ${messageItem.author.name === chatUser.name ? 'myMessage' : 'foreignMessage'}`}>
                                    <div className='flex-row margin-r-15 margin-l-15'>
                                        {
                                            messageItem.author.name === chatUser.name 
                                            && <Tooltip title={messageItem.author.name} placement='left'>
                                                    <Avatar className='margin-r-15' style={{backgroundColor: messageItem.author.avatarColor}}>
                                                        {messageItem.author.name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                </Tooltip>
                                        }
                                        <div>
                                            <div className='messageContent'> 
                                                <Tooltip title={messageItem.fullTime} placement='left'>
                                                    <div>
                                                        {messageItem.message}
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            <div className={`messageDate margin-t-2 margin-b-5`}>
                                                {messageItem.shortTime}
                                            </div>
                                        </div>
                                        {
                                            messageItem.author.name !== chatUser.name 
                                            && <Tooltip title={messageItem.author.name} placement='right'>
                                                    <Avatar className='margin-l-15' style={{backgroundColor: messageItem.author.avatarColor}}>
                                                        {messageItem.author.name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                </Tooltip>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='chatWindow-footer'>
                    <TextareaAutosize
                        id='messageBox' 
                        placeholder='type something'
                        className='chatWindow-footer-textarea margin-l-10 margin-b-15 margin-t-47'
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        maxLength={1000}
                        onKeyUp={(e) => GlobalUtilities.chatUtilities.pressEnterOnKeyboard(e, [() => GlobalUtilities.chatUtilities.sendMessage(socket, currentMessage, setCurrentMessage, setMessages, chatRoom, chatUser)])}
                        onKeyDown={GlobalUtilities.chatUtilities.pressEnterOnKeyboard}
                    />
                    <ButtonComponent 
                        btnContent='Send'
                        btnProps={{
                            className: 'chatButton sendMessage',
                            onClick: () => GlobalUtilities.chatUtilities.sendMessage(socket, currentMessage, setCurrentMessage, setMessages, chatRoom, chatUser)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ChatWindow;