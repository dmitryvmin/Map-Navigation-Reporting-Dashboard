import GGConsts from '../../Constants';
import _ from 'lodash';
import {
    put,
    select,
} from 'redux-saga/effects';
import {sensorsSelector} from './../Selectors';

function* loadMfcs() {

    const sensors = yield select(sensorsSelector);

    const mfc = sensors
        .filter(f => !_.isUndefined(f))
        .map(s => s.manufacturer);

    const data = _.uniq(mfc);

    yield put({type: GGConsts.MFC_MAP, data });
    yield put({type: GGConsts.MFC_SELECTED, mfc_selected: data });

}

export default loadMfcs;
