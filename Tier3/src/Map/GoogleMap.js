import React, {Component} from 'react';
import {connect} from "react-redux";
import DeckGLOverlay from './deckgl-overlay.js';
import {json as requestJson} from 'd3-request';
import {
    withGoogleMap,
    GoogleMap,
    OverlayView,
} from "react-google-maps";

import {getGeoJson} from './../Utils';

// Set your mapbox token here
const MALE_COLOR = [0, 128, 255];
const FEMALE_COLOR = [255, 0, 128];

// Source data CSV
const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/scatterplot/manhattan.json';  // eslint-disable-line

const STYLES = {
    mapContainer: {
        height: `100%`,
    },
    overlayView: {
        background: `white`,
        border: `1px solid #ccc`,
        padding: 15,
    },
};

function getPixelPositionOffset(width, height) {
    return { x: -(width / 2), y: -(height / 2) };
}

const SimpleMapExampleGoogleMap = withGoogleMap(props => (
    <GoogleMap
        defaultCenter={{ lat: 9, lng: 8.6}}
        ref={props.onMapMounted}
        zoom={props.zoom}
        onZoomChanged={props.onZoomChanged}
        // apiKey="AIzaSyDaoLdV31Y5ls8ABBpuAQt9t8RzMDfOMiM"
    >
        <OverlayView key={Math.random()} position={{lat: 9, lng: 8.6}} getPixelPositionOffset={getPixelPositionOffset} mapPaneName={OverlayView.OVERLAY_LAYER}
        >
            <DeckGLOverlay viewport={props.viewport}
                           data={props.data}
                           maleColor={MALE_COLOR}
                           femaleColor={FEMALE_COLOR}
                           radius={30}
            />
        </OverlayView>
    </GoogleMap>
));

class GMap extends Component {


    constructor(props) {
        super(props);

        this.state = {
            viewport: {
                ...DeckGLOverlay.defaultViewport,
                width: 500,
                height: 500
            },
            data: null,
            zoom: 13,
            content: `Change the zoom level`,
        };

        requestJson(DATA_URL, (error, response) => {
            if (!error) {
                this.setState({data: response});
            }
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();
    }

    _resize() {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    _onViewportChange(viewport) {
        this.setState({
            viewport: {...this.state.viewport, ...viewport}
        });
    }

    _centerMoved(mapProps, map) {
        console.log(mapProps);
        console.log(map);
    }

    onZoomChanged() {
        console.log(this);
        console.log(this.refs.map.getZoom());
    }

    handleMapMounted(map) {
        this._map = map;
    }

    handleZoomChanged() {
        const nextZoom = this._map.getZoom();
        if (nextZoom !== this.state.zoom) {
            // Notice: Check zoom equality here,
            // or it will fire zoom_changed event infinitely
            console.log(this.state);
            this.setState({
                zoom: nextZoom,
                content: `Zoom: ${nextZoom}`,
                viewport: {      longitude: -74,
                    latitude: 40.7,
                    zoom: nextZoom - 1,
                    maxZoom: 16,
                    pitch: 0,
                    bearing: 0,
                    width: this.state.viewport.width,
                    height: this.state.viewport.height},
            });
        }
    }


    render() {
        const {viewport, data} = this.state;
        const {markers, map_viewport} = this.props;

        // let geo = getGeoJson('state_selected')

        return (
            <SimpleMapExampleGoogleMap
                containerElement={
                    <div style={{ height: `100%` }} />
                }
                mapElement={
                    <div style={{ height: `100%` }} />
                }
                onMapMounted={this.handleMapMounted.bind(this)}
                onZoomChanged={this.handleZoomChanged.bind(this)}
                viewport={map_viewport}
                data={markers}
                zoom={map_viewport.zoom}
                content={this.state.content}
            >
            </SimpleMapExampleGoogleMap>

        );
    }
}

const mapStateToProps = state => {
    return {
        markers: state.markersReducer.markers,
        map_viewport: state.mapReducer.map_viewport,
    }
}

export default connect(mapStateToProps, null)(GMap);
