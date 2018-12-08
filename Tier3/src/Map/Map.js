import React, { Component } from 'react';
import Immutable, {fromJS} from 'immutable';
import MapGL, {Marker, Popup, NavigationControl, FlyToInterpolator} from 'react-map-gl';
import {ScatterplotLayer} from '@deck.gl/layers';
import Geocoder from 'react-map-gl-geocoder';
import { getCode } from 'country-list';
import countryCode from 'country-code';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import _ from 'lodash';

import { createSelector } from 'reselect';

import * as i18nIsoCountries from 'i18n-iso-countries'; //https://www.npmjs.com/package/i18n-iso-countries

import { setMapViewport } from './../Store/Actions';

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


// const shopItemsSelector = state => state.shop.items
// const taxPercentSelector = state => state.shop.taxPercent
//
// const subtotalSelector = createSelector(
//     shopItemsSelector,
//     items => items.reduce((acc, item) => acc + item.value, 0)
// )
//
// const taxSelector = createSelector(
//     subtotalSelector,
//     taxPercentSelector,
//     (subtotal, taxPercent) => subtotal * (taxPercent / 100)
// )

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

    mapRef = React.createRef();

    _renderCityMarker = (city, index) => {
        return (
            <Marker
                key={`marker-${index}`}
                longitude={city.longitude}
                latitude={city.latitude} >

                <CityPin city={city.city} onClick={() => this.setState({popupInfo: city})} />

                {/*<foreignObject x="0" y="0" width="1" height="1">*/}
                {/*<PieChart*/}
                {/*lineWidth={50}*/}
                {/*radius={10}*/}
                {/*data={[*/}
                {/*{ title: 'One', value: 10, color: '#E38627' },*/}
                {/*{ title: 'Two', value: 15, color: '#C13C37' },*/}
                {/*{ title: 'Three', value: 20, color: 'green' },*/}
                {/*]}*/}
                {/*/>*/}
                {/*</foreignObject>*/}
            </Marker>
        );
    }
    //
    // static getDerivedStateFromProps(nextProps, prevState){
    //     return nextProps;
    // }
    //
    // componentDidUpdate(prevProps) {
    //     const {country_selected: prev_country, state_selected: prev_state, lga_selected: prev_lga} = prevProps;
    //     const {country_selected: curr_country, state_selected: curr_state, lga_selected: curr_lga} = this.props;
    // }

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

    _renderPopup() {
        const {popupInfo} = this.state;

        return popupInfo && (
                <Popup tipSize={5}
                       anchor="top"
                       longitude={popupInfo.longitude}
                       latitude={popupInfo.latitude}
                       onClose={() => this.setState({popupInfo: null})} >
                    <CityInfo info={popupInfo} />
                </Popup>
            );
    }

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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
