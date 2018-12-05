import React, {PureComponent} from 'react';

export default class CityInfo extends PureComponent {

    render() {
        const {info} = this.props;
        const displayName = `${info.city}`;

        return (
            <div>
                <h3>{displayName}</h3>
                <div>
                    <p>Device Health</p>
                    <p>Contact Info</p>
                </div>
            </div>
        );
    }
}