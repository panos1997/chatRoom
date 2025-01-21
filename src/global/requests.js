import axios from 'axios';

export const ServerURL = 'https://https://chatroom-server-lsas.onrender.com';
// export const ServerURL = 'http://localhost:3001';

const requests = {
    getUsersInChat: async (chatroomName) => {
        return await axios.get(`${ServerURL}/getUsersInChat/${chatroomName}`).then(res => res.data);
    },
    getGifs: async (gifsName) => {
        if(gifsName) return await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=l6w9kyOakodI3v9uOuDTE93GLOkDwbvV&q=${gifsName}&limit=40&offset=0&rating=g&lang=en`).then(res => res?.data?.data);
        else return await axios.get(`https://api.giphy.com/v1/gifs/trending?api_key=l6w9kyOakodI3v9uOuDTE93GLOkDwbvV&limit=40&rating=g`).then(res => res?.data?.data);
    }
}

export default requests;
