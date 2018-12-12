import React, { Component } from 'react';
import Immutable, {fromJS} from 'immutable';
import MapGL, {Marker, Popup, NavigationControl, FlyToInterpolator} from 'react-map-gl';
// import MapGL from 'react-map-gl-alt';
import {ScatterplotLayer} from '@deck.gl/layers';
import Geocoder from 'react-map-gl-geocoder';
import { getCode } from 'country-list';
import countryCode from 'country-code';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import _ from 'lodash';

import * as i18nIsoCountries from 'i18n-iso-countries'; //https://www.npmjs.com/package/i18n-iso-countries

import { setMapViewport, mapClicked } from './../Store/Actions';

import { connect } from "react-redux";
import GGConsts from '../Constants';

import PieChart from 'react-minimal-pie-chart';

import { getCountryObjByName } from './../Utils';

import ControlPanel from './ControlPanel';
import CityPin from './pin';
import CityInfo from './info';

import getUpdatedMapStyle from './map-style.js';

import MAP_STYLE from './style.json';
const MAP_TOKEN = 'pk.eyJ1IjoiZG1pdHJ5bWluIiwiYSI6ImNqb3FmZ2VtcDAwMWszcG84cjJxdWg5NncifQ.mphHlEjmVZzV57R-3BWJqw';


const navStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '10px'
};

const LOCATIONS = [
    {"city": "Bauchi",
        "latitude": 10.6371,
        "longitude": 10.0807},
    {"city": "Kaduna",
        "latitude": 10.1590,
        "longitude": 8.1339},
    {"city": "Kano",
        "latitude": 11.7574,
        "longitude": 8.6601}
];


class Map extends Component {
    state = {
        mapInfo: '',
        viewport: {
            width: '100%',
            height: 712,
            latitude: 9.077751,
            longitude: 8.6774567,
            zoom: 5
        }
    }

    // mapRef = React.createRef();

    // static getDerivedStateFromProps(nextProps, prevState){
    //     return nextProps;
    // }
    //
    // componentDidUpdate(prevProps) {
    //     const {country_selected: prev_country, state_selected: prev_state, lga_selected: prev_lga} = prevProps;
    //     const {country_selected: curr_country, state_selected: curr_state, lga_selected: curr_lga} = this.props;
    // }

    componentDidMount() {

        if (this.mapRef) {
            const map = this.mapRef.getMap();
            map.on('load', function() {
                // Add a new source from our GeoJSON data and set the
                // 'cluster' option to true. GL-JS will add the point_count property to your source data.
                map.addSource("earthquakes", {
                    type: "geojson",
                    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
                    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                    data: "https://www.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
                    cluster: true,
                    clusterMaxZoom: 14, // Max zoom to cluster points on
                    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                });

                map.addLayer({
                    id: "clusters",
                    type: "circle",
                    source: "earthquakes",
                    filter: ["has", "point_count"],
                    paint: {
                        // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                        // with three steps to implement three types of circles:
                        //   * Blue, 20px circles when point count is less than 100
                        //   * Yellow, 30px circles when point count is between 100 and 750
                        //   * Pink, 40px circles when point count is greater than or equal to 750
                        "circle-color": [
                            "step",
                            ["get", "point_count"],
                            "#51bbd6",
                            100,
                            "#f1f075",
                            750,
                            "#f28cb1"
                        ],
                        "circle-radius": [
                            "step",
                            ["get", "point_count"],
                            20,
                            100,
                            30,
                            750,
                            40
                        ]
                    }
                });

                map.addLayer({
                    id: "cluster-count",
                    type: "symbol",
                    source: "earthquakes",
                    filter: ["has", "point_count"],
                    layout: {
                        "text-field": "{point_count_abbreviated}",
                        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                        "text-size": 12
                    }
                });

                map.addLayer({
                    id: "unclustered-point",
                    type: "circle",
                    source: "earthquakes",
                    filter: ["!", ["has", "point_count"]],
                    paint: {
                        "circle-color": "#11b4da",
                        "circle-radius": 4,
                        "circle-stroke-width": 1,
                        "circle-stroke-color": "#fff"
                    }
                });

                // inspect a cluster on click
                // map.on('click', 'clusters', function (e) {
                //     var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                //     var clusterId = features[0].properties.cluster_id;
                //     map.getSource('earthquakes').getClusterExpansionZoom(clusterId, function (err, zoom) {
                //         if (err)
                //             return;
                //
                //         map.easeTo({
                //             center: features[0].geometry.coordinates,
                //             zoom: zoom
                //         });
                //     });
                // });
                //
                // map.on('mouseenter', 'clusters', function () {
                //     map.getCanvas().style.cursor = 'pointer';
                // });
                // map.on('mouseleave', 'clusters', function () {
                //     map.getCanvas().style.cursor = '';
                // });
            });
        }
    }

    handleViewportChange = _.debounce((map_viewport) => {
        const { latitude,
                longitude,
                zoom } = this.props.map_viewport;

        const { latitude: new_latitude,
                longitude: new_longitude,
                zoom: new_zoom } = map_viewport;

        if ((new_latitude && new_latitude !== latitude) ||
            (new_longitude && new_longitude !== longitude) ||
            (new_zoom && new_zoom !== zoom)) {

            this.props.setMapViewport(map_viewport);
        }
    }, 10);

    handleStyleChange = map_style => this.setState({ map_style });

    handleGeocoderViewportChange = (viewport) => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 }

        return this.handleViewportChange({
            ...viewport,
            ...geocoderDefaultOverrides
        })
    }

    _onMapClick = e => {
        const layer = _.get(_.first(e.features), 'layer');
        const props = _.get(_.first(e.features), 'properties');
        console.log(layer, props);
        // this.props.mapClicked(layer.filter[2]);


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

    handleAddressChange = address => {
        geocodeByAddress(address.name)
            .then(results => getLatLng(results[0]))
            .then(coord => {
                    this.setState(prevState => ({
                        ...prevState,
                        viewport: {
                            ...prevState.viewport,
                            latitude: coord.latitude,
                            longitude: coord.longitude
                        }
                    }))
                }
            );

    }

    render() {
        const { mapInfo } = this.state;
        const { map_viewport,
                map_style } = this.props;

        return (
            <React.Fragment>
                {this.state.viewport && <MapGL
                    mapboxApiAccessToken={MAP_TOKEN}
                    mapStyle={map_style}
                    ref={(map) => { this.mapRef = map; }}
                    {...map_viewport}
                    onViewportChange={this.handleViewportChange}
                    onClick={this._onMapClick}
                    style={{height: '500px'}}
                    // onHover={this._onMapHover}
                >
                    {/*{ LOCATIONS.map(this._renderCityMarker) }*/}

                    {/*{this._renderPopup()}*/}

                    <div className="nav" style={navStyle}>
                        <NavigationControl onViewportChange={this.handleViewportChange} />
                    </div>

                    {/*<ControlPanel*/}
                    {/*containerComponent={this.props.containerComponent}*/}
                    {/*onChange={this.handleStyleChange} />*/}

                </MapGL>}
                {/*<pre>{mapInfo && mapInfo}</pre>*/}
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
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMapViewport: (map_viewport) => dispatch(setMapViewport(map_viewport)),
        mapClicked: (prop) => dispatch(mapClicked(prop)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
