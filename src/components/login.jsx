import React, {useState, useEffect} from 'react';
import { TextField } from '@material-ui/core';
import { GlobalUtilities } from '../Utilities/globalUtilities';
import ButtonComponent from './buttons/buttonComponent';
import { useDispatch } from 'react-redux';
import requests from '../global/requests.js';
import {keys} from 'lodash';

const MAX_FIELD_CHARS = 30;
let chatRoomLocal = {name: ''};

const loginErrorMessages = {
    roomIsFullError: 'This room is full. Please select another one.',
    emptyUserFieldError: 'please type a username.',
    emptyRoomFieldError: 'please type a room.',
    maxCharsRoomFieldError: `room name can not be more than ${MAX_FIELD_CHARS} letters`,
    maxCharsUserFieldError: `username can not be more than ${MAX_FIELD_CHARS} letters`,
}

const Login = ({setUserLoggedIn, chatUser, chatRoom, socket}) => {
    const [loginError, setLoginError] = useState({
        roomIsFullError: false,
        emptyUserFieldError: false,
        emptyRoomFieldError: false,
        maxCharsRoomFieldError: false,
        maxCharsUserFieldError: false,
    });

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
            } else {
                setLoginError((prevError) => { return {...prevError, roomIsFullError: true};});
            }
        });
    // eslint-disable-next-line
    }, [socket]);

    const errorsExist = () => !!(keys(loginError).find(error => loginError[error] === true));

    const getUserFieldErrorText = () => {
        return loginError.emptyUserFieldError 
            ? loginErrorMessages.emptyUserFieldError
            : loginError.maxCharsUserFieldError 
            ? loginErrorMessages.maxCharsUserFieldError
            : '\u00a0';
    }

    const getRoomFieldErrorText = () => {
        return loginError.emptyRoomFieldError 
            ? loginErrorMessages.emptyRoomFieldError
            : loginError.maxCharsRoomFieldError 
            ? loginErrorMessages.maxCharsRoomFieldError
            : loginError.roomIsFullError 
            ? loginErrorMessages.roomIsFullError
            : '\u00a0';
    }

    const joinRoom = (user, room) => {
        if(!errorsExist() && (user.name !== '' && room.name !== '')) {
            socket.emit('join_room', {user: user, room: room});
        } else {
            if(user.name === '') setLoginError((prevError) => { return {...prevError, emptyUserFieldError: true}});
            if(room.name === '') setLoginError((prevError) => { return {...prevError, emptyRoomFieldError: true}});
        }
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
                if(e.target.value !== '') setLoginError((prevError) => { return {...prevError, emptyUserFieldError: false}});
                if(e.target.value.length > MAX_FIELD_CHARS) setLoginError((prevError) => { return {...prevError, maxCharsUserFieldError: true}});
                else if(loginError.maxCharsUserFieldError) setLoginError((prevError) => { return {...prevError, maxCharsUserFieldError: false}});

                dispatch({type: 'chat/setChatUser', payload: {name: e.target.value}});
            }}
            onKeyPress={(e) => GlobalUtilities.chatUtilities.pressEnterOnKeyboard(e, [() => joinRoom({name: e.target.value, avatarColor: 'green'}, chatRoom)])}
            error={loginError.emptyUserFieldError || loginError.maxCharsUserFieldError}
            helperText={getUserFieldErrorText()}
        />
        <TextField 
            label='room'
            className='loginWindow-field'
            value={chatRoom.name} 
            onChange={(e) => {
                if(e.target.value !== '') setLoginError((prevError) => { return {...prevError, emptyRoomFieldError: false}});
                if(e.target.value.length > MAX_FIELD_CHARS) setLoginError((prevError) => { return {...prevError, maxCharsRoomFieldError: true}});
                else if(loginError.maxCharsRoomFieldError) setLoginError((prevError) => { return {...prevError, maxCharsRoomFieldError: false}});

                dispatch({type: 'chat/setChatRoom', payload: {name: e.target.value}});
                chatRoomLocal = {name: e.target.value};
            }}
            onKeyPress={(e) => GlobalUtilities.chatUtilities.pressEnterOnKeyboard(e, [() => joinRoom(chatUser, {name: e.target.value})])}
            error={loginError.emptyRoomFieldError || loginError.maxCharsRoomFieldError || loginError.roomIsFullError}
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