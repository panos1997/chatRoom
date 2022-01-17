import moment from 'moment';

export const GlobalUtilities = {
    globalBannerUtilities: {
        showGlobalBanner: (dispatch, bannerTexts, bannerButtons) => {
            dispatch({ type: 'globalBanner/setBannerShow', payload: true });
            dispatch({ type: 'globalBanner/setBannerTexts', payload: bannerTexts });
            dispatch({ type: 'globalBanner/setBannerButtons', payload: bannerButtons });
        },
        closeBannerOnEscapeKey: (e, bannerIsOpen, dispatch) => {
            if(bannerIsOpen && (e.key === 'Escape')) dispatch({ type: 'globalBanner/setBannerShow', payload: false });
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
                    clickListener: () => dispatch({type: 'globalBanner/setBannerShow', payload: false}) 
                  },
                  {
                    content: 'Proceed',
                    classes: 'globalButton deleteButton margin-b-5',
                    style: {width: '100px'},
                    clickListener: () => GlobalUtilities.chatUtilities.clearChat(dispatch, socket, chatRoom)
                  }
            ]
            GlobalUtilities.globalBannerUtilities.showGlobalBanner(dispatch, bannerTextsTemp, bannerButtonsTemp);
        }
    },
    chatUtilities: {
        sendMessage: async (socket, message, setCurrentMessage, setMessages, chatRoom, chatUser) => { 
            if(message !== '') {
                const messageToSend = {
                    room: chatRoom,
                    author: chatUser,
                    message: message,
                    time: moment().format('DD/MM/YYYY hh:mm')
                }; 
                
                await socket.emit('send_message', messageToSend);
    
                setMessages((prevMessages) => [...prevMessages, messageToSend]);
    
                // clear textArea
                document.getElementById('messageBox').value = '';
                setCurrentMessage('');
    
                GlobalUtilities.chatUtilities.scrollDownToLatestMessage('chatWindow-body');
            }  
        },
        clearChat: (dispatch, socket, chatRoom) => {
            dispatch({type: 'globalBanner/setBannerShow', payload: false})
            socket.emit('clear_all_messages', chatRoom);
        },
        // logout from chat redirects user to the login page
        logoutFromChat: (dispatch, socket, chatUser, chatRoom, setUserLoggedIn) => {
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
        }    
    }
}