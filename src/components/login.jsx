import React, {useState, useEffect} from 'react';
import { TextField } from '@material-ui/core';
import { GlobalUtilities } from '../Utilities/globalUtilities';
import ButtonComponent from './buttons/buttonComponent';
import { useDispatch } from 'react-redux';
import requests from '../global/requests.js';

const MAX_FIELD_CHARS = 30;
let chatRoomLocal = {name: ''};

const Login = ({setUserLoggedIn, chatUser, chatRoom, socket}) => {
    const [roomIsFullError, setRoomIsFullError] = useState(false);
    const [emptyUserFieldError, setEmptyUserFieldError] = useState(false);
    const [emptyRoomFieldError, setEmptyRoomFieldError] = useState(false);
    const [maxCharsRoomFieldError, setMaxCharsRoomFieldError] = useState(false);
    const [maxCharsUserFieldError, setMaxCharsUserFieldError] = useState(false);

    // store vars
    const dispatch = useDispatch();

    useEffect(() => {     
        socket.on('joined_room', async (data) => {
            if(data.joined) {
                setUserLoggedIn(true);
                const users = await requests.getUsersInChat(chatRoomLocal.name);
                dispatch({type: 'chat/setChatAllUsers', payload: users});
                dispatch({type: 'chat/setChatUser', payload: data.user});
                dispatch({type: 'chat/setChatRoom', payload: data.room});
            } else setRoomIsFullError(true);
        });
    // eslint-disable-next-line
    }, [socket]);

    const errorsExist = () => {
        return roomIsFullError || emptyUserFieldError || emptyRoomFieldError || maxCharsRoomFieldError || maxCharsUserFieldError;
    }

    const joinRoom = (user, room) => {
        if(!errorsExist() && (user.name !== '' && room.name !== '')) {
            socket.emit('join_room', {user: user, room: room});
        } else {
            if(user.name === '') setEmptyUserFieldError(true);
            if(room.name === '') setEmptyRoomFieldError(true);
        }
    }

    const getUserFieldErrorText = () => {
        return emptyUserFieldError ? 'please type a username.' : maxCharsUserFieldError ? `username can not be more than ${MAX_FIELD_CHARS} letters` : '\u00a0';
    }

    const getRoomFieldErrorText = () => {
        return emptyRoomFieldError ? 'please type a room.' : maxCharsRoomFieldError ? `room name can not be more than ${MAX_FIELD_CHARS} letters` : roomIsFullError ? 'This room is full. Please select another one.' : '\u00a0';
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
                if(e.target.value !== '') setEmptyUserFieldError(false);
                if(e.target.value.length > MAX_FIELD_CHARS) setMaxCharsUserFieldError(true);
                else if(maxCharsUserFieldError) setMaxCharsUserFieldError(false);

                dispatch({type: 'chat/setChatUser', payload: {name: e.target.value}});
            }}
            onKeyPress={(e) => GlobalUtilities.chatUtilities.pressEnterOnKeyboard(e, [() => joinRoom({name: e.target.value, avatarColor: 'green'}, chatRoom)])}
            error={emptyUserFieldError || maxCharsUserFieldError}
            helperText={getUserFieldErrorText()}
        />
        <TextField 
            label='room'
            className='loginWindow-field'
            value={chatRoom.name} 
            onChange={(e) => {
                if(e.target.value !== '') setEmptyRoomFieldError(false);
                if(e.target.value.length > MAX_FIELD_CHARS) setMaxCharsRoomFieldError(true);
                else if(maxCharsRoomFieldError) setMaxCharsRoomFieldError(false);

                dispatch({type: 'chat/setChatRoom', payload: {name: e.target.value}});
                chatRoomLocal = {name: e.target.value};
            }}
            onKeyPress={(e) => GlobalUtilities.chatUtilities.pressEnterOnKeyboard(e, [() => joinRoom(chatUser, {name: e.target.value})])}
            error={emptyRoomFieldError || maxCharsRoomFieldError || roomIsFullError}
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