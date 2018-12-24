import _ from 'lodash';
import {
    put,
    call
} from 'redux-saga/effects';
import GGConsts from '../../Constants';
import {getNMap} from './../../Utils';
import getTier from './getTier';
import getNav from './getNav';
import getViewport from './getViewport';
import composeDisplayData from './composeDisplayData';
import getMarkers from './getMarkers';
// import updateMapboxStyle from './updateMapboxStyle';
import getDeckLayers from './getDeckLayers';

/**
 * When the navigation changes, this computes and updates the state
 * @param {object}
 */
function* updateNav(action) {
    const {type, ...nav} = action;
    const navType = _.first(_.keys(nav));
    const navValue = _.first(_.values(nav));

    if (!navValue || !navType) {
        console.log(`%c something wrong with the update action: ${action}`, 'background: #c50018; color: white; display: block;');
    }

    // ## The update action properties can be found in the navObj map
    const NM = getNMap(navType, 'type');

    // ## Set Tier
    const nav_tier = getTier(NM, navValue);
    yield put({type: GGConsts.NAV_TIER, nav_tier});

    // ## Update Navigation
    const navigation = yield call(getNav, NM, navValue);
    yield put({type: GGConsts.NAVIGATION, navigation});

    // ## Update Data
    const display_data = yield call(composeDisplayData);
    yield put({type: GGConsts.DISPLAY_DATA, display_data });

    // ## Update Markers
    const markers = yield call(getMarkers);
    yield put({type: GGConsts.MARKERS, markers});

    // ## Update Map position, zoom
    const map_viewport = yield call(getViewport, nav_tier, navigation);
    yield put({type: GGConsts.MAP_VIEWPORT, map_viewport});

    // Update Map style
    // const map_style = updateMapboxStyle(nav_tier, navigation);
    // yield put({ type: GGConsts.MAP_STYLE, map_style });

    // Update Layers
    // const active_layers = yield call(getDeckLayers);
    // yield put({type: GGConsts.ACTIVE_LAYERS, active_layers});
}

export default updateNav;
