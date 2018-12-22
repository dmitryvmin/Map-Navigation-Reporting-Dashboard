import GGConsts from '../../Constants';
import {
    put,
    call,
} from 'redux-saga/effects';
import composeDisplayData from './composeDisplayData';

function* updateMetric(action) {
    const {metric_selected} = action;

    yield put({
        type: GGConsts.METRIC_SELECTED,
        metric_selected,
    });

    // ## Update Data
    const display_data = yield call(composeDisplayData);
    yield put({type: GGConsts.DISPLAY_DATA, display_data });
}

export default updateMetric;
