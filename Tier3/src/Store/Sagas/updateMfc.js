import GGConsts from '../../Constants';
import composeDisplayData from './composeDisplayData';
import getMarkers from './getMarkers';

import {
    select,
    put,
    call,
} from 'redux-saga/effects';

import {mfcSelector} from './../Selectors';

function* updateMfc(action) {

    const {mfc} = action;
    const selected = yield select(mfcSelector);
    let new_selected;

    if (selected.includes(mfc)) {
        new_selected = selected.filter(f => f !== mfc)
    } else {
        new_selected = [...selected, mfc]
    }

    yield put({type: GGConsts.MFC_SELECTED, mfc_selected: new_selected });

    // ## Update Data
    const display_data = yield call(composeDisplayData); // TODO: pass the type of update as the second arg - dataParam
    yield put({type: GGConsts.DISPLAY_DATA, display_data });

    // ## Update Map
    const markers = yield call(getMarkers);
    yield put({type: GGConsts.MARKERS, markers});

}

export default updateMfc;
