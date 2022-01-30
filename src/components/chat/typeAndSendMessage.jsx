import React, {useState} from 'react';
import { GlobalUtilities } from '../../Utilities/globalUtilities';
import ButtonComponent from '../buttons/buttonComponent';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Picker, {SKIN_TONE_MEDIUM_DARK} from 'emoji-picker-react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import GifIcon from '@material-ui/icons/Gif';
import { TextField } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
// import dummyGifs from './dummyGifs.js';

const TypeAndSendMessage = ({socket, chatUser, chatRoom, currentMessage, setCurrentMessage, setMessages}) => {
    const [showEmojisMenu, setShowEmojisMenu] = useState(false);
    const [showGifsMenu, setShowGifsMenu] = useState(false);
    const [gifs, setGifs] = useState([]);
    const [gifsUploadedToTextArea, setGifsUploadedToTextArea] = useState([]);
    const [gifsLoading, setGifsLoading] = useState(true);

    const sendMessage = () => {
        let messageWithGifIfExists = '';

        if(gifsUploadedToTextArea?.length > 0) {
            gifsUploadedToTextArea.forEach((gifUrl) => {
                const gif = `gif(${gifUrl})`;
                messageWithGifIfExists = messageWithGifIfExists.concat(' ', gif);
            });
            messageWithGifIfExists = messageWithGifIfExists.concat(' ', currentMessage);
        } else {
            messageWithGifIfExists = currentMessage;
        }
        
        GlobalUtilities.chatUtilities.sendMessage(socket, messageWithGifIfExists, setCurrentMessage, setMessages, chatRoom, chatUser);
        setGifsUploadedToTextArea([]);
    }

    const getUploadedGifs = () => {
        const uploadedGifsList = <div className='flex-center-col margin-l-15'>
            {
                gifsUploadedToTextArea.map((gifUrl, index) => (
                    <img
                        key={index}
                        className='margin-b-5'
                        width={150}
                        height={100}
                        src={gifUrl}
                        alt="gif"
                    />
                ))
            }
        </div>
        return uploadedGifsList;
    }

    const onEmojiClick = (e, emojiObject) => {
        setCurrentMessage((previousMessage) => {
            const messageWithEmoji = previousMessage.concat('', emojiObject.emoji);
            setCurrentMessage(messageWithEmoji);
            
            GlobalUtilities.chatUtilities.scrollDownToLatestMessage('MuiInputBase-root');
        });
    }

    const onGifClick = (gifUrl) => {
        setGifsUploadedToTextArea((prevState) => [...prevState, gifUrl]);
    }

    return(
        <div className='chatWindow-footer'>
            <div className='chatWindow-footer-newMessage'>
                <TextField
                    id='messageBox' 
                    variant='outlined'
                    placeholder='type something'
                    className='chatWindow-footer-newMessage-textarea margin-l-10 margin-b-15 margin-t-47'
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    maxLength={1000}
                    onKeyUp={(e) => GlobalUtilities.chatUtilities.pressEnterOnKeyboard(e, [sendMessage])}
                    onKeyDown={GlobalUtilities.chatUtilities.pressEnterOnKeyboard}
                    value={currentMessage}
                    multiline 
                    InputProps={{startAdornment: getUploadedGifs()}}
                />
                <EmojiEmotionsIcon 
                    className='importInChat emojis'
                    onClick={() => setShowEmojisMenu((prevState) => !prevState)}    
                />
                <GifIcon
                    className='importInChat gifs margin-b-2'
                    onClick={() => !showGifsMenu && GlobalUtilities.chatUtilities.showTrendyGifs(setGifs, setShowGifsMenu, setGifsLoading)}
                />
            </div>
            <ButtonComponent 
                btnContent='Send'
                btnProps={{
                    className: 'chatButton sendMessage',
                    onClick: sendMessage
                }}
            />
            {
                showEmojisMenu && 
                <ClickAwayListener onClickAway={() => setShowEmojisMenu(false)}>
                    <div className='emojisOrGifsMenu'>
                        <Picker 
                            onEmojiClick={onEmojiClick}
                            disableAutoFocus={true}
                            native={false}
                            disableSearchBar={true}
                            groupNames={{ smileys_people: 'PEOPLE' }}
                            groupVisibility={{
                                flags: false,
                            }}
                            skinTone={SKIN_TONE_MEDIUM_DARK}
                        />
                    </div>
                </ClickAwayListener>
            }
            {
                showGifsMenu && <ClickAwayListener onClickAway={() => setShowGifsMenu(false)}>
                    <div className='emojisOrGifsMenu gifsMenu flex-center-col'>
                        <TextField 
                            id="outlined-basic" 
                            label="Search gifs" 
                            variant="outlined" 
                            className='searchBar'
                            onChange={(e) => GlobalUtilities.chatUtilities.searchForGifs(e, setGifs, setShowGifsMenu, setGifsLoading)}
                        />
                        <div className='gifsList'>
                            {
                                gifsLoading
                                ? <CircularProgress className='margin-t-70'/>
                                : gifs.map((gif, index) => (
                                    <img 
                                        className='gifItem'
                                        width={150}
                                        height={100}
                                        key={index} 
                                        src={gif?.images?.fixed_height_small?.url} 
                                        alt='gif'
                                        onClick={() => onGifClick(gif?.images?.fixed_height_small?.url)}
                                    />
                                ))
                            }

                        </div>
                    </div>
                </ClickAwayListener>
            }
        </div>
    );
}

export default TypeAndSendMessage;