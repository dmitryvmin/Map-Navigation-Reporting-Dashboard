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
    reduceSensorsByFilter,
    filterSensorsByLoc,
    filterSensorsByMfc,
    getTotalByFilter,
    getMeanByFilter,
    getMetricsPie,
    makeColumn,
    composePercentiles,
    getMetricKey,
    getMetricFinal,
} from './../../Utils/DataUtils';

/**
 *  Saga responsible for formatting data for the Map / Table views
 *  @param { object } dataParam - if a dataParam is provided we can assume other params haven't changed
*/

function* composeDisplayData( dataParam ) {

    // ### Current State
    const allSensors = yield select(sensorsSelector);
    const metricsThreshold = yield select(thresholdSelector);

    // 1. Location
    const navigation = yield select(navSelector);
    const tier = yield select(tierSelector);
    const curNM = getNMap(tier, 'tier'); // current navigation map
    const curLocation = navigation[curNM.type];
    const childNM = getNMapChild(tier, 'tier');

    // 2. Metric
    const metricSelected = yield select(metricSelector);
    const metricKey = getMetricKey(metricSelected);

    // 3. Filter - Device Type
    // const deviceType = yield select(deviceTypeSelector);

    // 4. Filter - Device MFC
    const mfcSelected = yield select(mfcSelector);

    // 5. Timeframe
    let timeframe = yield select(timeframeSelector);
    // TODO: how does all work for the timeframe?
    // needs to be a constrained number of days that
    // can be applied across the data set - 360 days?
    timeframe = (timeframe === 'All') ? 'All' : timeframe.match(/\d+/)[0];

    if (!allSensors || !navigation || !tier || !metricSelected) {
        return null;
    }

    // Limit the sensors pool to the current location
    const sensors = filterSensorsByLoc([...allSensors], curNM.index, curLocation);

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

    // if (metricSelected === 'Uptime') {
    //     var r = rows;
    //     debugger;
    // }

    // if (curLocation === 'Bauchi') {
    //     var r = rows;
    //     debugger;
    // }

    // ### Cells
    let cells = rows.reduce((acc, cur) => {

        let id = crypto.getRandomValues(new Uint32Array(4)).join('-');
        let name = '-';
        let model = '-';
        let devices = '-';
        let metric = '-';
        let mfc = '-';
        let AlarmsByDay = '-';
        let metricsPie = null;
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
                mfc = reduceSensorsByFilter(sensorsFiltered, 'manufacturer');
                metricsPie = getMetricsPie(sensorsFiltered, metricSelected);

                if (metricSelected === 'Alarms') {
                    metric = getTotalByFilter(sensorsFiltered, metricKey);
                } else {
                    metric = getMeanByFilter(sensorsFiltered, metricKey);
                }
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
                metric = cur[metricKey]
                mfc = cur.manufacturer;
                id = cur.id;
                name = cur.facility.name;

                if (metricSelected === 'Alarms') {
                    metric = getTotalByFilter(sensorsFiltered, metricKey);
                } else {
                    metric = getMeanByFilter(sensorsFiltered, metricKey);
                }

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
            metric = cur[metricKey];
            mfc = cur.manufacturer;
            id = cur.id;
            name = cur.facility.name;
            model = cur.model;
            AlarmsByDay = '';

            if (metricSelected === 'Alarms') {
                metric = _.get(cur, metricKey).reduce((a, b) => a + b, 0);
            } else {
                metric = _.mean(_.get(cur, metricKey).reduce((a, b) => a + b, 0));
            }

        }


        acc.push({
            [regionType]: regionName,
            [metricSelected]: getMetricFinal(metric, devices, metricSelected),
            'Manufacturers': mfc,
            'Total Devices': devices,
            AlarmsByDay,
            metricsPie,
            location,
            id,
            name,
            model,
        });

        return acc;

    }, []);

    cells = composePercentiles(cells, metricSelected, metricsThreshold);

    return {columns, cells, rows};

}

export default composeDisplayData;