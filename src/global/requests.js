import axios from 'axios';

export const ServerURL = 'https://my-chat-room-application.herokuapp.com';
// export const ServerURL = 'http://localhost:3001';

const requests = {
    getUsersInChat: async (chatroomName) => {
        return await axios.get(`${ServerURL}/getUsersInChat/${chatroomName}`).then(res => res.data);
    }
}

export default requests;