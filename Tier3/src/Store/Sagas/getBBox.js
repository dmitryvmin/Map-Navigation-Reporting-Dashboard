import _ from 'lodash';
import geojsonExtent from 'geojson-extent';
import GGConsts from '../../Constants';
import * as turf from '@turf/turf';
import L from 'leaflet';
import {
    getGeoJson,
    getNMap,
} from './../../Utils';

/**
 * Gets the bounding box object from the selected geojson multipolygon
 * https://www.npmjs.com/package/@mapbox/geojson-extent
 * https://docs.mapbox.com/mapbox-gl-js/api/#lnglatboundslike
 * http://turfjs.org/docs/
 *
 * @param {string} nav_tier
 * @param {object} navigation
 * @returns {object} - bbox - [SW, NE]
 */
function getBBox(nav_tier, navigation) {

    const NM = getNMap(nav_tier, 'tier');
    const geoJson = getGeoJson(NM.type);
    const selected = geoJson.filter(f => f.properties[NM.code] === navigation[NM.type]);

    if (selected && !selected.length) {
        return null;
    }

    // const bounds = geojsonExtent(_.first(selected).geometry);
    // [WSEN]
    // const bbox = [[ bounds[1], bounds[0] ], [ bounds[3], bounds[2] ]];

    // const layer = L.geoJson(_.first(selected));
    // const bounds = layer.getBounds();

    const polygon = L.polygon(selected[0].geometry['coordinates']);

    // [SWNE]
    const bounds = polygon.getBounds();
    // [SW, NE]
    const bbox = [[bounds._northEast.lat, bounds._northEast.lng], [bounds._southWest.lat, bounds._southWest.lng]];

    return bbox;

}

export default getBBox;
