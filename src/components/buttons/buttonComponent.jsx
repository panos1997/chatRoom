import React from 'react';

const ButtonComponent = ({btnProps, btnContent}) => {
    return <button {...btnProps}>
                {btnContent}
            </button>
}

export default ButtonComponent;