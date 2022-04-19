
## Demo User Interface of Showing TigerGraph with GeoSpatial Data.

This demo uses API build using [TigerGraph RESTAPP](https://docs.tigergraph.com/tigergraph-server/current/api/authentication) with geospatial data and [mapbox-gl-js](https://docs.mapbox.com/mapbox-gl-js/guides/) and BootStrap html to render Mapbox maps with different layers on top using the geospatial data from [demo tigergraph backand API's](https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/tree/main/User_Interface/Backend).


### Demo

**Preview on [demo.electronbridge.com](https://demo.electronbridge.com/os/TigerGraphEB/)**

1. Discover trail to nearest road in hilly area. [Demo](https://demo.electronbridge.com/os/TigerGraphEB/trailroad.html)<br>
<p align="left">
  <img alt="Light" src="https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/blob/main/User_Interface/Frontend/assets/img/screenshots/Screenshot1.png" width="180px" height="250px">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Dark" src="https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/blob/main/User_Interface/Frontend/assets/img/screenshots/Screenshot2.png" width="180px" height="250px">
</p>

2. Road or Pipeline layout path planning.  <br> <img src="https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/blob/main/User_Interface/Frontend/assets/img/screenshots/Screenshot3.png" width="450px">

#### To start setting up the project

Step 1: Clone the repo

```bash
git clone https://github.com/ElectronBridge/Earth-Terrain-Data-Graph
```

Step 2: cd into the cloned repo and run:

```bash
copy forntend folder in any webserver i.e Nginx , Apache
```

Step 3: Put your credentials in the .env file. (**Skip this step you wan to use provided credentials**)

```bash
accessToken=MAPBOX ACCESS TOKEN.
RestAppURL=URL of API runnnig ex: "http://127.0.0.1:3000/api/v1/" .
```
[Backand API's](https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/tree/main/User_Interface/Backend)

Step 4: Browse the APP by

```bash
Visit http://127.0.0.1/frontend to load the demo. 
```

### Usage

```
1. Go to http://127.0.0.1/frontend
2. Select any 2 points in the loaded map.
3. Click Button "GET PATH" to get the result 
4. Can See camera along path view and 360 view.
```
## Details

- [MAPBOX ACCESS TOKEN](https://account.mapbox.com/)  GET MAPBOX ACCESS TOKEN.

#### Useful Utilities

- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/)
- http://geojson.io
- [Turf.js](https://turfjs.org)
- https://getbootstrap.com/
