import _ from 'lodash';
import * as turf from '@turf/turf';
import {select} from 'redux-saga/effects';

import {
    navSelector,
    tierSelector,
    metricSelector,
    displaySelector,
} from './../Selectors';

import {
    getGeoJson,
    getNMapChild,
    asyncForEach,
    // getNMap,
} from './../../Utils';

function* getMarkers()  {

    const data = yield select(displaySelector);
    const tier = yield select(tierSelector);
    const navigation = yield select(navSelector);
    const metric = yield select(metricSelector);

    // const curNM = getNMap(tier, 'tier');
    const childNM = getNMapChild(tier, 'tier');

    const geoJson = getGeoJson(childNM.type);

    if (!data || !tier || !navigation || !metric) {
        return;
    }

    const markers = [];

    const getMarkers = async () => {
        await asyncForEach(data.cells, async (c) => {
            const marker = {};
            let name;
            let geo;

            if (tier !== 'LGA_LEVEL') {
                name = c[childNM.map];
                geo = _.first(geoJson.filter(f => f.properties[childNM.code] === name));

                // If this is a cohort - not a single location - need to find the center for the marker
                if (geo && childNM.index > -1) {
                    // Calculate the centeroid for each geojson multipolygon
                    const coordinates = turf.centroid(geo).geometry.coordinates;
                    marker.longitude = coordinates[0];
                    marker.latitude = coordinates[1];
                }
            } else {

                // TODO: temporary api mess
                // https://github.com/google/open-location-code/wiki/Plus-codes-API
                const country = '7F2F';
                const location = c.location.replace("+", "%2B");
                const api = `https://plus.codes/api?address=${country}${location}&key=AIzaSyAMUhRvDxA2TM69Kf4KMg0JeZLXb14A78o`
                const response = await fetch(api);
                const geo = await response.json();

                marker.longitude = geo.plus_code.geometry.location.lng;
                marker.latitude = geo.plus_code.geometry.location.lat;
                name = c.facilities;

            }

            marker.name = name;
            marker.metric = metric;
            marker.value = c[metric];
            // Chart prop below is for testing
            marker.chart = c.chart;

            markers.push(marker);

        });
    }
    getMarkers();

    return markers;

}

export default getMarkers;
