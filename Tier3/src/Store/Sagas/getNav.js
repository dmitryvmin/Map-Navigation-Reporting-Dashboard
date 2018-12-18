import _ from 'lodash';
import { select, put } from 'redux-saga/effects';
import GGConsts from '../../Constants';
import { navigationMap } from './../../Utils';
import { getNavState } from './../Selectors';
import getGeo from './getGeo';

/**
 * Get
 * @param {number}
 * @param {number}
 * @returns {number}
 */

function* getNav(curNav, value) {
    // We are only concerned with nav elements down the chain

    const childNavs = navigationMap.filter(n => n.index > curNav.index);
    const navState = yield select(getNavState);

    // If current nav has a specific location selected, Set immediate child to `all`
    if (childNavs.length && value !== 'All') {

        // remove the child from the childNavs array because the rest of the children will be turned off
        const child = _.first(childNavs.splice(0,1));

        const data = yield getGeo(child.type, value);
        yield put({ type: GGConsts.GEO_MAP, data: {[child.map]: data} });

        navState[child.type] = 'All';
    }

    // Set rest to null if needed
    if (childNavs.length) {
        for (let nav of childNavs) {
            // if item is not null, set to null
            if (!_.isNull(navState[nav.state])) {
                navState[nav.type] = false;
            }
        }
    }
    // update the explicitly selected nav
    navState[curNav.type] = value;

    return navState;
}

export default getNav;
