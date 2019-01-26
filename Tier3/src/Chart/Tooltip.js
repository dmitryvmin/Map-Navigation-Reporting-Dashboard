import React, {Component} from 'react';
import GGConsts from '../Constants';
import _ from 'lodash';
import {getNMapChild} from './../Utils';

class CustomTooltip extends Component {
    render() {
        const {
            active,
            payload,
            label,
            tier,
        } = this.props;

        if (
            !active ||
            tier === GGConsts.FACILITY_LEVEL ||
            !payload ||
            (payload && !payload[0])
        ) {
            return null;
        }

        const NM = getNMapChild(tier, 'tier');
        const item = payload[0].payload[NM.map];
        const location = payload[0].name;
        const value = _.round(payload[0].value, 2);

        return (
            <div className="custom-tooltip">
                <h4>{`${item}`}</h4>
                <p className="label">{`${location} : ${value}`}</p>
            </div>
        )
    }
}

export default CustomTooltip;
