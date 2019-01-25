import React from 'react';
import GGConsts from '../Constants';
import styled from 'styled-components';
import {chunkArray} from './../Utils';

const Chiclets = ({value, days, id}) => {
    let chuncks = chunkArray(days, 10);

    return (
        <Alarm>
            <AlarmVal>
                {value}
            </AlarmVal>
            <AlarmChart>
                {chuncks.map((chunk, i) =>
                    <AlarmRow key={`alarmrow-${id}-${i}`}>
                        {chunk.map((d, i) =>
                            <AlarmCell
                                key={`alarmcell-${id}-${d}-${i}`}
                                alarm={d}
                            />
                        )}
                    </AlarmRow>
                )}
            </AlarmChart>
        </Alarm>
    )
}

const AlarmVal = styled.span`
    width: 30px; 
    text-align: right;
`;
const Alarm = styled.div`
    display: flex; 
    align-items: center;
    justify-content: center;
`;
const AlarmChart = styled.div`
     margin: 0 0 0 7px;
     width: 90px;
     line-height: 2px;
     float: right; 
`;
const AlarmRow = styled.div`
`;
const AlarmCell = styled.div`
    display: inline-block;
    width: 7px;
    height: 7px;
    margin: 1px;
    background-color: ${props => (props.alarm === null) ? GGConsts.COLOR_YELLOW : (props.alarm === 0) ? GGConsts.COLOR_GREEN : GGConsts.COLOR_RED}; 
`;

export default Chiclets;