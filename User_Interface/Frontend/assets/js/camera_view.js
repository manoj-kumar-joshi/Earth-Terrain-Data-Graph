mapboxgl.accessToken = env.MAPBOX_ACCESS_TOKEN;
        (async () => {
                var RestAppURL =env.RestAppURL; 
                let targetarr = []
                let cameraarr = []
                let data = JSON.parse(localStorage.getItem('geojson'));
                function exists(arr, search) {
                  return arr.some(row => row.includes(search));
                }
                
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
                  pitch: 10,
                  // bearing: 180,
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

                  map.addLayer({
                    type: 'line',
                    source: 'line',
                    id: 'line',
                    paint: {
                      'line-color': 'orange',
                      'line-width': 5
                    },
                    layout: {
                      'line-cap': 'round',
                      'line-join': 'round'
                    }
                  });


                })

                map.on('load', () => {
                  const targetRoute = routes.target;
                  // this is the path the camera will move along
                  const cameraRoute = routes.camera;
                  const animationDuration = 60000;
                  const cameraAltitude = 1000;
                  // get the overall distance of each route so we can interpolate along them
                  const routeDistance = turf.lineDistance(turf.lineString(targetRoute));
                  const cameraRouteDistance = turf.lineDistance(
                    turf.lineString(cameraRoute)
                  );

                  let start;

                  function frame(time) {
                    if (!start) start = time;
                    // phase determines how far through the animation we are
                    const phase = (time - start) / animationDuration;

                    // phase is normalized between 0 and 1
                    // when the animation is finished, reset start to loop the animation
                    if (phase > 1) {
                      // wait 1.5 seconds before looping
                      setTimeout(() => {
                        //start = 0.0;
                      }, 1500);
                    }

                    // use the phase to get a point that is the appropriate distance along the route
                    // this approach syncs the camera and route positions ensuring they move
                    // at roughly equal rates even if they don't contain the same number of points
                    const alongRoute = turf.along(
                      turf.lineString(targetRoute),
                      routeDistance * phase
                    ).geometry.coordinates;

                    const alongCamera = turf.along(
                      turf.lineString(cameraRoute),
                      cameraRouteDistance * phase
                    ).geometry.coordinates;

                    const camera = map.getFreeCameraOptions();

                    // set the position and altitude of the camera
                    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
                      {
                        lng: alongCamera[0],
                        lat: alongCamera[1]
                      },
                      cameraAltitude
                    );

                    // tell the camera to look at a point along the route
                    camera.lookAtPoint({
                      lng: alongRoute[0],
                      lat: alongRoute[1]
                    });

                    map.setFreeCameraOptions(camera);

                    window.requestAnimationFrame(frame);
                  }

                  window.requestAnimationFrame(frame);
                });


              })();

