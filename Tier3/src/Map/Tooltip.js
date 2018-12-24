import React from 'react';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';

const POITooltip = ({x, y, value}) => {
    if (!x || !y || !value) {
        return null;
    }

    return (
        <Tooltip x={x} y={y}>
            <div>{value}</div>
        </Tooltip>
    );
}

const Tooltip = styled(Card)`
    position: absolute;
    width: 180px;
    height: 40px;
    z-index: 100;
    transform: translateX(-90px);
    left: 50%;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    // top: ${props => `${props.y - 50}px`};
    // left: ${props => `${props.x}px`};
`;

export default POITooltip;
