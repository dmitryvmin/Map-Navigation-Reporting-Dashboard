import GGConsts from '../../Constants';
import composeDisplayData from './composeDisplayData';
import getMarkers from './getMarkers';

import {
    put,
    call,
} from 'redux-saga/effects';

export default function* updateSettings(action) {

    const {metrics_threshold} = action;

    yield put({type: GGConsts.SETTINGS, metrics_threshold });

    // ## Update Data
    const display_data = yield call(composeDisplayData); // TODO: pass the type of update as the second arg - dataParam
    yield put({type: GGConsts.DISPLAY_DATA, display_data });

    const markers = yield call(getMarkers);
    yield put({type: GGConsts.MARKERS, markers});

}

