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

const filterSensors = (sensors, index, location) => {
    const filtered = [...sensors].filter(f => f.facility.regions[index] === location);
    return filtered;
}

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
    // filterData = filterSensors(sensors, curNM.index, curLocation);
    // 2. Filter by device type
    // 3. Filter by MFC
    // 4. Filter by Timeframe

    // ### Rows
    // True? rows don't necessarily depend on the sensors data - we still want to display all the possible regions even if there are no sensors therein
    let rows;

    if (childNM.type === 'facility_selected') {

        rows = filterSensors(sensors, curNM.index, curLocation);

    } else {

        let data = getGeoJson(childNM.type);

        if (curNM.type !== 'All') {
            rows = data.filter(f => f.properties[curNM.code] === navigation[curNM.type]);
        }
    }

    // ### Columns
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
    columns.push(getColumn('Manufacturers'));

    if (tier === 'COUNTRY_LEVEL') {
        columns.push(getColumn(childNM.map));
        columns.push(getColumn('Total Devices'));
    }
    if (tier === 'STATE_LEVEL') {
        columns.push(getColumn(childNM.map));
        columns.push(getColumn('Total Devices'));
    }
    if (tier === 'LGA_LEVEL') {
        columns.push(getColumn(childNM.map));
        columns.push(getColumn('State Data'));
    }

    // ### Cells
    let cells = rows.reduce((acc, cur) => {

        // TODO: reduce children sensors...
        const location = cur.properties[childNM.code];
        const sensorsFiltered = filterSensors(sensors, childNM.index, location);
        const sensorsReduced = sensorsFiltered.length ? sensorsFiltered.reduce((a,c) => {
            a.push(c.metrics.alarm_count);
            return a;
        }, []) : 0;

        console.log('@@sensorsFiltered',_.first(sensorsReduced));

        let name = cur.properties[childNM.code];
        const fridge = getRandomFridge();
        acc.push({
            [childNM.map]: name,

            'Alarms': sensorsReduced,

            // TODO: temp... will pull from sensors endpoint once timeline buckets are added
            'AlarmsByDay': Array.from({length: 40}, () => Math.floor(Math.random() * 2)),

            'Holdover': _.random(0, 10), // original Random data :)
            'chart': sensorsReduced,
            "id": crypto.getRandomValues(new Uint32Array(4)).join('-'),
            "Manufacturers": fridge.manufacturer,
        });
        return acc;
    }, []);

    return {columns, cells};

}

export default composeDisplayData;