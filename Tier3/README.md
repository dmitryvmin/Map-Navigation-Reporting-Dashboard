# MRT
Master Reporting Tool for tracking vaccine refrigerators performance at Country, State, Local Government Agency (LGA), and Facility levels. [Projects docs][PD]. 

### Mapping Framework 

MRT's map view uses Mapbox GL JS and libraries that extends its integration with React - `react-map-gl` and `deck.gl` - Uber's wrappers. Not to be confused with the native Mapbox React lib `react-mapbox-gl` 😝.

Here is a good [primer][primer] on the this stack.

Before switching to geojson polygons to style geographic regions, the map view processed vector tiles served by Mapbox. The switch was made because geojson is more performant, with the tradeoff being that there are no open geojson providers - that data needs to be stored in the app. The app contains legacy code that supports vector tile fetching/styling (see: Map/VectorTileUtils). 

To view and edit vector tiles use [Mapbox Studio][MS].  
Login info:  
u/n: dmitrymin@level11.com   
pass: #1L****r 

### Store

- Main watcher sagas - './Store/Sagas/index.js'
- Navigation updates saga - './Store/Sagas/updateNav.js'
- Data parsing logic for Table and Map views - './Store/Sagas/composeDisplayData.js'

### Libraries

MRT is relies heavily on the following libraries:

###### [Mapbox GL JS][MB] 
###### [React-map-gl][RM]
###### [deck.gl][DG]
###### [Redux-Saga][RS]
###### [reselect][RS]
###### [Recharts.js][Re]
###### [react-minimal-pie-chart][PC]
###### Component Library - [Material UI][MU]
###### JSX Style Guide - [AirBnB React][JS] 

&nbsp;
### Installation

```sh
$ npm install
$ npm start
```

### Todos
 - process data from backend - './Store/Sagas/composeDisplayData.js'
- infinite scroll for the Table View
- build out manufacturer selection 
- add Tests
    
   [MB]: <https://www.mapbox.com/mapbox-gl-js/api/>
   [MU]: <https://material-ui.com>
   [JS]: <https://github.com/airbnb/javascript/tree/master/react>
   [primer]: <https://medium.com/vis-gl/deckgl-and-mapbox-better-together-47b29d6d4fb1>
   [MS]: <https://www.mapbox.com/studio/>
   [RM]: <https://github.com/uber/react-map-gl>
   [DG]: <https://github.com/uber/deck.gl>
   [PC]: <https://github.com/toomuchdesign/react-minimal-pie-chart>
   [RS]: <https://redux-saga.js.org/docs/api/>
   [Re]: <http://recharts.org/en-US/api>
   [RS]: <https://github.com/reduxjs/reselect>
   [PD]: <https://level11.atlassian.net/wiki/spaces/GG/>


