import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import ButtonComponent from '../buttons/buttonComponent';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { GlobalUtilities } from '../../Utilities/globalUtilities';
import {useDispatch} from 'react-redux';

const ChatOptions = ({socket, chatUser, chatRoom, setUserLoggedIn}) => {
    // store vars
    const dispatch = useDispatch();

    return(
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
            <Tooltip title='Delete all messages. The messages will be deleted for everyone in the chat.' placement='top-start' width={50}>
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
    )
}

export default ChatOptions;