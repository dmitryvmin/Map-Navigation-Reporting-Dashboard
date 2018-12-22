import GGConsts from '../../Constants';
import {
    select,
    put
} from 'redux-saga/effects';

import {
    sensorsSelector,
    navSelector,
    tierSelector,
    metricSelector
} from './../Selectors';

import {
    getNMap,
    getNMapChild,
    getGeoJson,
} from './../../Utils';

/**
 *  Saga responsible for formatting data for the Map / Table views
 *  @param { object } dataParam - if a dataParam is provided we can assume other params haven't changed
*/
function* composeDisplayData( dataParam ) {

    // The clean data is saved in the SENSORS_MAP (dataReducer)
    const sensors = yield select(sensorsSelector);

    // DataParams that effects how the state should be transformed:
    // 1. Location
    const navigation = yield select(navSelector);
    const tier = yield select(tierSelector);

    // 2. Metric
    const metric = yield select(metricSelector);

    // 3. Filter - Device Type
    // 4. Filter - Device Manufacturer
    // 5. Timeframe

    const curNM = getNMap(tier, 'tier'); // current navigation map
    const childNM = getNMapChild(tier, 'tier'); // child navigation map

    // Temporary
    if (childNM.type === 'facility_selected') {
        return null;
    }

    // Columns
    let columns = [];

    const getColumn = (id) => {
        return {
            id,
            numeric: false,
            disablePadding: false,
            label: id,
        }
    };

    columns.push(getColumn(metric));
    columns.push(getColumn(childNM.map))

    // Rows
    let data = getGeoJson(childNM.type);
    let rows;

    if (curNM.type !== 'All') {
        rows = data.filter(f => f.properties[curNM.code] === navigation[curNM.type]);
    }

    // Cells
    // TODO: Data sorting/filtering by DataParams will happen here...
    let cells = rows.reduce((acc, cur) => {
        let name = cur.properties[childNM.code];
        acc.push({
            [childNM.map]: name,
            ['alarms']: 0,
        });
        return acc;
    }, []);


    yield put({type: GGConsts.DISPLAY_DATA, display_data: {columns, rows, cells}});

    return;

}

export default composeDisplayData;