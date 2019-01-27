import React, {Component} from 'react';
import GGConsts from '../Constants';
import styled, {css} from 'styled-components';
import Card from '@material-ui/core/Card';

const colors = {
    green: GGConsts.COLOR_GREEN,
    orange: GGConsts.COLOR_YELLOW,
    red: GGConsts.COLOR_RED,
}

class POITooltip extends Component {

    render() {
        const {
            hover,
            cohort,
            markers,
        } = this.props;

        // TODO: move this out of render ###
        const marker = markers.filter(f => f.name === hover.value);
        let metricsPie = null
        if (marker && marker[0].metricsPie) {
            metricsPie = marker[0].metricsPie;
        }
        // TODO: ###

        return (
            <Tooltip>
                <Top>
                    {(cohort.devicesPercentile)
                        ? <>
                        <Left>
                            {
                                ['top', 'middle', 'bottom'].map(c =>
                                    <Row key={`tooltip-circle-${c}`}>
                                        <CircleContainer>
                                            <Circle size={c}/>
                                        </CircleContainer>
                                        {
                                            (cohort.devicesPercentile === c)
                                                ? <Span top={cohort.devicesPercentile === 'middle' ? "true" : "false"}>
                                                    - {hover.value}
                                                  </Span>
                                                : null
                                        }
                                    </Row>
                                )
                            }
                        </Left>
                        <Right>
                            {metricsPie && Object.keys(metricsPie).map(m =>
                                <Row key={`tooltip-${m}`}>
                                    <CircleContainer>
                                        <Circle
                                            size="device"
                                            color={colors[m]}
                                        />
                                    </CircleContainer>
                                    <Devices>{metricsPie[m]}</Devices>
                                </Row>
                            )}
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
}

const Circle = styled.div`
    background-color: ${({color}) => color ? color : 'black'}; 
    border-radius: 50%;
    
    ${props => (props.size === 'top') && css`
        width: 15px;
        height: 15px; 
    `}
    ${props => (props.size === 'middle') && css`
        width: 9px;
        height: 9px; 
        margin-top: 4px; 
    `}
    ${props => (props.size === 'bottom') && css`
        width: 5px;
        height: 5px; 
    `} 
    ${props => (props.size === 'device') && css`
        width: 9px;
        height: 9px;  
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
    margin-right: 0.25em;
`;
const Top = styled.div`
    width: 180px;
    height: 45px;
    display: flex;
`;
const Devices = styled.div`
    font-size: 0.75em;
    width: 30px;
`;
const Left = styled.div`
    flex: 65%;
`;
const Right = styled.div`
    flex: 35%;
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
