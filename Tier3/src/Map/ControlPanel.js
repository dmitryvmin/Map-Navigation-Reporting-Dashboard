import React, {PureComponent} from 'react';
import {fromJS} from 'immutable';
import MAP_STYLE from '../Data/style.json';

const defaultMapStyle = fromJS(MAP_STYLE);

const categories = ['countries', 'states'];

// Layer id patterns by category
const layerSelector = {
    countries: /countries/,
    states: /states/,
    // ngas: /ngas/,
};

// Layer color class by type
const colorClass = {
    line: 'line-color',
    fill: 'fill-color',
    background: 'background-color',
    symbol: 'text-color'
};

const defaultContainer = ({children}) => <div className="control-panel">{children}</div>;

export default class StyleControls extends PureComponent {

    constructor(props) {
        super(props);

        this._defaultLayers = defaultMapStyle.get('layers');

        this.state = {
            visibility: {
                countries: true,
                states: false,
                ngas: false,
            },
            color: {
                countries: 'salmon',
                states: 'green',
                ngas: 'yellow',

            }
        };
    }

    componentDidMount() {
        this._updateMapStyle(this.state);
    }

    _onVisibilityChange(name, event) {
        const visibility = {...this.state.visibility, [name]: event.target.checked};
        this.setState({visibility});
        this._updateMapStyle({...this.state, visibility});
    }

    _updateMapStyle({visibility, color}) {

        const layers = this._defaultLayers
            .filter(layer => {
                const id = layer.get('id');
                return categories.every(name => visibility[name] || !layerSelector[name].test(id));
            })
            .map(layer => {
                const id = layer.get('id');
                const type = layer.get('type');
                const category = categories.find(name => layerSelector[name].test(id));
                if (category && colorClass[type]) {
                    return layer.setIn(['paint', colorClass[type]], color[category]);
                }
                return layer;
            });

        this.props.onChange(defaultMapStyle.set('layers', layers));
    }

    _renderLayerControl(name) {
        const {visibility, color} = this.state;

        return (
            <div key={name} className="input">
                <label>{name}</label>
                <input type="checkbox" checked={visibility[name]}
                       onChange={this._onVisibilityChange.bind(this, name)} />
            </div>
        );
    }

    render() {
        const Container = this.props.containerComponent || defaultContainer;

        return (
            <Container>
                { categories.map(name => this._renderLayerControl(name)) }
            </Container>
        );
    }
}