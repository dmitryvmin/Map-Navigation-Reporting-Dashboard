import React, {Component} from 'react';

import Avatar from '@material-ui/core/Avatar';
import Person from '@material-ui/icons/PersonOutline';
// import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
// import MenuItem from '@material-ui/core/MenuItem';
// import IconButton from '@material-ui/core/IconButton';
import 'typeface-roboto';
import styled from 'styled-components';

export default class TopHead extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            moh: 'Kenya'
        }
    }

    render() {
        return (
            <Header>
                <TitleArea>
                    <Avatar
                        src="/img/flag.jpg"
                        size={60}
                        alt="flag icon"
                    />
                    <span>
                        Nigeria Reporting Tool
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
        )
    }
}

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
const StyledAvatar = styled(Avatar)`
    width: 30px;
    height: 30px;
`;
const UserArea = styled.div`
    font-size: 18px;
    margin: 0px 2em;
    align-items: center;
    display: flex;
`;
