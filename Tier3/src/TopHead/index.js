import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Person from '@material-ui/icons/PersonOutline';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import 'typeface-roboto';
import styled from 'styled-components';

function TopHead({authenticate}) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function logOut() {
        setAnchorEl(null);
        authenticate(false);
    }

    return (
        <Header>
            <TitleArea>
                <StyledAvatarFlag
                    src="/img/flag.png"
                    size={60}
                    alt="flag icon"
                />
                <span>
                CCE Explorer Nigeria
            </span>
            </TitleArea>
            <UserArea onClick={handleClick}>
                <StyledAvatar>
                    <Person />
                </StyledAvatar>
            </UserArea>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem onClick={logOut}>Logout</MenuItem>
            </Menu>
        </Header>
    )
};

const Header = styled.header`
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: white;
    height: 50px;
`;
const TitleArea = styled.div`
    font-weight: 400;
    font-size: 22px;
    display: flex;
    align-items: center;
    
    & > div {
        margin: 0 1em 0 2em;
        object-fit: cover;
        width: 30px;
        height: 30px;
    }
`;
const StyledAvatarFlag = styled(Avatar)`
    box-shadow: 0 0 0px 2px #00915b;
    & > img {
        height: 150% !important;
    }
`;
const StyledAvatar = styled(Avatar)`
    & > img {
        height: 150% !important;
    }
`;
const UserArea = styled.div`
    font-size: 18px;
    margin: 0px 2em;
    align-items: center;
    display: flex;
`;

export default TopHead;
