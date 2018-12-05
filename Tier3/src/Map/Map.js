import React, { Component } from 'react';
import Immutable, {fromJS} from 'immutable';
import MapGL, {Marker, Popup, NavigationControl, FlyToInterpolator} from 'react-map-gl';
import {ScatterplotLayer} from '@deck.gl/layers';
import Geocoder from 'react-map-gl-geocoder';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import * as i18nIsoCountries from 'i18n-iso-countries'; //https://www.npmjs.com/package/i18n-iso-countries

import { setMapViewport } from './../Store/Actions';

import { connect } from "react-redux";
import GGConsts from '../Constants';

import PieChart from 'react-minimal-pie-chart';

import { getCountryObjByName } from './../Utils';

import ControlPanel from './ControlPanel';
import CityPin from './pin';
import CityInfo from './info';

const MAP_TOKEN = 'pk.eyJ1IjoiZG1pdHJ5bWluIiwiYSI6ImNqb3FmZ2VtcDAwMWszcG84cjJxdWg5NncifQ.mphHlEjmVZzV57R-3BWJqw';
const MAP_STYLE = 'mapbox://styles/dmitrymin/cj4fulpei0m0k2sqrh1pz0jvh';
// const MAP_STYLE = 'mapbox://styles/dmitrymin/cjp04re2k089u2rnx0h3a3aj3';

const map_style = {

}


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
        mapStyle: map_style,
        viewport: {
            width: '100%',
            height: 712,
            latitude: 9.077751,
            longitude: 8.6774567,
            zoom: 5
        }
    }

    mapRef = React.createRef();

    // _updateViewport = (viewport) => {
    //     this.setState({viewport});
    // }

    _renderCityMarker = (city, index) => {
        return (
            <Marker
                key={`marker-${index}`}
                longitude={city.longitude}
                latitude={city.latitude} >

                {/*<CityPin city={city.city} onClick={() => this.setState({popupInfo: city})} />*/}

                {/*<foreignObject x="0" y="0" width="1" height="1">*/}
                    {/*<PieChart*/}
                        {/*lineWidth={50}*/}
                        {/*radius={10}*/}
                        {/*data={[*/}
                            {/*{ title: 'One', value: 10, color: '#E38627' },*/}
                            {/*{ title: 'Two', value: 15, color: '#C13C37' },*/}
                            {/*{ title: 'Three', value: 20, color: '#6A2135' },*/}
                        {/*]}*/}
                    {/*/>*/}
                {/*</foreignObject>*/}
            </Marker>
        );
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.country_selected !== prevState.country_selected){
            return { country_selected: nextProps.country_selected};
        }
        else return null;
    }

    componentDidUpdate(prevProps, prevState) {

        const country = this.props.country_selected;


        if (country && country.name !== 'all') {

            const map = this.mapRef.current.getMap();

            if (!map._loaded) {

                map.on('load', function () {

                    map.addLayer({

                        'id': 'countries',
                        'source': {
                            'type': 'vector',
                            'url': 'mapbox://dmitrymin.1tmjkbs7'
                        },
                        'source-layer': 'ne_10m_admin_0_countries-4dnq47',
                        'type': 'fill',
                        'paint': {
                            'fill-color': '#51326c',
                            'fill-outline-color': '#fff'
                        }
                    }, null);

                    map.setFilter('countries', ['in', 'ADM0_A3_IS'].concat([country.alpha3Code]));

                });
            } else {
                map.setFilter('countries', ['in', 'ADM0_A3_IS'].concat([country.alpha3Code]));
            }



        }

    }
    //
    // componentWillUnmount() {
    //     window.removeEventListener('resize', this.resize)
    // }
    //
    // resize = () => {
    //     this.handleViewportChange({
    //         width: window.innerWidth,
    //         height: window.innerHeight
    //     })
    // }

    // componentDidUpdate() {
    //     const country = this.props.country_selected;
    //     if (country) this.handleAddressChange(country);
    // }

    handleViewportChange = (viewport) => {
        const { latitude, longitude, zoom } = this.props.map_viewport;

        if ((latitude !== viewport.latitude) || (longitude !== viewport.longitude) || (zoom !== viewport.zoom)) {
            this.props.setMapViewport(viewport);
        }

    }

    handleStyleChange = mapStyle => this.setState({mapStyle});

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

    // fly = () => {
    //     let coordinates = this.state.flyTo;
    //     this.map.state.map.flyTo(coordinates);
    // }

    render() {
        const { mapStyle } = this.state;
        const { map_viewport } = this.props;

        return (
            <React.Fragment>
                {this.state.viewport && <MapGL
                    mapboxApiAccessToken={MAP_TOKEN}
                    // mapStyle={mapStyle} // TODO: Figure out how to pass layer styles through mapStyles...
                    ref={this.mapRef}
                    {...map_viewport}
                    //{...this.state.viewport}
                    onViewportChange={this.handleViewportChange}
                    //onViewportChange={this._updateViewport}
                >
                    { LOCATIONS.map(this._renderCityMarker) }

                    {this._renderPopup()}

                    <div className="nav" style={navStyle}>
                        <NavigationControl onViewportChange={this.handleViewportChange} />
                    </div>

                    {/*<ControlPanel*/}
                        {/*containerComponent={this.props.containerComponent}*/}
                        {/*onChange={this.handleStyleChange} />*/}

                </MapGL>}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        map_viewport: state.navigationReducer.map_viewport,
        country_selected: state.navigationReducer.country_selected,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMapViewport: (viewport) => dispatch(setMapViewport(viewport)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
