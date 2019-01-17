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

    data.cells.forEach(c => {
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
            marker.longitude = 0;
            marker.latitude = 0;
            name = c.facilities;
        }

        marker.name = name;
        marker.metric = metric;
        marker.value = c[metric];
        // Chart prop below is for testing
        marker.chart = c.chart;

        markers.push(marker);

    });

    return markers;

}

export default getMarkers;
