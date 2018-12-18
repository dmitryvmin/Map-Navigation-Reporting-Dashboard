import React, { Component } from 'react';
import ReactMapGL, {Marker, Popup, NavigationControl} from 'react-map-gl';

import {StaticMap} from 'react-map-gl';
import DeckGL, {MapController, FlyToInterpolator, GeoJsonLayer, TRANSITION_EVENTS} from 'deck.gl';

import GL from 'luma.gl/constants';

import Geocoder from 'react-map-gl-geocoder';
import { getCode } from 'country-list';
import countryCode from 'country-code';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import _ from 'lodash';
import {scaleThreshold} from 'd3-scale';

import supercluster from 'supercluster';

import { setMapViewport, mapClicked } from './../Store/Actions';

import { connect } from "react-redux";
import GGConsts from '../Constants';

import PieChart from 'react-minimal-pie-chart';

import { getFilterKey, getCountryName } from './../Utils';

import ControlPanel from './ControlPanel';
import CityPin from './pin';
import CityInfo from './info';
import Cluster from './Cluster';

import statesData from './statesData.json';
import lgasData from './lgasData.json';

export const INITIAL_VIEW_STATE = {
    latitude: 9.0820,
    longitude: 8.6753,
    zoom: 6,
    maxZoom: 16,
    pitch: 45,
    bearing: 0
};

const FACILITIES = [
    {"name": "Nnewi, Anambra", "latitude":	6.010519, "longitude": 6.910345},
    {"name": "Agbor, Ika South", "latitude":	6.264092, "longitude": 6.201883},
    {"name": "Ikeja", "latitude":	6.605874, "longitude": 3.349149},
    {"name": "Ughelli", "latitude":	5.500187, "longitude": 5.993834},
    {"name": "Akure", "latitude":	7.250771, "longitude": 5.210266},
    {"name": "Calabar", "latitude":	4.982873, "longitude": 8.334503},
    {"name": "Sapele, Delta", "latitude":	5.879698, "longitude": 5.700531},
    {"name": "Eruwa, Oyo", "latitude":	7.536318, "longitude": 3.418143},
    {"name": "Wudil", "latitude":	11.79424, "longitude": 	8.839032},
    {"name": "Onitsha", "latitude":	6.141312, "longitude": 6.802949},
    {"name": "Zaria", "latitude":	11.08554, "longitude": 	7.719945},
    {"name": "Jos", "latitude":	9.896527, "longitude": 8.858331},
    {"name": "Kaduna", "latitude":	10.60931, "longitude": 	7.429504},
    {"name": "Minna, Minna state", "latitude":	9.583555, "longitude": 6.546316},
    {"name": "Sokoto", "latitude":	13.00587, "longitude": 	5.247552},
    {"name": "Iwo, Osun", "latitude":	7.629209, "longitude": 4.187218},
    {"name": "Yola", "latitude":	9.203496, "longitude": 12.495390},
    {"name": "Ondo", "latitude":	7.100005, "longitude": 4.841694},
    {"name": "Warri, Delta", "latitude":	5.544230, "longitude": 5.760269},
    {"name": "Jos, Middle Belt", "latitude":	9.890224, "longitude": 8.878927},
    {"name": "Enugu, Enugu", "latitude":	6.459964, "longitude": 7.548949},
    {"name": "Ikorodu", "latitude":	6.616865, "longitude": 3.508072},
    {"name": "Owerri, Imo", "latitude":	5.476310, "longitude": 7.025853},
    {"name": "Bauchi", "latitude":	10.31415, "longitude": 	9.846282},
    {"name": "Bida", "latitude":	9.083333, "longitude": 6.016667},
    {"name": "Ado Ekiti", "latitude":	7.621111, "longitude": 5.221389},
    {"name": "Gombe", "latitude":	10.28333, "longitude": 	11.166667},
    {"name": "Sapele", "latitude":	5.900000, "longitude": 5.666667},
    {"name": "Ofin", "latitude":	6.544560, "longitude": 3.514938},
    {"name": "Ilorin", "latitude":	8.500000, "longitude": 4.550000},
    {"name": "Uwheru", "latitude":	5.307031, "longitude": 6.056213},
    {"name": "Birnin Kebbi", "latitude":	12.46607, "longitude": 	4.199524},
    {"name": "Burji", "latitude":	11.17117, "longitude": 	8.548755},
    {"name": "Surulere, Lagos", "latitude":	6.500000, "longitude": 3.350000},
    {"name": "Uyo", "latitude":	5.038963, "longitude": 7.909470},
    {"name": "Abuja", "latitude":	9.072264, "longitude": 7.491302},
    {"name": "Kaura Namoda", "latitude":	12.60000, "longitude": 	6.589722},
    {"name": "Ogbomosho", "latitude":	8.142165, "longitude": 4.245186},
    {"name": "Eti-Osa", "latitude":	6.458985, "longitude": 3.601521},
    {"name": "Lagos", "latitude":	6.465422, "longitude": 3.406448},
    {"name": "Awka", "latitude":	6.210528, "longitude": 7.072277},
    {"name": "Ibadan", "latitude":	7.401962, "longitude": 3.917313},
]


