import {fromJS} from 'immutable';
import GGConsts from './../Constants';
import MAP_STYLE from './style.json';

const getFilterKey = type => {
    switch(type) {
        case 'countries':
            return 'ADM0_A3_IS';
        case 'states':
            return 'gn_name';
        case 'lgas':
            return 'admin2Name';
    }
}

const getSourceLayer = type => {
    switch(type) {
        case 'countries':
            return 'ne_10m_admin_0_countries-4dnq47';
        case 'states':
            return 'ne_10m_admin_1_states_provinc-5n804v';
        case 'lgas':
            return 'ngaadmbndaadm2osgof-4e7vz7';
    }
}

const getSourceUrl = type => {
    switch(type) {
        case 'countries':
            return 'mapbox://dmitrymin.1tmjkbs7';
        case 'states':
            return 'mapbox://dmitrymin.d5bqzgth';
        case 'lgas':
            return 'mapbox://dmitrymin.ak86ozz1';
    }
}

const getUpdatedMapStyle = (type = 'countries', filter = 'all') => {

    // Make a copy of the map style
    const mapStyle = {
        ...MAP_STYLE,
        sources: {...MAP_STYLE.sources},
        layers: MAP_STYLE.layers.slice()
    };

    const filterKey = getFilterKey(type);
    const sourceLayer = getSourceLayer(type);
    const sourceUrl = getSourceUrl(type);

    // Add the vector tile source for counties
    mapStyle.sources[type] = {
        type: 'vector',
        url: sourceUrl
    };

    if (filter !== 'all') {

        // Insert the country/state/nga layer before city labels
        mapStyle.layers.splice(
            mapStyle.layers.findIndex(layer => layer.id === type), 0,

            // Highlighted the selected county polygons
            {
                id: type,
                type: 'fill',
                'source-layer': sourceLayer,
                visibility: 'visible',
                source: type,
                paint: {
                    'fill-outline-color': '#000',
                    'fill-color': GGConsts.SELECTED_COLOR,
                    // 'fill-opacity': 0.5
                },
                filter: ['in', filterKey, filter]
            },
            // Shade the rest
            {
                id: `${type}_shaded`,
                type: 'fill',
                'source-layer': sourceLayer,
                visibility: 'visible',
                source: type,
                paint: {
                    'fill-outline-color': '#000',
                    'fill-color': GGConsts.SHADED_COLOR,
                    // 'fill-opacity': 0.5
                },
                filter: ['!in', filterKey, filter]
            }
        );
    } else {
        mapStyle.layers.splice(
            mapStyle.layers.findIndex(layer => layer.id === type), 0,
            {
                id: type,
                type: 'fill',
                'source-layer': sourceLayer,
                visibility: 'visible',
                source: type,
                paint: {
                    'fill-outline-color': '#000',
                    'fill-color': GGConsts.SELECTED_COLOR,
                },
                filter: ['all']
            },
        );
    }

    // return fromJS(mapStyle);
    return mapStyle;

}

export default getUpdatedMapStyle;
