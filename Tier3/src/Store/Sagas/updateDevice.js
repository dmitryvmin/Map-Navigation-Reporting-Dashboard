import GGConsts from '../../Constants';
import {
    put,
} from 'redux-saga/effects';

function* updateDevice(action) {
    const {device_type_selected} = action;

    yield put({
        type: GGConsts.DEVICE_TYPE_SELECTED,
        device_type_selected,
    });
}

export default updateDevice;
