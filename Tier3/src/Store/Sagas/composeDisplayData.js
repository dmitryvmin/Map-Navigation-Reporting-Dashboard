import _ from 'lodash';
import {select} from 'redux-saga/effects';

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
    getRandomFridge,
} from './../../Utils';
// import alarmsData from '../../Data/alarms.json';

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
    const curNM = getNMap(tier, 'tier'); // current navigation map
    const curLocation = navigation[curNM.type];
    const childNM = getNMapChild(tier, 'tier'); // child navigation map

    // 2. Metric
    const metric = yield select(metricSelector);

    // 3. Filter - Device Type
    // 4. Filter - Device MFC
    // 5. Timeframe

    if (!sensors || !navigation || !tier || !metric) {
        return;
    }

    let filterData;

    // 1. Filter sensors by location
    filterData = sensors.filter(f => f.facility.regions[curNM.index] === curLocation);

    // 2. Filter by device type
    // 3. Filter by MFC
    // 4. Filter by Timeframe


    // ### Rows
    // True? rows don't necessarily depend on the sensors data - we still want to display all the possible regions even if there are no sensors therein
    let rows;

    if (childNM.type === 'facility_selected') {

        rows = filterData;

    } else {

        let data = getGeoJson(childNM.type);

        if (curNM.type !== 'All') {
            rows = data.filter(f => f.properties[curNM.code] === navigation[curNM.type]);
        }
    }

    // ### Columns
    // Columnds depend on the Tier and the Metric
    let columns = [];

    const getColumn = (id) => {
        return {
            id,
            numeric: false,
            disablePadding: false,
            label: id,
        }
    };

    columns.push(getColumn(childNM.map));
    columns.push(getColumn(metric));
    columns.push(getColumn('Manufacturers'));

    if (tier === 'COUNTRY_LEVEL') {
        columns.push(getColumn('Total Devices'));
    }
    if (tier === 'STATE_LEVEL') {
        columns.push(getColumn('Total Devices'));
    }
    // if (tier === 'LGA_LEVEL') {
    //     columns.push(getColumn('State Data'));
    // }
    // if (tier === 'FACILITY_LEVEL') {
    //     columns.push(getColumn('State Data'));
    // }


    // debugger;
    // ### Cells
    let cells = rows.reduce((acc, cur) => {

        // TODO: reduce children sensors...

        let name = cur.properties[childNM.code];
        const fridge = getRandomFridge();
        acc.push({
            [childNM.map]: name,
            // For testing:
            'Alarms': _.random(0, 30), // original Random data :)

            // TODO: temp...
            'AlarmsByDay': Array.from({length: 40}, () => Math.floor(Math.random() * 2)),

            'Holdover': _.random(0, 10), // original Random data :)
            'chart': Math.random() >= 0.7, // original Random boolean
            // start of new Random but more real data (structure wise)
            // these cells don't respect this structure.  Will maybe have to create this 'random' data separately 
            // and amalgamate it here in a proper method.
            "id": crypto.getRandomValues(new Uint32Array(4)).join('-'),
            "Manufacturers": fridge.manufacturer,
        });
        return acc;
    }, []);

    return {columns, cells};

}

export default composeDisplayData;