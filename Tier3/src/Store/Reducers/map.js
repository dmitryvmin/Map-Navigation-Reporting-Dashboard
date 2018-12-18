import {FlyToInterpolator} from 'react-map-gl';
import * as d3 from 'd3-ease';
import {TRANSITION_EVENTS} from 'deck.gl';
import GGConsts from '../../Constants';
import { getMapStyle } from './../../Map/map-style.js';

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

const initState = {
    map_style: getMapStyle(),
    map_viewport: {
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
        transitionInterruption: TRANSITION_EVENTS.BREAK,
        latitude: 9.077751,
        longitude: 8.6774567,
        zoom: 5,
        pitch: 45,
        bearing: 0,
    }
}

function mapReducer(state = initState, action) {
    switch (action.type) {
        case GGConsts.MAP_VIEWPORT:
            return {
                ...state,
                map_viewport: {
                    ...state.map_viewport,
                    latitude: action.map_viewport.latitude ? action.map_viewport.latitude : state.map_viewport.latitude,
                    longitude: action.map_viewport.longitude ? action.map_viewport.longitude : state.map_viewport.longitude,
                    zoom: action.map_viewport.zoom,
                    transitionDuration: action.map_viewport.transitionDuration,
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