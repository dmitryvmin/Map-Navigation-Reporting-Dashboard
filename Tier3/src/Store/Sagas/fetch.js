import GGConsts from '../../Constants';
import axios from "axios";
import _ from 'lodash';
import {
    put,
    call
} from 'redux-saga/effects';

// Fetch - makes the api request and returns a Promise response
function* fetchData(...args) {
    const [uri, config = ''] = args;
    const response = yield axios.get(uri, config);
    return response;
}

// Fetch and Update - makes the api request and saves to the resource arg
function* fetchSaga({uri, config, key}) {

    try {
        const response = yield call(fetchData, uri, config);
        const data = _.get(response, `data.${key}`);

        // dispatch a success action to the store
        yield put({type: GGConsts.API_CALL_SUCCESS});

        return data;

    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({type: GGConsts.API_CALL_FAILURE, error});
    }
}

export {
    fetchData,
    fetchSaga,
};
