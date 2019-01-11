import GGConsts from '../../Constants';
// import {call} from 'redux-saga/effects';
import {fetchUpdateData} from './fetch';
// import composeDisplayData from './composeDisplayData';

// Right now we are just fetching sensors data
// In case we need data from other sources,
// use this Saga to fetch and store data to store

// TODO: Sensors Saga will be responsible for refreshing/hydrating sensors Map and Data - will be called at intervals
function* loadSensor() {

    yield fetchUpdateData({
        uri: GGConsts.SENSORS_ENDPOINT,
        config: GGConsts.RT_HEADER,
        resource: GGConsts.SENSORS_MAP,
    });

    // yield composeDisplayData();

}

export default loadSensor;
