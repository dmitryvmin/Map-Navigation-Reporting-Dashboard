import GGConsts from '../../Constants';
import _ from 'lodash';
import {
    call,
    put
} from 'redux-saga/effects';
import {fetchSaga} from './fetch';
import loadFakeSensors from './loadFakeSensors';
import fakeSensors from './../../Data/fakeSensors.json';

// TODO: Sensors Saga will be responsible for refreshing/hydrating sensors Map and Data
function* loadSensor() {

    // const fakeSensors = yield call(loadFakeSensors, 100);

    const realSensors = yield fetchSaga({
        uri: GGConsts.SENSORS_ENDPOINT,
        config: GGConsts.RT_HEADER,
        key: 'fridges',
    });

    let data = [...realSensors]  //for fake data... const data = [...fakeSensors, ...realSensors]
        .filter(f => !_.isNull(f) && !_.isUndefined(f))
        .filter(f => !_.isUndefined(f.facility))
        // TODO: remove filter below, filtering out Kano and Yobe for demo
        .filter(f => f.facility.regions.tier1 !== 'Kano' && f.facility.regions.tier1 !== 'Yobe');

    yield put({type: GGConsts.SENSORS_MAP, data});

}

export default loadSensor;
