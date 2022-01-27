import React, {useState} from 'react';
import { GlobalUtilities } from '../../Utilities/globalUtilities';
import ButtonComponent from '../buttons/buttonComponent';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Picker, {SKIN_TONE_MEDIUM_DARK} from 'emoji-picker-react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import GifIcon from '@material-ui/icons/Gif';
import { TextField } from '@material-ui/core';
import requests from '../../global/requests.js';
// import dummyGifs from './dummyGifs.js';

const TypeAndSendMessage = ({socket, chatUser, chatRoom, currentMessage, setCurrentMessage, setMessages}) => {
    const [showEmojisMenu, setShowEmojisMenu] = useState(false);
    const [showGifsMenu, setShowGifsMenu] = useState(false);
    const [gifs, setGifs] = useState([]);
    const [gifsUploadedToTextArea, setGifsUploadedToTextArea] = useState([]);

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
        const uploadedGifsList = <div className='flex-center-col margin-l-13'>
            {
                gifsUploadedToTextArea.map((gifUrl, index) => (
                    <img
                        key={index}
                        className='margin-b-5'
                        width={150}
                        height={100}
                        src={gifUrl}
                        alt="gif image"
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
        });
    }

    const onGifClick = (gifUrl) => {
        setGifsUploadedToTextArea((prevState) => [...prevState, gifUrl]);
    }

    const searchForGifs = async (e) => {
        const gifsName = e.target.value;
        if(gifsName.length > 0) showGifsbyGivenName(gifsName);
        else showTrendyGifs();
    }

    const showGifsbyGivenName = async (gifsName) => {
        const gifsArray = await requests.getGifs(gifsName);
        setGifs(gifsArray);
    };

    const showTrendyGifs = () => {
        setShowGifsMenu(async (prevState) => {
            const trendyGifs = await requests.getGifs();
            setGifs(trendyGifs);
            return !prevState;
        });
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
                    onClick={() => !showGifsMenu && showTrendyGifs()}
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
                    <div className='emojisOrGifsMenu gifsMenu'>
                        <TextField 
                            id="outlined-basic" 
                            label="Search gifs" 
                            variant="outlined" 
                            className='searchBar'
                            onChange={searchForGifs}
                        />
                        <div className='gifsList'>
                            {
                                gifs.map((gif, index) => (
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