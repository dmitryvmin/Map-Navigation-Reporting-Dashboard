import GGConsts from '../../Constants';
import {
    tierSelector,
    hoverSelector,
} from './../Selectors';

import {
    select,
    put,
} from 'redux-saga/effects';

import {
    getNMapChild,
    getNMap,
} from './../../Utils';

// TODO: refactor - same as hover
function* onLayerClick({x, y, object}) {
    debugger;
    if (!object) {
        return null;
    }

    const tier = yield select(tierSelector);

    const NMchild = getNMapChild(tier, 'tier');
    let value, type;
    value = object.properties[NMchild.code];

    if (value) {
        type = NMchild.type;
    } else {
        const NMparent = getNMap(tier, 'tier');
        value = object.properties[NMparent.code];
        type = NMparent.type;
    }

    if (!value) {
        console.log(`%c something wrong with the hovered location: ${value}`, 'background: #c50018; color: white; display: block;');
    } else {
        yield put({type: GGConsts.UPDATE_NAV, [type]: value});
        // this.props.updateNav(type, value);
    }
}

export default onLayerClick;
