import _ from 'lodash';
import { select, put } from 'redux-saga/effects';
import GGConsts from '../../Constants';
import { navigationMap } from './../../Utils';
import { navSelector } from './../Selectors';
import getGeo from './getGeo';

/**
 * Get
 * @param {number}
 * @param {number}
 * @returns {number}
 */

function* getNav(curNM, value) {
    // We are only concerned with nav elements down the chain

    const childNM = navigationMap.filter(n => n.index > curNM.index);
    const navState = yield select(navSelector);

    // If current nav has a specific location selected, Set immediate child to `all`
    if (childNM.length && value !== 'All') {

        // remove the child from the childNavs array because the rest of the children will be turned off
        const child = _.first(childNM.splice(0,1));

        const data = yield getGeo(child.type, value);
        yield put({ type: GGConsts.GEO_MAP, data: {[child.map]: data} });

        navState[child.type] = 'All';
    }

    // Set rest to null if needed
    if (childNM.length) {
        for (let nav of childNM) {
            // if item is not null, set to null
            if (!_.isNull(navState[nav.state])) {
                navState[nav.type] = false;
            }
        }
    }
    // update the explicitly selected nav
    navState[curNM.type] = value;

    return navState;
}

export default getNav;
