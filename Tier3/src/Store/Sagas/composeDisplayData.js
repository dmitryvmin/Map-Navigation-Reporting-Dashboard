import _ from 'lodash';
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

    if (!sensors || !navigation || !tier || !metric) {
        return;
    }

    const curNM = getNMap(tier, 'tier'); // current navigation map
    const childNM = getNMapChild(tier, 'tier'); // child navigation map



    let rows;

    // Temporary
    if (childNM.type === 'facility_selected') {

        // TODO: this is random data..
        rows = [

            {
                geometry: {type: "MultiPolygon", coordinates: Array(1)},
                properties: {
                    admin1Name: "Abia",
                    admin1Pcod: "NG001",
                    admin1RefN: "Abia",
                    admin1AltN: null,
                    admin1Al_1: null
                },
                type: "Feature"
            },
            {
                geometry: {type: "MultiPolygon", coordinates: Array(1)},
                properties: {
                    admin1Name: "Abia",
                    admin1Pcod: "NG001",
                    admin1RefN: "Abia",
                    admin1AltN: null,
                    admin1Al_1: null
                },
                type: "Feature"
            }
        ]

    } else {

        // ### Rows
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
    columns.push(getColumn(childNM.map));
    columns.push(getColumn('Manufacturers'));

    if (tier === 'COUNTRY_LEVEL') {
        columns.push(getColumn('Country Data'));
    }
    if (tier === 'STATE_LEVEL') {
        columns.push(getColumn('State Data'));
    }
    if (tier === 'LGA_LEVEL') {
        columns.push(getColumn('LGA Data'));
    }




    // ### Cells
    // TODO: Data sorting/filtering by DataParams will happen here...

    let cells = rows.reduce((acc, cur) => {
        let name = cur.properties[childNM.code];
        acc.push({
            [childNM.map]: name,
            // For testing:
            ['Alarms']: _.random(0, 30),
            ['Holdover']: _.random(0, 10),
            ['chart']: Math.random() >= 0.7,
        });
        return acc;
    }, []);

    return {columns, rows, cells};

}

export default composeDisplayData;