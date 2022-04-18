
mapboxgl.accessToken = env.MAPBOX_ACCESS_TOKEN;
(async () => {
  let targetarr = []
  let cameraarr = []
  let data = JSON.parse(localStorage.getItem('geojson'));
  
  function exists(arr, search) {
    return arr.some(row => row.includes(search));
  }
  let firstid = 0;
  let loopend = true;
  let startid = data.features[0].startid
  loopend = false;
  for (let i = data.features.length - 1; i >= 0; i--) {
    let fets = data.features[i]
    let arrcoor = h3.h3ToGeo(fets.properties.v_id)
    arrcoor = arrcoor.reverse()
    if (!exists(targetarr, arrcoor[0])) {
      targetarr.push(arrcoor)
      cameraarr.push(arrcoor)
    }
    startid = fets.properties.v_id

  }

  let routes = {
    target: targetarr,
    camera: cameraarr
  }

  const map = new mapboxgl.Map({
    container: 'map',
    zoom: 15,
    center: routes.target[0],
    pitch: 56,
    bearing: 180,
    style: 'mapbox://styles/mapbox/satellite-streets-v11',
    interactive: true,
    hash: false
  });
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

  // Start downloading the route data, and wait for map load to occur in parallel
  map.on('load', () => {
    const targetRoute = routes.target;

    const bounds = new mapboxgl.LngLatBounds(
      targetRoute[0],
      targetRoute[targetRoute.length - 2]
    );
    // for (const fets  of  data.features) {    
    for (const coord of targetRoute) {
      bounds.extend(coord);
    }
    // }

    map.fitBounds(bounds, {
      padding: 40
    });





    const pinRoute = targetRoute
    // Create the marker and popup that will display the elevation queries
    const popup = new mapboxgl.Popup({ closeButton: false });
    const marker = new mapboxgl.Marker({
      color: 'red',
      scale: 0.8,
      draggable: false,
      pitchAlignment: 'auto',
      rotationAlignment: 'auto'
    })
      .setLngLat(pinRoute[0])
      .setPopup(popup)
      .addTo(map)
      .togglePopup();

    // Add a line feature and layer. This feature will get updated as we progress the animation
    map.addSource('line', {
      type: 'geojson',
      // Line metrics is required to use the 'line-progress' property
      lineMetrics: true,
      data: {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': pinRoute
        }
      }
    });
    map.addLayer({
      type: 'line',
      source: 'line',
      id: 'line',
      paint: {
        'line-color': 'rgba(0,0,0,0)',
        'line-width': 5
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    });

    // Add some fog in the background
    map.setFog({
      'range': [-0.5, 2],
      'color': 'white',
      'horizon-blend': 0.2
    });

    // Add a sky layer over the horizon
    map.addLayer({
      'id': 'sky',
      'type': 'sky',
      'paint': {
        'sky-type': 'atmosphere',
        'sky-atmosphere-color': 'rgba(85, 151, 210, 0.5)'
      }
    });

    // Add terrain source, with slight exaggeration
    map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.terrain-rgb',
      'tileSize': 512,
      'maxzoom': 14
    });
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

    // await map.once('idle');
    // The total animation duration, in milliseconds
    const animationDuration = 10000;
    // Use the https://turfjs.org/ library to calculate line distances and
    // sample the line at a given percentage with the turf.along function.
    const path = turf.lineString(pinRoute);
    // Get the total line distance
    const pathDistance = turf.lineDistance(path);
    let start;
    function frame(time) {
      if (!start) start = time;
      const animationPhase = (time - start) / animationDuration;
      if (animationPhase > 1) {
        return;
      }

      // Get the new latitude and longitude by sampling along the path
      const alongPath = turf.along(path, pathDistance * animationPhase)
        .geometry.coordinates;
      const lngLat = {
        lng: alongPath[0],
        lat: alongPath[1]
      };

      // Sample the terrain elevation. We round to an integer value to
      // prevent showing a lot of digits during the animation
      const elevation = Math.floor(
        // Do not use terrain exaggeration to get actual meter values
        map.queryTerrainElevation(lngLat, { exaggerated: false })
      );

      // Update the popup altitude value and marker location
      popup.setHTML('Altitude: ' + elevation + 'm<br/>');
      marker.setLngLat(lngLat);

      // Reduce the visible length of the line by using a line-gradient to cutoff the line
      // animationPhase is a value between 0 and 1 that reprents the progress of the animation
      map.setPaintProperty('line', 'line-gradient', [
        'step',
        ['line-progress'],
        'red',
        animationPhase,
        'rgba(255, 0, 0, 0)'
      ]);

      // Rotate the camera at a slightly lower speed to give some parallax effect in the background
      const rotation = 150 - animationPhase * 40.0;
      map.setBearing(rotation % 360);

      window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  })
})();
