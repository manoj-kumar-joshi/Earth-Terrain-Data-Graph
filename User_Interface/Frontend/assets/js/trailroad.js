
mapboxgl.accessToken = env.MAPBOX_ACCESS_TOKEN;
let data = {};
let minelv = 0;
let maxelv = 0;
const coordinates1 = document.getElementById('coordinates');
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/satellite-v9', // style URL
  center: [-120.11508138343993, 33.9447004335335], // ststyle: 'mapbox://styles/mapbox/satellite-v9',
  speed: 1,
  curve: 0.5,
  pitch: 36, // pitch in degrees
  //bearing: -80, // bearing in degrees
  zoom: 12
});
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
const draw = new MapboxDraw({
  displayControlsDefault: false,
  // Select which mapbox-gl-draw control buttons to add to the map.
  controls: {
    point: true,
    trash: true
  },
  // Set mapbox-gl-draw to draw by default.
  // The user does not have to click the polygon control button first.
  defaultMode: 'draw_point'
});
const marker = new mapboxgl.Marker({
  draggable: true
})
  .setLngLat([-120.11508138343993, 33.9447004335335])
  .addTo(map);
// map.addControl(draw);

// map.on('draw.create', updateArea);
// map.on('draw.delete', deleteall);
// map.on('draw.update', updateArea);
function stalliteFunction() {
  $("#satellitebtn").removeClass('btn-light');
  $("#streetbtn").removeClass('btn-primary');
  $("#satellitebtn").addClass('btn-primary');
  $("#streetbtn").addClass('btn-light');
  map.setStyle('mapbox://styles/mapbox/satellite-v9')
  setTimeout(function () {
    if (Object.keys(data).length !== 0) {
      if (typeof map.getSource('earthquakes') === 'undefined') {
        map.addSource('earthquakes', {
          'type': 'geojson',
          data: data
        });
      } else {
        map.removeLayer('earthquake-circles');
        map.removeSource('earthquakes')
        map.addSource('earthquakes', {
          'type': 'geojson',
          data: data
        });
      }

      map.addLayer({
        'id': 'earthquake-circles',
        'type': 'fill',
        'source': 'earthquakes',
        'paint': {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'elevation_angle'],
            minelv,
            //    '#FCA107',
            // 'lime',
            '#55f704',
            maxelv,
            //    '#7F3121',
            '#8f0305'
          ]
        }
      });
    }
  }, 1500);
}
function streetFunction() {
  $("#streetbtn").removeClass('btn-light');
  $("#satellitebtn").removeClass('btn-primary');
  $("#satellitebtn").addClass('btn-light');
  $("#streetbtn").addClass('btn-primary');
  map.setStyle('mapbox://styles/mapbox/streets-v11')
  setTimeout(function () {

    if (Object.keys(data).length !== 0) {
      if (typeof map.getSource('earthquakes') === 'undefined') {
        map.addSource('earthquakes', {
          'type': 'geojson',
          data: data
        });
      } else {
        map.removeLayer('earthquake-circles');
        map.removeSource('earthquakes')
        map.addSource('earthquakes', {
          'type': 'geojson',
          data: data
        });
      }

      map.addLayer({
        'id': 'earthquake-circles',
        'type': 'fill',
        'source': 'earthquakes',
        'paint': {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'elevation_angle'],
            minelv,
            //    '#FCA107',
            // 'lime',
            '#55f704',
            maxelv,
            //    '#7F3121',
            '#8f0305'
          ]
        }
      });
    }
  }, 1500);
}
function deleteall(e) {

  if (typeof map.getLayer('earthquake-circles') !== 'undefined') {
    map.removeLayer('earthquake-circles');
  }
  else {
    draw.deleteAll()
  }
}
function updateArea(e) {
  const data = draw.getAll();

}
function onDragEnd() {
  marker.setDraggable(false)
  const lngLat = marker.getLngLat();

  getpath(lngLat)
}
marker.on('dragend', onDragEnd);

