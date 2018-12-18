import _ from 'lodash';
import { put } from 'redux-saga/effects';
import GGConsts from '../../Constants';
import { navigationMap } from './../../Utils';
import getTier from './getTier';
import getNav from './getNav';
import getViewport from './getViewport';
import getMapLayers from './getMapLayers';

/**
 * When the navigation changes, this computes and updates the state
 * @param {object}
 */
function* updateByLoc( action ) {
    const { type, ...nav } = action;
    const navType = _.first(_.keys(nav));
    const navValue = _.first(_.values(nav));

    if (!navValue || !navType) {
        console.log(`%c something wrong with the update action: ${action}`, 'background: #c50018; color: white; display: block;');
    }

    // ## The update action properties can be found in the navObj map
    const navMap = _.first(navigationMap.filter(n => n.type === navType));

    // ## Set Tier
    const nav_tier = getTier(navMap, navValue);
    yield put({ type: GGConsts.NAV_TIER, nav_tier });

    // ## Update Navigation
    const navigation = yield getNav(navMap, navValue);
    yield put({ type: GGConsts.NAVIGATION, navigation });

    // ## Update Map position, zoom
    const map_viewport = yield getViewport(nav_tier, navigation);
    yield put({ type: GGConsts.MAP_VIEWPORT, map_viewport });

    // Update Map style
    // const map_style = updateMapStyle(nav_tier, navigation);
    // yield put({ type: GGConsts.MAP_STYLE, map_style });

    // Update Layers
    // const layers = getMapLayers(nav_tier, navigation);

}

export default updateByLoc;