class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hoveredObject: null,
            selected_state: 'Bauchi',
            viewstate: INITIAL_VIEW_STATE,
        };
    }

    componentDidMount() {
        window._btn = this._goToNYC;
    }

    handleStyleChange = map_style => this.setState({ map_style });

    handleGeocoderViewportChange = (viewport) => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 }

        return this.handleViewportChange({
            ...viewport,
            ...geocoderDefaultOverrides
        })
    }

    _onMapClick = e => {
        const { tier } = this.props;
        const layer = _.get(_.first(e.features), 'layer');
        const props = _.get(_.first(e.features), 'properties');

        if (layer && props) {
            const type = _.first(layer.id.split('-'));
            const filter = getFilterKey(type);
            let value = _.get(props, filter);
            if (type === 'country_selected') value = getCountryName(value);
            // const toMap = _.first(navigationMap.filter(n => n.index === curMap.index + 1));

            this.props.navigateTo({ [type]: value });
        }
    }

    _onMapHover = e => {
        if (e.features.length > 0) {
            const source = _.get(_.first(e.features), 'source');
            const id = _.get(_.first(e.features), 'id');
            //     console.log('@@', source, id);
            //     // this.mapRef.getMap().setFeatureState({source, id}, {hover: true});

            console.log('@@', _.first(e.features), source, id);

            const map = this.mapRef.getMap();

            map.setFeatureState({source: 'state_selected-include', id: 616}, { hover: true});
        }
    }

    // _renderPopup() {
    //     const {popupInfo} = this.state;
    //
    //     return popupInfo && (
    //             <Popup tipSize={5}
    //                    anchor="top"
    //                    longitude={popupInfo.longitude}
    //                    latitude={popupInfo.latitude}
    //                    onClose={() => this.setState({popupInfo: null})} >
    //                 <CityInfo info={popupInfo} />
    //             </Popup>
    //         );
    // }

    //

    _renderMarker = (location, index) => {
        return(<Marker
            key={`marker-${index}`}
            longitude={location.longitude}
            latitude={location.latitude} >
            <CityPin location={location} size={20} onClick={() => this.setState({popupInfo: location.name})} />
        </Marker>)
    }

    _onHover = ({x, y, object}) => {

        object && this.setState({x, y, hoveredObject: object, selected_state: object.properties.admin1Name});
    }

    _onClick = e => {
        console.log(e.object.properties);
    }

    _onMapLoad = () => {
        const map = this._map;
        const deck = this._deck;

        // map.addLayer(new MapboxLayer({id: 'my-scatterplot', deck}));
    }

    _renderLayers = () => {
        const data = [lgasData];
        const layers = [];
        const selected = this.state.selected_state;

        data.map(d => {
            // console.log('@@ name', d.properties.name,admin1Name);
            layers.push(new GeoJsonLayer({
                id: `geojson-${selected}`,
                data: d,
                opacity: 0.8,
                stroked: false,
                filled: true,
                extruded: true,
                wireframe: true,
                fp64: true,
                getLineColor: [255, 255, 255],
                getFillColor: f => (f.properties.admin1Name === selected) ? [255, 255, 0] : [199, 233, 180],
                updateTrigger: {
                    getFillColor: selected
                },
                pickable: true,
                onHover: this._onHover,
                onClick: this._onClick,
            }))
        });

        // FACILITIES.map(d => {
        //     layers.push(new ScatterplotLayer({
        //         id: 'geojson-facilities',
        //         data: d,
        //         radiusScale: 20,
        //         getPosition: d => ({longitude: d.coordinates.longitude, latitude: d.coordinates.latitude}),
        //         getColor: [255, 140, 0],
        //         pickable: true,
        //         // onHover: this._onHover
        //     }))
        // })

        return layers;
    }

    _renderTooltip = () => {

        const {x, y, hoveredObject} = this.state;

        return (
            hoveredObject && (
                <div className="tooltip" style={{position: 'absolute', zIndex: 1000, top: y - 50, left: x}}>
                    <div>{hoveredObject.properties.admin2Name} </div>
                </div>
            )
        );
    }

    _onViewStateChange = ({viewstate}) => {
        console.log('@@', viewstate);
        this.setState({viewstate});
    }

    // DeckGL and mapbox will both draw into this WebGL context
    _onWebGLInitialized = (gl) => {
        this.setState({gl});
    }

    _goToNYC = () => {
        console.log('@@goToNY');
        this.setState({
            viewstate: {
                ...this.state.viewstate,
                longitude: -74.1,
                latitude: 40.7,
                zoom: 14,
                pitch: 0,
                bearing: 0,
                transitionDuration: 8000,
                transitionInterpolator: new FlyToInterpolator()
            }
        });
    }
{<MapGL
mapboxApiAccessToken={MAP_TOKEN}
mapStyle={map_style}
onLoad={() => this.setState({ map: this.mapRef.getMap() })}
{...map_viewport}
onViewportChange={this.handleViewportChange}
onClick={this._onMapClick}

    // onHover={this._onMapHover}
>
{/*{ LOCATIONS.map(this._renderCityMarker) }*/}

{/*{this._renderPopup()}*/}

{/*<div className="nav" style={navStyle}>*/}
{/*<NavigationControl onViewportChange={this.handleViewportChange} />*/}
{/*</div>*/}

{/*<ControlPanel*/}
{/*containerComponent={this.props.containerComponent}*/}
{/*onChange={this.handleStyleChange} />*/}

</MapGL>}

    render() {

        const {viewstate} = this.state;

        console.log('@@gl:',viewstate);


        return (
            <React.Fragment>

                <DeckGL
                    layers={this._renderLayers()}
                    viewState={viewstate}
                    onViewStateChange={this._onViewStateChange}
                    controller={true}
                >
                    <StaticMap
                        mapStyle="mapbox://styles/mapbox/light-v9"
                        mapboxApiAccessToken={GGConsts.MAPBOX_TOKEN}
                    />
                </DeckGL>

            </React.Fragment>

        );
    }
}

const mapStateToProps = state => {
    return {
        map_viewport: state.mapReducer.map_viewport,
        map_style: state.mapReducer.map_style,
        country_selected: state.navigationReducer.country_selected,
        state_selected: state.navigationReducer.state_selected,
        lga_selected: state.navigationReducer.lga_selected,
        navigation: state.navigationReducer.navigation,
        tier: state.navigationReducer.nav_tier,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMapViewport: (map_viewport) => dispatch(setMapViewport(map_viewport)),
        navigateTo: (navState) => dispatch({ type: GGConsts.UPDATE_NAV, navState }),
        // mapClicked: (prop) => dispatch(mapClicked(prop)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
