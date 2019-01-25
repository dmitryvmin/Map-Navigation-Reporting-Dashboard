import React from 'react';
import GGConsts from '../Constants';
import styled, { css } from 'styled-components';
import Card from '@material-ui/core/Card';

function POITooltip({hover, cohort}) {

    return (
        <Tooltip>
            <Top>
                {(cohort.devicesPercentile)
                    ? <>
                    <Left>
                        <Row>
                            <CircleContainer>
                                <Circle size="large"/>
                            </CircleContainer>
                            {(cohort.devicesPercentile === 'top') ? <Span> - {hover.value}</Span> : null}
                        </Row>
                        <Row>
                            <CircleContainer>
                                <Circle size="medium"/>
                            </CircleContainer>
                            {(cohort.devicesPercentile === 'middle') ? <Span top> - {hover.value}</Span> : null}
                        </Row>
                        <Row>
                            <CircleContainer>
                                <Circle size="small"/>
                            </CircleContainer>
                            {(cohort.devicesPercentile === 'bottom') ? <Span> - {hover.value}</Span> : null}
                        </Row>
                    </Left>
                    <Right>
                        <Row>
                            <CircleContainer>
                                <Circle
                                    size="medium"
                                    color={GGConsts.COLOR_GREEN}
                                />
                            </CircleContainer>
                        </Row>
                        <Row>
                            <CircleContainer>
                                <Circle
                                    size="medium"
                                    color={GGConsts.COLOR_YELLOW}
                                />
                            </CircleContainer>
                        </Row>
                        <Row>
                            <CircleContainer>
                                <Circle
                                    size="medium"
                                    color={GGConsts.COLOR_RED}
                                />
                            </CircleContainer>
                        </Row>
                    </Right>
                    </>
                    : <NoData>{hover.value}</NoData>}
            </Top>
            <Bottom>
            {
                (cohort.devicesPercentile)
                ? <p>{`${cohort['Total Devices']} / ${cohort.devicesPercentileTotal} devices`}</p>
                : null
            }
            </Bottom>
        </Tooltip>
    );
}

const Circle = styled.div`
    background-color: ${({color}) => color ? color : 'black'}; 
    border-radius: 50%;
    
    ${props => (props.size === 'large') && css`
        width: 15px;
        height: 15px; 
    `}
    ${props => (props.size === 'medium') && css`
        width: 9px;
        height: 9px; 
        margin-top: 4px; 
    `}
    ${props => (props.size === 'small') && css`
        width: 5px;
        height: 5px; 
    `} 
`;
const Span = styled.span`
    ${({top}) => top && css`
        margin-top: 5px; 
    `}
`;
const CircleContainer = styled.div`
    width: 15px;
    display: flex; 
    justify-content: center;
    margin-right: 0.5em;
`;
const Top = styled.div`
    width: 180px;
    height: 45px;
    display: flex;
`;
const Left = styled.div`
    flex: 75%;
`;
const Right = styled.div`
    flex: 25%;
`;
const Row = styled.div`
    display: flex;
    height: 15px; 
    align-items: center; 
`;
const NoData = styled.div`
    display: flex;
    width: 180px;
    height: 60px;
    justify-content: center;
    align-items: center;
`;
const Bottom = styled.div`
    width: 180px;
    height: 15px;
    & > p {
        font-size: 0.75em;
        text-align: left; 
        margin: 0.25em 0 0.25em 0.5em;
    }
`;
const Tooltip = styled(Card)`
    position: absolute;
    width: 180px;
    height: 60px;
    z-index: 100;
    // transform: translateX(-90px);
    right: 10px;
    bottom: 10px;
    display: flex;
    flex-flow: column;
    padding: 5px; 
    // top: ${props => `${props.y - 50}px`};
    // left: ${props => `${props.x}px`};
`;

export default POITooltip;
