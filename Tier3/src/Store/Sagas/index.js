import GGConsts from '../../Constants';
import {
    all,
    put,
    call,
    fork,
    takeLatest,
    takeEvery,
    throttle
} from 'redux-saga/effects';

import updateNav from './updateNav';
import getGeo from './getGeo';
import updateHover from './updateHover';
import updateMetric from './updateMetric';
import loadSensors from './loadSensors';
import updateTimeframe from './updateTimeframe';
import updateDevice from './updateDevice';
import updateMfc from './updateMfc';

// Watches for Saga actions
export function* watcherSaga() {
    yield all([
        takeLatest(GGConsts.API_CALL_REQUEST, workerSaga),

        // These actions effect displayed data, call composeDisplayData
        takeLatest(GGConsts.UPDATE_TIMEFRAME, updateTimeframe),
        takeLatest(GGConsts.UPDATE_DEVICE_TYPE, updateDevice),
        takeLatest(GGConsts.UPDATE_NAV, updateNav),
        takeLatest(GGConsts.UPDATE_METRIC, updateMetric),
        // TODO: manufacturers list will be created from the fetched sensor data
        takeLatest('UPDATE_MANUFACTURER', updateMfc),

        takeLatest(GGConsts.NAV_HOVER, updateHover),
        // yield throttle(100, GGConsts.NAV_HOVER, updateHover),
    ]);
}

// Initialized when the App first loads
export function* startupSaga() {

    // TODO: Redux-Persist logic will go here to check if data has been fetched and formatted

    // Load country data and save to store
    const data = yield getGeo('country_selected');
    yield put({type: GGConsts.GEO_MAP, data: {'countries': data}});

    // Update navigation
    yield updateNav({'country_selected': 'Nigeria'});

    // Sensor data is fetched, save to store, formatted for visualization views
    yield loadSensors();
}

// For any side-effects we want to add to the API calls
export function* workerSaga() {
    return;
}