import React, {useState} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { Avatar } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const MessagesList = ({socket, messages, chatUser, chatRoom}) => {
    const [showMessageOptionsIndex, setShowMessageOptionsIndex] = useState(-1);

    const deleteSpecificMessage = (index) => {
        socket.emit('delete_message', {room: chatRoom, messageIndex: index});
    }

    return(
        <div className='chatWindow-body flex-center-col margin-t-10'>
            {
                messages.map((messageItem, index) => {
                    return (
                        <div 
                            key={index} 
                            className={`chatWindow-body-message flex-col margin-t-5 ${messageItem.author.name === chatUser.name ? 'myMessage' : 'foreignMessage'}`}
                            onMouseOver={() => setShowMessageOptionsIndex(index)}    
                            onMouseLeave={() => setShowMessageOptionsIndex(-1)}
                        >
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
                                    (showMessageOptionsIndex === index && messageItem.author.name === chatUser.name) 
                                    && <div className='singleMessageOptions'>
                                        <Tooltip title='Delete message'>
                                            <DeleteIcon 
                                                className='deleteIcon margin-l-5'
                                                // user can delete only his own messages
                                                onClick={() => deleteSpecificMessage(index)}    
                                            />
                                        </Tooltip>
                                    </div>
                                }
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
    )
}

export default MessagesList;