import React, { useEffect, useState } from 'react';
import OnlineStateIcon from './customIcons/onlineStateIcon';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import ButtonComponent from './buttons/buttonComponent';
import { GlobalUtilities } from '../Utilities/globalUtilities';
import Tooltip from '@material-ui/core/Tooltip';
import PeopleIcon from '@material-ui/icons/People';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuWithOptions from './menus/menuWithOptions';
import {useDispatch, useSelector} from 'react-redux';

const ChatWindow = ({setUserLoggedIn, chatUser, chatRoom, socket}) => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');   

    // store vars
    const dispatch = useDispatch();
    const globalBannerStore = useSelector(state => state.globalBanner);

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
            GlobalUtilities.chatUtilities.scrollDownToLatestMessage('chatWindow-body');
        });
        socket.on('receive_all_messages', allMessages => {
            setMessages(allMessages);
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
                        <p className='margin-l-10'> 
                            Live Chat Room
                        </p>
                    </div>
                    <MenuWithOptions
                        options={[
                            {
                                icon: <PeopleIcon/>, 
                                text: 'Participants', 
                                clickHandler: () => {}
                            }
                        ]}
                    />
                </div>
                <div className='chatWindow-body flex-center-col margin-t-10'>
                    {
                        messages.map((messageItem, index) => {
                            return (
                                <div key={index} className={`chatWindow-body-message ${messageItem.author.name === chatUser.name ? 'myMessage' : 'foreignMessage'}`}>
                                    <div className='messageContent'> 
                                        {messageItem.message}
                                    </div>
                                    <p className='messageDate margin-t-2 margin-b-5 margin-r-13'>
                                        {messageItem.time}
                                    </p>
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