import GGConsts from '../../Constants';
import { put } from 'redux-saga/effects';
import composeDisplayData from './composeDisplayData';

function* updateMetric(action) {
    const { metric_selected } = action;

    yield put({ type: GGConsts.METRIC_SELECTED, metric_selected });

    yield composeDisplayData();
}

export default updateMetric;
