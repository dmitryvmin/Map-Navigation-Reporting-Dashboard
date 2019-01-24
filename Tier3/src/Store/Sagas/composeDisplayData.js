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
    thresholdSelector,
} from './../Selectors';

import {
    getNMap,
    getNMapChild,
    getGeoJson,
} from './../../Utils';

import {
    filterSensorsByLoc,
    filterSensorsByMfc,
    reduceSensorsByFilter,
    makeColumn,
    composePercentiles
} from './../../Utils/DataUtils';

/**
 *  Saga responsible for formatting data for the Map / Table views
 *  @param { object } dataParam - if a dataParam is provided we can assume other params haven't changed
*/
function* composeDisplayData( dataParam ) {

    // ### Current State
    const sensors = yield select(sensorsSelector);
    const metricsThreshold = yield select(thresholdSelector);

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
        return null;
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

    if (tier === GGConsts.COUNTRY_LEVEL) {
        columns.push(makeColumn(childNM.map));
        columns.push(makeColumn(metricSelected));
        columns.push(makeColumn('Manufacturers'));
        columns.push(makeColumn('Total Devices'));
    }
    else if (tier === GGConsts.STATE_LEVEL) {
        columns.push(makeColumn(childNM.map));
        columns.push(makeColumn(metricSelected));
        columns.push(makeColumn('Manufacturers'));
        columns.push(makeColumn('Total Devices'));
    }
    else if (tier === GGConsts.LGA_LEVEL) {
        columns.push(makeColumn(childNM.map));
        columns.push(makeColumn(metricSelected));
        columns.push(makeColumn('Manufacturers'));
        columns.push(makeColumn('Total Devices'));
    }
    else if (tier === GGConsts.FACILITY_LEVEL) {
        columns.push(makeColumn(metricSelected));
        columns.push(makeColumn('Manufacturers'));
        columns.push(makeColumn('model'));
    }

    // ### Cells
    let cells = rows.reduce((acc, cur) => {

        let id = crypto.getRandomValues(new Uint32Array(4)).join('-');
        let name = '-';
        let model = '-';
        let devices = '-';
        let alarms = '-';
        let holdover = '-';
        let mfc = '-';
        let regionType;
        let regionName;
        let location;
        let sensorsFiltered = [...sensors];

        if (tier === GGConsts.COUNTRY_LEVEL || tier === GGConsts.STATE_LEVEL) {

            location = cur.properties[childNM.code];
            sensorsFiltered = filterSensorsByLoc(sensorsFiltered, childNM.index, location);
            sensorsFiltered = filterSensorsByMfc(sensorsFiltered, mfcSelected);

            regionType = childNM.map;
            regionName = cur.properties[childNM.code];

            if (sensorsFiltered.length) {

                devices = sensorsFiltered.length;
                alarms = reduceSensorsByFilter(sensorsFiltered, 'metrics.alarm_count');
                holdover = reduceSensorsByFilter(sensorsFiltered, 'metrics.holdover_mean');
                mfc = reduceSensorsByFilter(sensorsFiltered, 'manufacturer');

            }
        }
        else if (tier === GGConsts.LGA_LEVEL) {

            location = cur.facility.location;
            sensorsFiltered = sensorsFiltered.filter(f => f.location === location);
            sensorsFiltered = filterSensorsByMfc(sensorsFiltered, mfcSelected);

            regionType = childNM.map;
            regionName = cur.facility.name;

            if (sensorsFiltered.length) {

                devices = sensorsFiltered.length;
                alarms = cur.metrics.alarm_count;
                holdover = cur.metrics.holdover_mean;
                mfc = cur.manufacturer;
                id = cur.id;
                name = cur.facility.name;

            }
        }
        else if (tier === GGConsts.FACILITY_LEVEL) {
            location = cur.facility.location;

            if (mfcSelected.includes(cur.manufacturer)) {
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
            'Manufacturers': mfc,
            'Total Devices': devices,
            location,
            id,
            name,
            model,
        });

        return acc;

    }, []);

    console.log('@@@', metricsThreshold);

    cells = composePercentiles(cells, metricSelected, metricsThreshold);

    return {columns, cells, rows};

}

export default composeDisplayData;