import React from 'react';
import { TextField } from '@material-ui/core';
import { GlobalUtilities } from '../Utilities/globalUtilities';
import ButtonComponent from './buttons/buttonComponent';

const Login = ({setUserLoggedIn, socket, room, user, setRoom, setUser}) => {

    const joinRoom = (user, room) => {
        if(room !== '' && user !== '') {
            setUserLoggedIn(true);
            socket.emit('join_room', room);
        }
    }

    return <div className='loginWindow flex-center-justify-center-col'>
        <p className='loginWindow-title'>
            Join a room and start chatting!
        </p>
        <TextField 
            label='username' 
            className='loginWindow-field'
            defaultValue={room} 
            onChange={(e) => setUser(e.target.value)}
            onKeyPress={(e) => GlobalUtilities.pressEnterOnKeyboard(e, [() => joinRoom(e.target.value, room)])}
        />
        <TextField 
            label='room'
            className='loginWindow-field'
            defaultValue={room} 
            onChange={(e) => setRoom(e.target.value)}
            onKeyPress={(e) => GlobalUtilities.pressEnterOnKeyboard(e, [() => joinRoom(user, e.target.value)])}
        />
        <ButtonComponent 
            btnContent='Join Room'
            btnProps={{
                className: 'loginWindow-button margin-t-70',
                onClick: () => joinRoom(user, room)
            }}
        />
    </div>
}

export default Login;