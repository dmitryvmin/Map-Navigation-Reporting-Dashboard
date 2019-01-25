import _ from 'lodash';
import * as turf from '@turf/turf';
import {select, put} from 'redux-saga/effects';
import {OpenLocationCode} from 'open-location-code';

import GGConsts from './../../Constants';
import {
    navSelector,
    tierSelector,
    metricSelector,
    displaySelector,
    geoSelector,
} from './../Selectors';

import {
    getGeoJson,
    getNMapChild,
    getNMap,
} from './../../Utils';

function* getMarkers(display_data = null)  {

    let data = display_data;
    if (!display_data) {
        data = yield select(displaySelector);
    }
    const tier = yield select(tierSelector);  

    // see if this has marker data saved
    const geoState = yield select(geoSelector);
    const navigation = yield select(navSelector);
    const metric = yield select(metricSelector);

    const childNM = getNMapChild(tier, 'tier');

    if (!childNM) {
        return;
    }

    const curNM = getNMap(tier, 'tier');
    const geoJson = getGeoJson(childNM.type);

    if (!data || !tier || !navigation || !metric) {
        return;
    }

    const markers = [];
    
    //const iterateMarkers = async () => {
    //await asyncForEach(data.cells, async (c) => {

    //function* loopMarkers() {
    data.cells.forEach( c => {
        const marker = {};
        let name;
        let geo;

        if (tier !== 'LGA_LEVEL') {
            
            name = c[childNM.map];
            
            if (navigation.state_selected === 'All' || navigation.state_selected === false ) {
                geo = _.first(geoJson.filter(f => f.properties[childNM.code] === name));   //  && f.properties[curNM.code] === navigation.state_selected) 
            } else {
                geo = _.first(geoJson.filter(f => f.properties[childNM.code] === name && f.properties[curNM.code] === navigation.state_selected));   //   
            }

            // If this is a cohort - not a single location - need to find the center for the marker
            if (geo && childNM.index > -1) {
                // Calculate the centeroid for each geojson multipolygon

                // first now check if the data is already appended to the geoState (add property centroid/coordinates)

                const coordinates = turf.centroid(geo).geometry.coordinates;
                marker.longitude = coordinates[0];
                marker.latitude = coordinates[1];
                
            }

        } else {

            // https://github.com/google/open-location-code/wiki/Plus-codes-API
            const OLC = new OpenLocationCode();
            const geo = OLC.decode(c.location);

            marker.longitude = geo.longitudeCenter;
            marker.latitude = geo.latitudeCenter;
            name = c.name;

        }

        marker.name = name;
        marker.metric = metric;
        marker.value = c[metric];
        marker.metricPercentile = c.metricPercentile || null;
        marker.metricsPie = c.metricsPie;
        markers.push(marker);

    });

    //loopMarkers();
    // yield put({ type: GGConsts.GEO_MAP, data: {[childNM.map]: geoState} });

    return markers;

}

export default getMarkers;
