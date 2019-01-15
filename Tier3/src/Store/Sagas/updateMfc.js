import GGConsts from '../../Constants';
import _ from 'lodash';
import {
    select,
    put
} from 'redux-saga/effects';
import {
    sensorsSelector,
    mfcSelector
} from './../Selectors';

export function* loadMfcs() {

    const sensors = yield select(sensorsSelector);
    const mfc = sensors.map(s => s.manufacturer);
    const data = _.uniq(mfc);

    yield put({type: GGConsts.MFC_MAP, data });
    yield put({type: GGConsts.MFC_SELECTED, mfc_selected: data });

}

export function* updateMfc(action) {

    const {mfc} = action;
    const selected = yield select(mfcSelector);
    let new_selected;

    if (selected.includes(mfc)) {
        new_selected = selected.filter(f => f !== mfc)
    } else {
        new_selected = [...selected, mfc]
    }

    yield put({type: GGConsts.MFC_SELECTED, mfc_selected: new_selected });

}

