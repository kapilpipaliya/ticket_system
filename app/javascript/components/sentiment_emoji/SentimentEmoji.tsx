import * as React from 'react';

import Smiling from '../../../assets/emojis/svg/03-Grinning Face with Smiling Eyes.svg'
import Frowning from '../../../assets/emojis/svg/12-Slightly Frowning Face.svg'
import Natural from '../../../assets/emojis/svg/06-Slightly Smiling Face.svg';

interface SentimentEmojiProps {
    variant: 'positive' | 'negative' | 'natural';
}

export const SentimentEmoji = (props: SentimentEmojiProps) => {
    switch(props.variant){
        case 'negative':
            return <img src={Frowning} width={25} height={25} alt='positive' />;
        case 'positive':
            return <img src={Smiling} width={25} height={25} alt='negative'/>;
        case 'natural':
        default:
            return <img src={Natural} width={25} height={25} alt='natural'/>;
    }
}