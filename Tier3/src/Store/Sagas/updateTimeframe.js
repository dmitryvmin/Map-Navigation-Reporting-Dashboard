import GGConsts from '../../Constants';
import {
    put,
} from 'redux-saga/effects';

function* updateTimeframe(action) {
    const {timeframe_selected} = action;

    yield put({
        type: GGConsts.TIMEFRAME_SELECTED,
        timeframe_selected,
    });

}

export default updateTimeframe;
