import React, { useEffect, useState } from 'react';
import OnlineStateIcon from './onlineStateIcon';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import ButtonComponent from './buttons/buttonComponent';
import moment from 'moment';
import { GlobalUtilities } from '../Utilities/globalUtilities';

const ChatWindow = ({socket, room, user}) => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');    
 
    const sendMessage = async () => { 
        if(currentMessage !== '') {
            const messageToSend = {
                room: room,
                author: user,
                message: currentMessage,
                time: moment().format('DD/MM/YYYY hh:mm')
            }; 
            
            await socket.emit('send_message', messageToSend);

            setMessages((prevMessages) => [...prevMessages, messageToSend]);

            // clear textArea
            document.getElementById('messageBox').value = '';
            setCurrentMessage('');

            // scrollbar should go to bottom, where the new message is
            const messageArea = document.getElementsByClassName('chatWindow-body')[0];
            messageArea.scrollTop = messageArea.scrollHeight;
        }  
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });
        socket.on('receive_all_messages', allMessages => {
            setMessages(allMessages);
        });
    }, [socket]);

    const clearChat = () => {
        socket.emit('clear_all_messages', room);
    }

    return <div className='chatWindow flex-col'>
        <div className='chatWindow-header flex-center-row'>
            <OnlineStateIcon active={true} />
            <p className='margin-l-5'> 
                Live Chat Room
            </p>
            <ButtonComponent 
                btnContent='Clear Chat'
                btnProps={{
                    className: 'chatButton clearChat',
                    onClick: clearChat
                }}
            />
        </div>
        <div className='chatWindow-body flex-center-col margin-t-10'>
            {
                messages.map((messageItem, index) => {
                    return (
                        <div key={index} className={`chatWindow-body-message ${messageItem.author === user ? 'myMessage' : 'foreignMessage'}`}>
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
                maxLength={100}
                onKeyUp={(e) => GlobalUtilities.pressEnterOnKeyboard(e, [sendMessage])}
                onKeyDown={GlobalUtilities.pressEnterOnKeyboard}
            />
            <ButtonComponent 
                btnContent='Send'
                btnProps={{
                    className: 'chatButton sendMessage',
                    onClick: sendMessage
                }}
            />
        </div>
    </div>
}

export default ChatWindow;