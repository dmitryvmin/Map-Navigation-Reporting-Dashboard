import {
    FlyToInterpolator,
    LinearInterpolator
} from 'react-map-gl';
import * as d3 from 'd3-ease';
import {TRANSITION_EVENTS} from 'deck.gl';
import GGConsts from '../../Constants';
import {getMapStyle} from './../../Map/VectorTileUtils.js';

const interruptionStyles = [
    {
        title: 'BREAK',
        style: TRANSITION_EVENTS.BREAK
    },
    {
        title: 'SNAP_TO_END',
        style: TRANSITION_EVENTS.SNAP_TO_END
    },
    {
        title: 'IGNORE',
        style: TRANSITION_EVENTS.IGNORE
    }
];

// const transitionInterpolator = new LinearInterpolator(['bearing']);
const transitionInterpolator = new FlyToInterpolator();

const initState = {
    map_style: getMapStyle(),
    map_viewport: {
        transitionDuration: 1000,
        transitionInterpolator,
        transitionEasing: d3.easeCubic,
        transitionInterruption: TRANSITION_EVENTS.BREAK,
        latitude: 9.077751,
        longitude: 8.6774567,
        zoom: 6,
        pitch: 0, // controls view angle
        bearing: 0, // controls map rotation
    },
    map_ref: {
        mapbox: null,
        deck: null,
    },
}

function mapReducer(state = initState, action) {
    switch (action.type) {
        case GGConsts.MAP_VIEWPORT:
            const {
                latitude,
                longitude,
                // transitionInterpolator,
                transitionDuration,
                zoom,
            } = action.map_viewport;

            return {
                ...state,
                map_viewport: {
                    ...state.map_viewport,
                    latitude: latitude ? latitude : state.map_viewport.latitude,
                    longitude: longitude ? longitude : state.map_viewport.longitude,
                    transitionInterpolator,
                    // transitionInterpolator: new FlyToInterpolator(),
                    // transitionInterpolator: transitionInterpolator ? transitionInterpolator : transitionInterpolator,
                    transitionDuration,
                    zoom,
                }
            }

        case GGConsts.MAP_REF:
            return {
                ...state,
                map_ref: {
                    ...state.map_ref,
                    mapbox: action.map_ref.mapbox ? action.map_ref.mapbox : state.map_ref.mapbox,
                    deck: action.map_ref.deck ? action.map_ref.deck : state.map_ref.deck,
                }
            }

        case GGConsts.MAP_STYLE:
            return {
                ...state,
                map_style: action.map_style
            }

        default:
            return state;
    }
}

export default mapReducer;