import React from 'react';

const getOnlineIconStyle = (active) => {
    const tempStyle = {
        'width': '13px',
        'height': '13px',
        'borderRadius': '100px'
    }
    if(active) tempStyle['backgroundColor'] = '#40B47A';
    else tempStyle['backgroundColor'] = 'red';
    return tempStyle;
}

const OnlineStateIcon = ({active}) => {
    return (
        <div style={getOnlineIconStyle(active)} />
    );
}

export default OnlineStateIcon;