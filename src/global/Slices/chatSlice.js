const initialChatState = {
    chatRoom: {name: ''},
    chatUser: {name: ''},
    chatAllUsers: [],
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
        case 'chat/setChatAllUsers': {
            return {
                ...state,
                chatAllUsers: action.payload
            };
        }
        default: 
            return state;
    }
}

export default Chat;