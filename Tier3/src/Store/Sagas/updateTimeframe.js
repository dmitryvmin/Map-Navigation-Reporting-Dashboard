import GGConsts from '../../Constants';
import {
    put,
    call,
} from 'redux-saga/effects';
import composeDisplayData from './composeDisplayData';

function* updateTimeframe(action) {
    const {timeframe_selected} = action;

    yield put({
        type: GGConsts.TIMEFRAME_SELECTED,
        timeframe_selected,
    });

    // ## Update Data
    const display_data = yield call(composeDisplayData);
    yield put({type: GGConsts.DISPLAY_DATA, display_data });
}

export default updateTimeframe;
