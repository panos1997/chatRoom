import React, {useState, useEffect} from 'react';
import { TextField } from '@material-ui/core';
import { GlobalUtilities } from '../Utilities/globalUtilities';
import ButtonComponent from './buttons/buttonComponent';
import { useDispatch } from 'react-redux';

const Login = ({setUserLoggedIn, chatUser, chatRoom, socket}) => {
    const [roomIsFullError, setRoomIsFullError] = useState(false);
    const [emptyUserFieldError, setEmptyUserFieldError] = useState(false);
    const [emptyRoomFieldError, setEmptyRoomFieldError] = useState(false);

    // store vars
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('joined_room', (joined) => {
            joined && setUserLoggedIn(true);
            !joined && setRoomIsFullError(true);
        });
    // eslint-disable-next-line
    }, [socket]);

    const joinRoom = (user, room) => {
        if(user.name !== '' && room.name !== '') {
            socket.emit('join_room', {user: user, room: room});
        } else {
            if(user.name === '') setEmptyUserFieldError(true);
            if(room.name === '') setEmptyRoomFieldError(true);
        }
    }

    const getUserFieldErrorText = () => {
        return emptyUserFieldError ? 'please type a username.' : '\u00a0';
    }

    const getRoomFieldErrorText = () => {
        return emptyRoomFieldError ? 'please type a room.' : roomIsFullError ? 'This room is full. Please select another one.' : '\u00a0';
    }

    return <div className='loginWindow flex-center-justify-center-col'>
        <p className='loginWindow-title margin-b-15'>
            Join a room and start chatting!
        </p>
        <TextField 
            label='username' 
            className='loginWindow-field'
            value={chatUser.name} 
            onChange={(e) => {
                if(e.target.value !== '') {
                    setEmptyUserFieldError(false);
                }
                dispatch({type: 'chat/setChatUser', payload: {name: e.target.value}});
            }}
            onKeyPress={(e) => GlobalUtilities.chatUtilities.pressEnterOnKeyboard(e, [() => joinRoom({name: e.target.value}, chatRoom)])}
            error={emptyUserFieldError}
            helperText={getUserFieldErrorText()}
        />
        <TextField 
            label='room'
            className='loginWindow-field'
            value={chatRoom.name} 
            onChange={(e) => {
                if(e.target.value !== '') {
                    setEmptyRoomFieldError(false);
                }
                dispatch({type: 'chat/setChatRoom', payload: {name: e.target.value}});
            }}
            onKeyPress={(e) => GlobalUtilities.chatUtilities.pressEnterOnKeyboard(e, [() => joinRoom(chatUser, {name: e.target.value})])}
            error={emptyRoomFieldError || roomIsFullError}
            helperText={getRoomFieldErrorText()}
        />
        <ButtonComponent 
            btnContent='Join Room'
            btnProps={{
                className: 'loginWindow-button margin-t-70',
                onClick: () => joinRoom(chatUser, chatRoom)
            }}
        />
    </div>
}

export default Login;