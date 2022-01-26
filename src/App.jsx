import React, {useState} from 'react';
import './css/index.scss';
import ChatWindow from './components/chat/chatWindow';
import Login from './components/login';
import io from 'socket.io-client';
import GlobalBanner from './components/banners/globalBanner.jsx';
import {useSelector} from 'react-redux';
import {ServerURL} from './global/requests.js';

const socket = io.connect(ServerURL);

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false); 

  // store vars
  const globalBannerStore = useSelector(state => state.globalBanner);
  const chatStore = useSelector(state => state.chat);

  return (
    <div className="App">
      {
        userLoggedIn
          ? <ChatWindow 
              setUserLoggedIn={setUserLoggedIn}
              chatUser={chatStore.chatUser}
              chatRoom={chatStore.chatRoom}
              socket={socket}
            />
          :  <Login 
                setUserLoggedIn={setUserLoggedIn} 
                chatUser={chatStore.chatUser}
                chatRoom={chatStore.chatRoom}
                socket={socket}
              />
      }
      {/* Global Banner that uses redux variables */}
      <GlobalBanner 
        bannerShow={globalBannerStore.bannerShow}
        bannerTexts={globalBannerStore.bannerTexts}
        bannerButtons={globalBannerStore.bannerButtons}
        bannerExtraClasses={globalBannerStore.bannerExtraClasses}
      />
    </div>
  );
}

export default App;
