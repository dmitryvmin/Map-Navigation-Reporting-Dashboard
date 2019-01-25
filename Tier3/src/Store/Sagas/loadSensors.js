import GGConsts from '../../Constants';
import _ from 'lodash';
import {
    call,
    put
} from 'redux-saga/effects';
import {fetchSaga} from './fetch';
import loadFakeSensors from './loadFakeSensors';
import fakeSensors from './../../Data/fakeSensors.json';

// TODO: Sensors Saga will be responsible for refreshing/hydrating sensors Map and Data - will be called at intervals
function* loadSensor() {

    // const fakeSensors = yield call(loadFakeSensors, 100);

    const realSensors = yield fetchSaga({
        uri: GGConsts.SENSORS_ENDPOINT,
        config: GGConsts.RT_HEADER,
        key: 'fridges',
    });
debugger;
    const data = [...fakeSensors, ...realSensors]
        .filter(f => !_.isNull(f) && !_.isUndefined(f))
        .filter(f => !_.isUndefined(f.facility));

    yield put({type: GGConsts.SENSORS_MAP, data});

}

export default loadSensor;
