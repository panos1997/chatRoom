import React, {useState} from 'react';
import './css/index.scss';
import ChatWindow from './components/chatWindow';
import Login from './components/login';
import io from 'socket.io-client';

const socket = io.connect('https://my-chat-room-application.herokuapp.com/');

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false); 
  const [room, setRoom] = useState('');
  const [user, setUser] = useState('');

  return (
    <div className="App">
      {
        userLoggedIn
          ? <ChatWindow 
              socket={socket}
              room={room}
              user={user}
            />
          :  <Login 
                setUserLoggedIn={setUserLoggedIn} 
                socket={socket}  
                room={room}
                user={user}
                setRoom={setRoom}
                setUser={setUser}
              />
      }
    </div>
  );
}

export default App;
