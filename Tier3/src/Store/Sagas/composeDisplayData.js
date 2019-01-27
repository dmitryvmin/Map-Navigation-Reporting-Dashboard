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
    filterSensorsByFacility,
    filterSensorsByMfc,
    getTotalByFilter,
    getMeanByFilter,
    getMetricsPie,
    makeColumn,
    composePercentiles,
    getMetricKey,
    getMetricFinal,
    applyTimeframe,
} from './../../Utils/DataUtils';

/**
 *  Saga responsible for formatting data for the Map / Table views
 *  @param { object } dataParam - if a dataParam is provided we can assume other params haven't changed
*/

function* composeDisplayData( dataParam ) {

    // ### Get Current State ###
    // 1. Sensors
    const allSensors = yield select(sensorsSelector);
    const metricsThreshold = yield select(thresholdSelector);

    // 2. Location
    const navigation = yield select(navSelector);
    const tier = yield select(tierSelector);
    const curNM = getNMap(tier, 'tier'); // current navigation map
    const curLocation = navigation[curNM.type];
    const childNM = getNMapChild(tier, 'tier');

    // 3. Metric
    const metricSelected = yield select(metricSelector);
    const metricKey = getMetricKey(metricSelected);

    // 4. Filter - Device Type
    // TODO: turn this on once device type has been added to the endpoint
    // const deviceType = yield select(deviceTypeSelector);

    // 5. Filter - Device MFC
    const mfcSelected = yield select(mfcSelector);

    // 6. Timeframe
    const timeframe = yield select(timeframeSelector);

    // ### check that we have all the needed data ###
    if (
        !allSensors ||
        !navigation ||
        !tier ||
        !metricSelected ||
        !curNM ||
        !curLocation
    ) {
        return null;
    }

    // ### Reduce the data by location and timeframe ###
    // Limit the sensors pool to the current location
    // TODO: to optimize, cache the reduced sensor pool
    // deeper searches would use this reduced pool instead of
    // searching through all the sensors
    let sensors;
    if (tier === GGConsts.FACILITY_LEVEL) {
        sensors = filterSensorsByFacility([...allSensors], curLocation);
    } else {
        sensors = filterSensorsByLoc([...allSensors], curNM.index, curLocation);
    }
    sensors = applyTimeframe(sensors, timeframe, metricKey);
    // TODO: this is where we would also limit mfc list to ones available in curLocation

    // ### Rows ###
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

    // ### Columns ###
    let columns = [];

    if (tier === GGConsts.FACILITY_LEVEL) {
        columns.push(makeColumn(metricSelected));
        columns.push(makeColumn('Manufacturers'));
        columns.push(makeColumn('model'));
    }
    else {
        columns.push(makeColumn(childNM.map));
        columns.push(makeColumn(metricSelected));
        columns.push(makeColumn('Manufacturers'));
        columns.push(makeColumn('Total Devices'));
    }

    // ### Cells ###
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

    // ### Calculate and save percentiles
    cells = composePercentiles(cells, metricSelected, metricsThreshold);

    return {columns, cells, rows};

}

export default composeDisplayData;