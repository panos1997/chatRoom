import React, {useState} from "react";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const MenuWithOptions = ({options}) => {
    const [menuElement, setMenuElement] = useState(null);

    const handleClick = (e) => setMenuElement(e.currentTarget);
    const handleClose = () => setMenuElement(null);
    const handleItemClick = (action) => {
        setMenuElement(null);
        action();
    }

    return(
        <div>
            <MoreVertIcon 
                className='optionsIcon' 
                onClick={handleClick}
            />
            <Menu
                id="simple-menu"
                className='chatOptionsMenu'
                anchorEl={menuElement}
                keepMounted
                open={Boolean(menuElement)}
                onClose={handleClose}
            >
            {
                options.map((option, index) => {
                    return <MenuItem 
                                key={index} 
                                onClick={() => handleItemClick(option.clickHandler)}
                            >
                                {option.icon}
                                <p className='margin-l-10'>
                                    {option.text}
                                </p>
                            </MenuItem>
                })
            }
            </Menu>
        </div>
    )
}

export default MenuWithOptions;