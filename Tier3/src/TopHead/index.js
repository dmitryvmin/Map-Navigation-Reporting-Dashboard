import React from 'react';
import _ from 'lodash';

import GGConsts from './../Constants';

import Avatar from '@material-ui/core/Avatar';
import Person from '@material-ui/icons/PersonOutline';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slider from '@material-ui/lab/Slider';

import styled from 'styled-components';

function TopHead({authenticate, dispatch}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [threshold, setSlider] = React.useState(0.8);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function handleModalClose() {
        setOpen(false);
    }

    function logOut() {
        setAnchorEl(null);
        authenticate(false);
    }

    function manageSettings() {
        setOpen(true);
        setAnchorEl(null);
    }

    function handleSlider(event, value) {
        setSlider(value);
        dispatch({
            type: GGConsts.SETTINGS_UPDATING,
            metrics_threshold: value,
        });
    }

    return (
        <Header>
            <Dialog
                open={open}
                onClose={handleModalClose}
            >
                <StyledDialogContent>
                    <h4>Map Markers Threshold</h4>
                    <Row>
                        <Slider
                            value={threshold}
                            aria-labelledby="label"
                            min={0}
                            max={1}
                            step={0.05}
                            onChange={handleSlider}
                        />
                        <Span>{_.round(threshold * 100)}%</Span>
                    </Row>
                </StyledDialogContent>
            </Dialog>
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
                <MenuItem onClick={manageSettings}>Settings</MenuItem>
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
const StyledDialogContent = styled(DialogContent)`
    overflow: hidden;
`;
const Row = styled.div`
    display: flex;
    align-items: center;
`;
const Span = styled.span`
    margin-left: 1em;
`;

export default TopHead;
