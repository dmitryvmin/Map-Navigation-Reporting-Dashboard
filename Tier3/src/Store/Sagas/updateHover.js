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

function updateHover(action) {
    return;
}

// TODO: refactor - same as click
// const onLayerHover = function* ({x, y, object}) {
//
//     if (!object) {
//         return null;
//     }
//
//     const tier = yield select(tierSelector);
//     const NMchild = getNMapChild(tier, 'tier');
//
//     let value = object.properties[NMchild.code];
//
//     if (!value) {
//         const NMparent = getNMap(tier, 'tier');
//         value = object.properties[NMparent.code];
//     }
//
//     if (!value) {
//         console.log(`%c something wrong with the hovered location: ${value}`, 'background: #c50018; color: white; display: block;');
//     } else {
//         return {value, x, y};
//     }
// }

export default updateHover;
