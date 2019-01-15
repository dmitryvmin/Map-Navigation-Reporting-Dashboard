import GGConsts from '../../Constants';
import _ from 'lodash';
import {
    select,
    put
} from 'redux-saga/effects';
import {sensorsSelector} from './../Selectors';

function* updateMfc() {

    const sensors = yield select(sensorsSelector);
    const mfcs = sensors.map(s => s.manufacturer);
    const data = _.uniq(mfcs);

    yield put({type: GGConsts.MFC_MAP, data });

}

export default updateMfc;
