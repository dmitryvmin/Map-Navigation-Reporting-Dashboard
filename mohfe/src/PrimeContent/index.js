import React, { Component } from 'react';
import Moh from './Moh';
import People from './People';
import 'typeface-roboto';  // Font

export default class PrimeContent extends Component {
  // constructor (props, context) {
  //   super(props, context);
  // }

  ContentArea(state) {
      switch(state) {
          case 'dashboard':
              return <Moh />;
          case 'people':
              return <People />;
          default:
              return <div>Filler</div>;
      }
  }

  render () {
    return (
      <div>
        { this.ContentArea(this.props.content) }
        <div style={{height:"250px"}}/>
      </div>
      )
    }
}
