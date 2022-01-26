import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import cssVars from '../css/exportedVars.module.scss';
import requests from '../global/requests.js';
import MenuWithOptions from '../components/menus/menuWithOptions';
import {pick} from 'lodash';
import CloseIcon from '@material-ui/icons/Close';

export const GlobalUtilities = {
    globalBannerUtilities: {
        showGlobalBanner: (dispatch, bannerTexts, bannerButtons, bannerExtraClasses) => {
            dispatch({ type: 'globalBanner/setBannerShow', payload: true });
            bannerTexts && dispatch({ type: 'globalBanner/setBannerTexts', payload: bannerTexts });
            bannerButtons && dispatch({ type: 'globalBanner/setBannerButtons', payload: bannerButtons });
            bannerExtraClasses && dispatch({ type: 'globalBanner/setBannerExtraClasses', payload: bannerExtraClasses });
        },
        closeGlobalBanner: (dispatch) => {
            dispatch({ type: 'globalBanner/setBannerShow', payload: false });
            dispatch({ type: 'globalBanner/setBannerTexts', payload: {} });
            dispatch({ type: 'globalBanner/setBannerButtons', payload: [] });
            dispatch({ type: 'globalBanner/setBannerExtraClasses', payload: {} });
        },
        closeBannerOnEscapeKey: (e, bannerIsOpen, dispatch) => {
            if(bannerIsOpen && (e.key === 'Escape')) GlobalUtilities.globalBannerUtilities.closeGlobalBanner(dispatch); 
        },
        showClearChatBanner: (dispatch, socket, chatRoom) => {
            const bannerTextsTemp = {
                title: 'Are you sure you want to proceed?',
                description: 'Keep in mind that after the deletion, there is no way to retrieve the messages back.'
            }
            const bannerButtonsTemp = [
                {
                    content: 'Cancel',
                    classes: 'globalButton normalButton margin-b-5',
                    style: {width: '100px'},
                    clickListener: () => GlobalUtilities.globalBannerUtilities.closeGlobalBanner(dispatch) 
                  },
                  {
                    content: 'Proceed',
                    classes: 'globalButton deleteButton margin-b-5',
                    style: {width: '100px'},
                    clickListener: () => GlobalUtilities.chatUtilities.clearChat(dispatch, socket, chatRoom)
                  }
            ];
            const bannerExtraClassesTemp = {
                globalBanner: 'clearChatBanner'
            };

            GlobalUtilities.globalBannerUtilities.showGlobalBanner(dispatch, bannerTextsTemp, bannerButtonsTemp, bannerExtraClassesTemp);
        }
    },
    chatUtilities: {
        sendMessage: async (socket, message, setCurrentMessage, setMessages, chatRoom, chatUser) => { 
            if(message !== '') {
                const messageToSend = {
                    room: chatRoom,
                    author: chatUser,
                    message: message,
                    fullTime: moment().format('DD/MM/YYYY hh:mm'),
                    shortTime: moment().format('hh:mm')
                }; 
                
                await socket.emit(
                    'send_message', 
                    {
                        message: pick(messageToSend, ['message', 'author', 'fullTime', 'shortTime']), 
                        room: chatRoom
                    }
                );
    
                setMessages((prevMessages) => [...prevMessages, messageToSend]);
    
                // clear textArea
                document.getElementById('messageBox').value = '';
                setCurrentMessage('');
    
                GlobalUtilities.chatUtilities.scrollDownToLatestMessage('chatWindow-body');
            }  
        },
        clearChat: (dispatch, socket, chatRoom) => {
            GlobalUtilities.globalBannerUtilities.closeGlobalBanner(dispatch);
            socket.emit('clear_all_messages', chatRoom);
        },
        // logout from chat redirects user to the login page
        logoutFromChat: async (dispatch, socket, chatUser, chatRoom, setUserLoggedIn) => {
            setUserLoggedIn(false);

            // notify server that user has logged out of the chat
            socket.emit('left_room', {user: chatUser, room: chatRoom});

            // if user logs out, clear the login form fields
            dispatch({type: 'chat/setChatUser', payload: {name: ''}});
            dispatch({type: 'chat/setChatRoom', payload: {name: ''}});
        },
        // scrollbar will go to bottom, where the new message is
        scrollDownToLatestMessage: (messageAreaClass) => {
            const messageArea = document.getElementsByClassName(messageAreaClass)[0];
            messageArea.scrollTop = messageArea.scrollHeight;
        },
        pressEnterOnKeyboard: (e, actionsList) => {
            if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                actionsList && actionsList.forEach(action => {
                    action && action();
                })
            }
        },
        showParticipantsBanner: async (dispatch, chatRoomName) => {
            const users = await requests.getUsersInChat(chatRoomName);
            
            const participantsList = <div>
                {users.map((participant, index) => (
                    <div key={index} className='flex-center-justify-between-row margin-t-15 margin-b-15'>
                        <div className='flex-center-row'>
                            <Avatar style={{backgroundColor: participant.avatarColor}}>
                                {participant.name.charAt(0).toUpperCase()}
                            </Avatar> 
                            <p className='margin-l-10'>
                                {participant.name}
                            </p>
                        </div>
                        <MenuWithOptions
                            options={[
                                {
                                    icon: <RemoveCircleIcon style={{color: cssVars['button2Color']}} />, 
                                    text: 'Remove Participant', 
                                    clickHandler: () => {}
                                }
                            ]}
                        />
                    </div>)
                )}
            </div>;
    
            const bannerTextsTemp = {
                title: <div className='flex-center-justify-center-row title'>
                    <div>Participants</div>
                    <CloseIcon 
                        className='closeIcon'
                        onClick={() => GlobalUtilities.globalBannerUtilities.closeGlobalBanner(dispatch)}
                    />
                </div>,
                description: participantsList
            }
            const bannerExtraClasses = {
                globalBanner: 'participantsBanner',
                description: 'participantsBanner-list'
            }
            GlobalUtilities.globalBannerUtilities.showGlobalBanner(dispatch, bannerTextsTemp, null, bannerExtraClasses);
        }
    }
}