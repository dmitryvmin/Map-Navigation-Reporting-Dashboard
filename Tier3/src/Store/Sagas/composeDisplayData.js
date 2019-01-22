import _ from 'lodash';
import {select} from 'redux-saga/effects';
import GGConsts from './../../Constants';

import {
    sensorsSelector,
    navSelector,
    tierSelector,
    metricSelector,
    mfcSelector,
    // deviceTypeSelector,
    timeframeSelector,
} from './../Selectors';

import {
    getNMap,
    getNMapChild,
    getGeoJson,
} from './../../Utils';

const filterSensorsByLoc = (sensors, index, location) => {
    const filtered = sensors.filter(f => f.facility.regions[index] === location);
    return filtered;
}

const filterSensorsByMfc = (sensors, mfc) => {
    const filtered = sensors.filter(f => mfc.includes(f.manufacturer));
    return filtered;
}

const reduceSensorsByFilter = (sensors, metric) => {
    const reduced = sensors.reduce((a, c) => {
        a.push(_.get(c, metric));
        return a;
    }, []);

    return reduced;
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
    const childNM = getNMapChild(tier, 'tier');

    // 2. Metric
    const metricSelected = yield select(metricSelector);

    // 3. Filter - Device Type
    // const deviceType = yield select(deviceTypeSelector);

    // 4. Filter - Device MFC
    const mfcSelected = yield select(mfcSelector);

    // 5. Timeframe
    let timeframe = yield select(timeframeSelector);
    timeframe = (timeframe === 'All') ? 'All' : timeframe.match(/\d+/)[0];

    if (!sensors || !navigation || !tier || !metricSelected) {
        return;
    }

    // ### Rows
    let rows;

    if (tier === GGConsts.COUNTRY_LEVEL || tier === GGConsts.STATE_LEVEL) {
        let data = getGeoJson(childNM.type);
        rows = data.filter(f => f.properties[curNM.code] === navigation[curNM.type]);
    }
    else if (tier === GGConsts.LGA_LEVEL) {
        const filtered = filterSensorsByLoc(sensors, curNM.index, curLocation);
        rows = _.uniqBy(filtered, 'manufacturer');
    }

    else if (tier === GGConsts.FACILITY_LEVEL) {
        rows = sensors.filter(f => f.facility.name === curLocation);
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

    if (tier === GGConsts.COUNTRY_LEVEL) {
        columns.push(getColumn(childNM.map));
        columns.push(getColumn(metricSelected));
        columns.push(getColumn('Manufacturers'));
        columns.push(getColumn('Total Devices'));
    }
    else if (tier === GGConsts.STATE_LEVEL) {
        columns.push(getColumn(childNM.map));
        columns.push(getColumn(metricSelected));
        columns.push(getColumn('Manufacturers'));
        columns.push(getColumn('Total Devices'));
    }
    else if (tier === GGConsts.LGA_LEVEL) {
        columns.push(getColumn(childNM.map));
        columns.push(getColumn(metricSelected));
        columns.push(getColumn('Manufacturers'));
        columns.push(getColumn('Total Devices'));
    }
    else if (tier === GGConsts.FACILITY_LEVEL) {
        columns.push(getColumn(metricSelected));
        columns.push(getColumn('Manufacturers'));
        columns.push(getColumn('model'));
    }

    // ### Cells
    let cells = rows.reduce((acc, cur) => {

        let id = crypto.getRandomValues(new Uint32Array(4)).join('-');
        let name = '-';
        let model = '-';
        let alarms;
        let holdover;
        let regionType;
        let regionName;
        let location;
        let mfc;
        let sensorsFiltered = [...sensors];

        if (tier === GGConsts.COUNTRY_LEVEL || tier === GGConsts.STATE_LEVEL) {

            location = cur.properties[childNM.code];
            sensorsFiltered = filterSensorsByLoc(sensorsFiltered, childNM.index, location);
            sensorsFiltered = filterSensorsByMfc(sensorsFiltered, mfcSelected);

            regionType = childNM.map;
            regionName = cur.properties[childNM.code];

            if (sensorsFiltered.length) {

                alarms = reduceSensorsByFilter(sensorsFiltered, 'metrics.alarm_count');
                holdover = reduceSensorsByFilter(sensorsFiltered, 'metrics.holdover_mean');
                mfc = reduceSensorsByFilter(sensorsFiltered, 'manufacturer');

            } else {

                alarms = '-';
                holdover = '-';
                mfc = '-';

            }

        }
        else if (tier === GGConsts.LGA_LEVEL) {

            location = cur.facility.location;

            if (mfcSelected.includes(mfcSelected)) {
                sensorsFiltered = cur;
            } else {
                sensorsFiltered = [];
            }

            regionType = 'facilities';
            regionName = cur.facility.name;
            alarms = cur.metrics.alarm_count;
            holdover = cur.metrics.holdover_mean;
            mfc = cur.manufacturer;
            id = cur.id;
            name = cur.facility.name;

        }
        else if (tier === GGConsts.FACILITY_LEVEL) {
            location = cur.facility.location;

            if (mfcSelected.includes(mfcSelected)) {
                sensorsFiltered = cur;
            } else {
                sensorsFiltered = [];
            }

            regionType = 'device';
            regionName = cur.facility.name;
            alarms = cur.metrics.alarm_count;
            holdover = cur.metrics.holdover_mean;
            mfc = cur.manufacturer;
            id = cur.id;
            name = cur.facility.name;
            model = cur.model;
        }

        acc.push({
            [regionType]: regionName,
            'Alarms': _.isArray(alarms) ? _.sum(alarms) : alarms,
            'AlarmsByDay': (alarms === '-' || timeframe === 'All') ? '-' : Array.from({length: timeframe}, () => Math.floor(Math.random() * 2)),
            'Holdover': _.isArray(holdover) ? _.mean(holdover) : holdover,
            'id': id,
            'Manufacturers': mfc,
            'chart': (alarms !== '-'),
            'location': location,
            'name': name,
            'model': model,
        });

        return acc;

    }, []);

    return {columns, cells, rows};

}

export default composeDisplayData;