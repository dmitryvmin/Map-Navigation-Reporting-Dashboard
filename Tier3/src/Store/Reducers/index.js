import errorsReducer from './errors';
import navigationReducer from './navigation';
import interactionReducer from './ui';
import APIreducer from './api';
import dataReducer from './data';
import mapReducer from './map';
import metricReducer from './metric';
import displayReducer from './display';
import timeframeReducer from './timeframe';
import deviceReducer from './device';
import markersReducer from './markers';
import layersReducer from './layers';
import mfcReducer from './mfc';
import bboxReducer from './bbox';

const reducers = {
    errorsReducer,
    navigationReducer,
    interactionReducer,
    APIreducer,
    dataReducer,
    mapReducer,
    metricReducer,
    displayReducer,
    timeframeReducer,
    deviceReducer,
    markersReducer,
    layersReducer,
    mfcReducer,
    bboxReducer,
};

export default reducers;
