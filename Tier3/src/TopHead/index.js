import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Person from '@material-ui/icons/PersonOutline';
// import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
// import MenuItem from '@material-ui/core/MenuItem';
// import IconButton from '@material-ui/core/IconButton';
import 'typeface-roboto';
import styled from 'styled-components';

const TopHead = () => (
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
        <UserArea>
            <StyledAvatar>
                <Person />
            </StyledAvatar>
            {/*<IconMenu*/}
            {/*iconButtonElement={<IconButton style={styles.downArrow}><KeyboardArrowDown /></IconButton>}*/}
            {/*anchorOrigin={{horizontal: 'right', vertical: 'top'}}*/}
            {/*targetOrigin={{horizontal: 'right', vertical: 'top'}}*/}
            {/*>*/}
            {/*<MenuItem primaryText="Sign out" onClick={(e) => this.props.authenticate(false)}/>*/}
            {/*</IconMenu>*/}
        </UserArea>
    </Header>
);

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
    box-shadow: 0 0 0px 3px #00915b;
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
