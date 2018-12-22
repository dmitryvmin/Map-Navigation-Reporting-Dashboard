import GGConsts from '../../Constants';
import axios from "axios";
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
function* fetchUpdateData({uri, config, resource}) {
    try {
        const response = yield call(fetchData, uri, config);
        const data = response.data;

        // dispatch a success action to the store
        yield put({type: GGConsts.API_CALL_SUCCESS});

        // store API response in the appropriate store map
        yield put({type: resource, data});

    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({type: GGConsts.API_CALL_FAILURE, error});
    }
}

export {
    fetchData,
    fetchUpdateData,
};
