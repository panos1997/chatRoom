import React, {useState} from 'react';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { GlobalUtilities } from '../../Utilities/globalUtilities';
import ButtonComponent from '../buttons/buttonComponent';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Picker, {SKIN_TONE_MEDIUM_DARK} from 'emoji-picker-react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const TypeAndSendMessage = ({socket, chatUser, chatRoom, currentMessage, setCurrentMessage, setMessages}) => {
    const [showEmojisMenu, setShowEmojisMenu] = useState(false);

    const onEmojiClick = (e, emojiObject) => {
        setCurrentMessage((previousMessage) => {
            const messageWithEmoji = previousMessage.concat('', emojiObject.emoji);
            setCurrentMessage(messageWithEmoji);
        });
    }

    return(
        <div className='chatWindow-footer'>
            <div className='chatWindow-footer-newMessage'>
                <TextareaAutosize
                    id='messageBox' 
                    placeholder='type something'
                    className='chatWindow-footer-newMessage-textarea margin-l-10 margin-b-15 margin-t-47'
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    maxLength={1000}
                    onKeyUp={(e) => GlobalUtilities.chatUtilities.pressEnterOnKeyboard(e, [() => GlobalUtilities.chatUtilities.sendMessage(socket, currentMessage, setCurrentMessage, setMessages, chatRoom, chatUser)])}
                    onKeyDown={GlobalUtilities.chatUtilities.pressEnterOnKeyboard}
                    value={currentMessage}
                />
                <EmojiEmotionsIcon 
                    className='selectEmojis'
                    onClick={() => setShowEmojisMenu((prevState) => !prevState)}    
                />
            </div>
            <ButtonComponent 
                btnContent='Send'
                btnProps={{
                    className: 'chatButton sendMessage',
                    onClick: () => GlobalUtilities.chatUtilities.sendMessage(socket, currentMessage, setCurrentMessage, setMessages, chatRoom, chatUser)
                }}
            />
            {
                showEmojisMenu && 
                <ClickAwayListener onClickAway={() => setShowEmojisMenu(false)}>
                    <div className='emojisMenu'>
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
        </div>
    );
}

export default TypeAndSendMessage;