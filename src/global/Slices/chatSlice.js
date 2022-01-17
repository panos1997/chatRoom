const initialChatState = {
    chatRoom: {name: ''},
    chatUser: {name: ''},
    socket: null
}

// Chat reducer
const Chat = (state = initialChatState, action) => {
    switch(action.type) {
        case 'chat/setChatUser': {
            return {
                ...state,
                chatUser: action.payload
            };
        }
        case 'chat/setChatRoom': {
            return {
                ...state,
                chatRoom: action.payload
            };
        }
        case 'chat/setSocket': {
            return {
                ...state,
                socket: action.payload
            };
        }
        default: 
            return state;
    }
}

export default Chat;