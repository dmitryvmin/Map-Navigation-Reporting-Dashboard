import { put, call, takeLatest, takeEvery, throttle } from 'redux-saga/effects';
import GGConsts from '../../Constants';
import updateByLoc from './updateByLoc';
import getGeo from './getGeo';
import fetchData from './apiSaga';

// rootSaga
export function* watcherSaga() {
    yield takeLatest(GGConsts.API_CALL_REQUEST, workerSaga);
    yield takeLatest(GGConsts.UPDATE_NAV, updateByLoc);
    yield takeLatest(GGConsts.UPDATE_METRIC, metricSaga);
    yield takeLatest(GGConsts.NAV_HOVER, hoverSaga);
    // yield throttle(50, GGConsts.NAV_HOVER, hoverSaga);
}

// Initialized when the App first loads.
// TODO: Redux-persist logic will go here
export function* initSaga() {
    const data = yield getGeo('country_selected');
    yield put({ type: GGConsts.GEO_MAP, data: { 'countries': data } });
    yield updateByLoc({ 'country_selected': 'Nigeria' });
}

// get Sensor  Data
const sensors_endpoint = `${GGConsts.API}:${GGConsts.REPORTING_PORT}/sensor/state`;

export function* sensorDataSaga() {
    const sensors = yield fetchData(sensors_endpoint, GGConsts.RT_HEADER);

    // TODO: build data maps

    yield put({ type: GGConsts.SENSORS_MAP, [GGConsts.SENSORS_MAP]: sensors });
}

function* hoverSaga(action) {
    // TODO: add hover logic here. Move it out of Map.js and Table.js
    return;
}

function* metricSaga(action) {
    const { metric_selected } = action;

    // TODO: filter sensors data by the selected metric...

    yield put({ type: GGConsts.METRIC_SELECTED, metric_selected });
}

// makes the api call when watcher saga sees the action
function* workerSaga({uri, config, resource}) {
    try {
        const response = yield call(fetchData, uri, config);
        const data = response.data;

        // dispatch a success action to the store
        yield put({ type: GGConsts.API_CALL_SUCCESS });

        // store API response in the appropriate store map
        yield put({ type: resource, data });

    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({ type: GGConsts.API_CALL_FAILURE, error });
    }
}