function getpath(lngLat) {

  $("#btngetpath").removeClass('visually-hidden');

  camera_btn.style.display = 'none';
  //   if (draw.getAll().features == 'undefiend') {
  //     alert('please select source!');
  //   }
  //   if (draw.getAll().features.length >= 1) {

  const start = [lngLat.lng, lngLat.lat];
  // const start = [draw.getAll().features[0].geometry.coordinates[0], draw.getAll().features[0].geometry.coordinates[1]];
  const end = [lngLat.lng, lngLat.lat];
  // const end = [draw.getAll().features[0].geometry.coordinates[0], draw.getAll().features[0].geometry.coordinates[1]];
  map.setCenter(start);
  let isAtStart = true;
  const target = isAtStart ? end : start;
  let source_vertex = h3.geoToH3(lngLat.lat, lngLat.lng, 12)
  let tableItem = {};
  tableItem.data = {
    "source_vertex": source_vertex,
    "thd_elv_diff": 20,
    "thd_smooth": 90,
    "display": 1
  }

  var settings = {
    "url": env.RestAppURL + "s_shortest_pathtoroad",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify(tableItem.data),
  };

  $.ajax(settings).done(function (response) {


    // $("#btngetpath span").addClass('visually-hidden');
    response_data1 = JSON.parse(response)
    response_data = response_data1[1]['@@resultset']
    let featuresdataarr = []

    if (response_data.length > 0) {
      coordinates1.style.display = 'block';
      coordinates1.innerHTML = `<p>Total Distance : ${((response_data.length - 1) * 16.31).toFixed(0)} meters.<p>`;
      for (var i = 0; i < response_data.length; i++) {

        if (response_data[i]['elevation_angle'] < minelv) {
          minelv = response_data[i]['elevation_angle']
        }
        if (response_data[i]['elevation_angle'] > maxelv) {
          maxelv = response_data[i]['elevation_angle']
        }
        let featuresdata = {
          "type": "Feature",
          "properties": response_data[i],
          //"properties": response_data[i]['elevation'][0],
          "geometry": {
            "type": "MultiPolygon",
            "coordinates": h3.h3SetToMultiPolygon([response_data[i]['v_id']], true)
            //    "coordinates": h3SetToMultiPolygon([response_data[i]['id']], true)
          },
          "id": response_data[i]['v_id'],
          "startid": source_vertex,
          "endid": source_vertex
          //  "id": response_data[i]['id']
        }
        featuresdataarr.push(featuresdata);
      }
      data = {
        "type": "FeatureCollection",
        "features": featuresdataarr
      }
      data = JSON.parse(JSON.stringify(data));
      //console.log(JSON.stringify(data))

      // const camera_btn = document.getElementById('camera_btn');
      // camera_btn.style.display = 'block';

      localStorage.setItem('geojson', JSON.stringify(data));
      if (typeof map.getSource('earthquakes') === 'undefined') {
        map.addSource('earthquakes', {
          'type': 'geojson',
          data: data
        });
      } else {
        map.removeLayer('earthquake-circles');
        map.removeSource('earthquakes')
        map.addSource('earthquakes', {
          'type': 'geojson',
          data: data
        });
      }

      map.addLayer({
        'id': 'earthquake-circles',
        'type': 'fill',
        'source': 'earthquakes',
        'paint': {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'elevation_angle'],
            minelv,
            //    '#FCA107',
            // 'lime',
            '#55f704',
            maxelv,
            //    '#7F3121',
            '#8f0305'
          ]
        }
      });

      const coordinates = data.features[0].geometry.coordinates[0][0];
      if (data.features.length > 2) {


        const bounds = new mapboxgl.LngLatBounds(
          coordinates[data.features[0].geometry.coordinates[0][0][0]],
          coordinates[data.features[data.features.length - 2].geometry.coordinates[0][0][0]]
        );
        for (const fets of data.features) {
          for (const coord of fets.geometry.coordinates[0][0]) {
            bounds.extend(coord);
          }
        }

        map.fitBounds(bounds, {
          padding: 10
        });
      }
      map.flyTo({ zoom: 15 })
      map.on('mousemove', 'earthquake-circles', (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Use the first found feature.
        const feature = e.features[0].properties;
        let pi = Math.PI;

        let degree = ((Math.atan(feature.ndvi / 16.31)) * (180 / pi)).toFixed(4)
        const mapoverlay2 = document.getElementById('mapoverlay2');
        mapoverlay2.style.display = 'block';
        mapoverlay2.innerHTML = `<p><strong>ndvi</strong>  : ${feature.ndvi}</p><p><strong>smoothness</strong>  : ${feature.smoothness_percent}</p><p><strong>elevation</strong> : ${feature.elevation_angle}</p>`;
        //mapoverlay2.innerHTML = `<p><strong>elevation</strong> : ${feature.ndvi}</p><p><strong>Angle </strong> : ${degree}°</p>`;
      });
      map.on('mouseleave', 'earthquake-circles', () => {
        map.getCanvas().style.cursor = '';
        mapoverlay2.style.display = 'none';
      });
      marker.setDraggable(true)
      $("#btngetpath").addClass('visually-hidden');
    }
    else {
      alert('Empty response in Api.')
      marker.setDraggable(true)
      $("#btngetpath").addClass('visually-hidden');
    }



    //   });
  }).fail(function (response) {
    alert('Error In tigergraph Api.')
    marker.setDraggable(true)
    $("#btngetpath").addClass('visually-hidden');
  });
  //   }
  //   else {
  //     alert('please select source!');
  //   }
}

