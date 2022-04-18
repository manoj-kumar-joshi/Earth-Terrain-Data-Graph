
mapboxgl.accessToken = env.MAPBOX_ACCESS_TOKEN;
let minelv = 0;
let maxelv = 0;
let mincol = '#55f704';
let maxcol = '#8f0305';
let markersrc = '';
let markerdst = '';
let data = {};
let strUser = "elevation_angle";
let response_data1 = [];
const coordinates1 = document.getElementById('coordinates1');
var el = document.getElementById('bar');
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-v9', // style URL
    center: [-120.11508138343993, 33.9447004335335], // ststyle: 'mapbox://styles/mapbox/satellite-v9',
    speed: 1,
    curve: 0.5,
    pitch: 36, // pitch in degrees
    // bearing: -80, // bearing in degrees
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
//  map.addControl(new mapboxgl.FullscreenControl());
map.addControl(draw);

map.on('draw.create', updateArea);
map.on('draw.delete', deleteall);
map.on('draw.update', updateArea);
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
                        ['get', strUser],
                        minelv,
                        //    '#FCA107',
                        // 'lime',
                        //   '#ebf5e7',
                        mincol,
                        maxelv,
                        //    '#7F3121',
                        //   '#005c25'
                        maxcol
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
                        ['get', strUser],
                        minelv,
                        //    '#FCA107',
                        // 'lime',
                        //   '#ebf5e7',
                        mincol,
                        maxelv,
                        //    '#7F3121',
                        //   '#005c25'
                        maxcol
                    ]
                }
            });
        }
    }, 1500);
}
function deleteall(e) {
    var e = document.getElementById("ddlViewBy");
    e.focus()
    if (typeof map.getLayer('earthquake-circles') !== 'undefined') {
        map.removeLayer('earthquake-circles');
        map.removeSource('earthquakes')

    } else {
        // draw.deleteAll()
        // let ids=draw.getAll().features[0].id
        // draw.delete(ids)
    }
    if (markersrc != '') {
        markersrc.remove()
        markersrc = ''
    }
    if (markerdst != '') {

        markerdst.remove()
        markerdst = ''
    }

}
function updateArea(e) {
    const data2 = draw.getAll();
    if (markersrc == '' && draw.getAll().features.length > 0) {
        markersrc = new mapboxgl.Marker({
            draggable: false
        })
            .setLngLat(draw.getAll().features[0].geometry.coordinates)
            .addTo(map);

    }
    else if (markerdst == '' && markersrc != '' && draw.getAll().features.length > 1) {
        markerdst = new mapboxgl.Marker({
            color: 'red',
            draggable: false
        })
            .setLngLat(draw.getAll().features[1].geometry.coordinates)
            .addTo(map);

    }

}
function drawreslayer(response_data, id) {
    let featuresdataarr = []
    for (var i = 0; i < response_data.length; i++) {
        let featuresdata = {
            "type": "Feature",
            "properties": {},
            //"properties": response_data[i]['elevation'][0],
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": h3.h3SetToMultiPolygon([response_data[i]], true)
                //    "coordinates": h3SetToMultiPolygon([response_data[i]['id']], true)
            },
            "id": response_data[i]
            //  "id": response_data[i]['id']
        }
        featuresdataarr.push(featuresdata);
    }
    let data = {
        "type": "FeatureCollection",
        "features": featuresdataarr
    }
    data = JSON.parse(JSON.stringify(data));
    if (typeof map.getSource('res10_node_set' + id) === 'undefined') {
        map.addSource('res10_node_set' + id, {
            'type': 'geojson',
            data: data
        });
    } else {
        map.removeLayer('res10_node_set-circles' + id);
        map.removeSource('res10_node_set' + id)
        map.addSource('res10_node_set' + id, {
            'type': 'geojson',
            data: data
        });
    }
    map.addLayer({
        'id': 'res10_node_set-circles' + id,
        'type': 'fill',
        'source': 'res10_node_set' + id,
        'paint': {
            'fill-color': 'grey', // blue color fill
            'fill-opacity': 0.5
        }
    });

}

$('#res10').change(function () {
    if (this.checked) {
        if (response_data1.length > 0) {
            drawreslayer(response_data1[0]['@@res10_node_set'], '_10');
        }

    }
    else {
        if (typeof map.getLayer('res10_node_set-circles_10') !== 'undefined') {
            map.removeLayer('res10_node_set-circles_10');
            map.removeSource('res10_node_set_10')

        }
    }
});
$('#res11').change(function () {
    if (this.checked) {
        if (response_data1.length > 0) {
            drawreslayer(response_data1[1]['@@res11_node_set'], '_11');
        }
    }
    else {
        if (typeof map.getLayer('res10_node_set-circles_11') !== 'undefined') {
            map.removeLayer('res10_node_set-circles_11');
            map.removeSource('res10_node_set_11')

        }

    }
});
$('#res12').change(function () {
    if (this.checked) {
        if (typeof map.getLayer('earthquake-circles') !== 'undefined') {
            map.setLayoutProperty('earthquake-circles', 'visibility', 'visible');
        }
    }
    else {
        if (typeof map.getLayer('earthquake-circles') !== 'undefined') {
            map.setLayoutProperty('earthquake-circles', 'visibility', 'none');

        }
    }
});
function getproperty(sel) {
    const property_name = document.getElementById('property_name');
    property_name.innerHTML = ``;
    if (sel.value == 'ndvi') {
        property_name.innerHTML =  `(Ndvi)`;
        mincol = '#ebf5e7'
        maxcol = '#005c25';
        el.style.background = "linear-gradient(to right, #ebf5e7, #005c25)";
    }
    else if (sel.value == 'smoothness_percent') {
        property_name.innerHTML =`(Smoothness)`;
        mincol = '#8f0305';
        maxcol = '#55f704';
        el.style.background = "linear-gradient(to right, #8f0305, #55f704)";
    } else {
        property_name.innerHTML = `(Elevation)`;
        mincol = '#55f704';
        maxcol = '#8f0305';
        el.style.background = "linear-gradient(to right, #55f704, #8f0305)";
    }
    if (response_data1.length > 0) {
        drawlayer(response_data1)
    }

}
function drawlayer(response_data1) {
    minelv = 0;
    maxelv = 0;
    var e = document.getElementById("ddlViewBy");
    strUser = e.value;

    let response_data = response_data1[2]['@@resultset']
    let featuresdataarr = []

    if (response_data.length > 1) {
        coordinates1.style.display = 'block';
        coordinates1.innerHTML = `No of hops (Res12) : ${response_data1[2]['@@resultset'].length } <br>No of hops (Res11) : ${response_data1[1]['@@res11_node_set'].length } <br>No of hops (Res10) : ${response_data1[0]['@@res10_node_set'].length } <br>Total Distance : ${((response_data.length - 1) * 16.31).toFixed(0)} meters.`;
        for (var i = 0; i < response_data.length; i++) {
            if (i == 0) {
                minelv = response_data[i][strUser]
            }
            if (response_data[i][strUser] < minelv) {
                minelv = response_data[i][strUser]
            }
            if (response_data[i][strUser] > maxelv) {
                maxelv = response_data[i][strUser]
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
                "startid": h3.h3SetToMultiPolygon([response_data[response_data.length - 1]['v_id']], true),
                "endid": h3.h3SetToMultiPolygon([response_data[0]['v_id']], true)
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

        let camera_btn = document.getElementById('camera_btn');
        camera_btn.style.display = 'block';
        let path_btn = document.getElementById('360_btn');
        path_btn.style.display = 'block';
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
                    ['get', strUser],
                    minelv,
                    //    '#FCA107',
                    // 'lime',
                    //   '#ebf5e7',
                    mincol,
                    maxelv,
                    //    '#7F3121',
                    //   '#005c25'
                    maxcol
                ]
            }
        });
        if (data.features.length > 2) {
            const coordinates = data.features[0].geometry.coordinates[0][0];
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
                //padding: 80
            });
        }
        map.flyTo({ zoom: 14 })
        map.on('mousemove', 'earthquake-circles', (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Use the first found feature.
            const feature = e.features[0].properties;
            let pi = Math.PI;

            //let degree = ((Math.atan(feature.ndvi / 16.31)) * (180 / pi)).toFixed(4)
            const mapoverlay2 = document.getElementById('mapoverlay2');
            mapoverlay2.style.display = 'block';
            mapoverlay2.innerHTML = `<p><strong>smoothness</strong>  : ${feature.smoothness_percent}</p><p><strong>Ndvi</strong>  : ${feature.ndvi}</p><p><strong>elevation</strong> : ${feature.elevation_angle}</p>`;
            //mapoverlay2.innerHTML = `<p><strong>elevation</strong> : ${feature.ndvi}</p><p><strong>Angle </strong> : ${degree}°</p>`;
        });
        map.on('mouseleave', 'earthquake-circles', () => {
            map.getCanvas().style.cursor = '';
            mapoverlay2.style.display = 'none';
        });

    }
    else {
        alert('Empty response in Api.')
        $("#btngetpath").attr("disabled", false);
        $("#btngetpath span").addClass('visually-hidden');
    }
}

function getpath() {

    $("#btngetpath").attr("disabled", true);
    $("#btngetpath span").removeClass('visually-hidden');
    let path_btn = document.getElementById('360_btn');
    path_btn.style.display = 'none';
    let camera_btn = document.getElementById('camera_btn');
    camera_btn.style.display = 'none';

    if (draw.getAll().features.length >= 2) {

        const start = [draw.getAll().features[0].geometry.coordinates[0], draw.getAll().features[0].geometry.coordinates[1]];
        const end = [draw.getAll().features[1].geometry.coordinates[0], draw.getAll().features[1].geometry.coordinates[1]];
        map.setCenter(start);
        let isAtStart = true;
        const target = isAtStart ? end : start;
        let source_vertex = h3.geoToH3(draw.getAll().features[0].geometry.coordinates[1], draw.getAll().features[0].geometry.coordinates[0], 12)
        let target_vertex = h3.geoToH3(draw.getAll().features[1].geometry.coordinates[1], draw.getAll().features[1].geometry.coordinates[0], 12)
        let source_vertex_11 = h3.geoToH3(draw.getAll().features[0].geometry.coordinates[1], draw.getAll().features[0].geometry.coordinates[0], 11)
        let target_vertex_11 = h3.geoToH3(draw.getAll().features[1].geometry.coordinates[1], draw.getAll().features[1].geometry.coordinates[0], 11)
        let source_vertex_10 = h3.geoToH3(draw.getAll().features[0].geometry.coordinates[1], draw.getAll().features[0].geometry.coordinates[0], 10)
        let target_vertex_10 = h3.geoToH3(draw.getAll().features[1].geometry.coordinates[1], draw.getAll().features[1].geometry.coordinates[0], 10)
        let tableItem = {};
        tableItem.data = {
            "source_vertex": source_vertex,
            "target_vertex": target_vertex,
            "source_vertex_11": source_vertex_11,
            "target_vertex_11": target_vertex_11,
            "source_vertex_10": source_vertex_10,
            "target_vertex_10": target_vertex_10,
            "thd_elv_diff": 20,
            "thd_smooth": 90,
            "display": 1
        }

        var settings = {
            "url": env.RestAppURL + "get_polygon",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(tableItem.data),
        };

        $.ajax(settings).done(function (response) {
            //    response =`[{"@@res10_node_set": ["8a2912ac57b7fff", "8a2912ac54cffff", "8a2912ac08dffff", "8a2912ac08cffff", "8a2912ac0bb7fff", "8a2912ac0b1ffff", "8a2912ac57a7fff", "8a2912ac0a27fff", "8a2912ac0b87fff", "8a2912ac0baffff", "8a2912ac0b57fff", "8a2912ac0b47fff", "8a2912ac0b67fff"]}, {"@@res11_node_set": ["8b2912ac57a0fff", "8b2912ac57a4fff", "8b2912ac57a6fff", "8b2912ac57a2fff", "8b2912ac57b2fff", "8b2912ac54cafff", "8b2912ac0b65fff", "8b2912ac54cbfff", "8b2912ac0b44fff", "8b2912ac0b55fff", "8b2912ac0bb1fff", "8b2912ac08defff", "8b2912ac0b63fff", "8b2912ac0bb2fff", "8b2912ac0b56fff", "8b2912ac0a20fff", "8b2912ac54c8fff", "8b2912ac08cefff", "8b2912ac0b84fff", "8b2912ac08c8fff", "8b2912ac0baafff", "8b2912ac0b61fff", "8b2912ac08c9fff", "8b2912ac0a25fff", "8b2912ac08ddfff", "8b2912ac57b5fff", "8b2912ac0bb3fff", "8b2912ac08d8fff", "8b2912ac0b85fff", "8b2912ac0ba8fff", "8b2912ac57a3fff", "8b2912ac0b46fff", "8b2912ac0badfff", "8b2912ac54c9fff", "8b2912ac0b1afff", "8b2912ac57b0fff", "8b2912ac0b1bfff", "8b2912ac0a26fff", "8b2912ac0a24fff", "8b2912ac0b54fff"]}, {"@@resultset": [{"v_id": "8c2912ac08d8dff", "ndvi": 0.18665, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac08d89ff", "ndvi": 0.17641, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac08dd5ff", "ndvi": 0.25806, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac08dd1ff", "ndvi": 0.28371, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac08dd9ff", "ndvi": 0.33628, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac08ce5ff", "ndvi": 0.34219, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac08ce1ff", "ndvi": 0.29092, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac08ce3ff", "ndvi": 0.30194, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac08c8dff", "ndvi": 0.24889, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac08c81ff", "ndvi": 0.25017, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac08c83ff", "ndvi": 0.24698, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac08c9dff", "ndvi": 0.25778, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac08c91ff", "ndvi": 0.19967, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac08c9bff", "ndvi": 0.14713, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0bb27ff", "ndvi": 0.22178, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0bb23ff", "ndvi": 0.25036, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0bb3dff", "ndvi": 0.30611, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0bb39ff", "ndvi": 0.28689, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0bb15ff", "ndvi": 0.14415, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0bb17ff", "ndvi": 0.05974, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0bb13ff", "ndvi": 0.07303, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b84dff", "ndvi": 0.14434, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b841ff", "ndvi": 0.13914, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b843ff", "ndvi": 0.14718, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b84bff", "ndvi": 0.20533, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b85dff", "ndvi": 0.20001, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b851ff", "ndvi": 0.17599, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b859ff", "ndvi": 0.17819, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b85bff", "ndvi": 0.14138, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0baadff", "ndvi": 0.1447, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0baa5ff", "ndvi": 0.14926, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0baa1ff", "ndvi": 0.18115, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0baa9ff", "ndvi": 0.1754, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0ba85ff", "ndvi": 0.13579, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0ba81ff", "ndvi": 0.16916, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0ba8bff", "ndvi": 0.25067, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0bad7ff", "ndvi": 0.27361, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0bad3ff", "ndvi": 0.18818, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b1a5ff", "ndvi": 0.18229, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b1a7ff", "ndvi": 0.21059, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0b1a3ff", "ndvi": 0.35682, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b1bdff", "ndvi": 0.32207, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0b1b9ff", "ndvi": 0.26612, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0b1bbff", "ndvi": 0.15185, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0a26dff", "ndvi": 0.14701, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0a269ff", "ndvi": 0.22736, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0a26bff", "ndvi": 0.20984, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0a245ff", "ndvi": 0.25762, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0a241ff", "ndvi": 0.24123, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0a243ff", "ndvi": 0.25145, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0a25dff", "ndvi": 0.19188, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0a259ff", "ndvi": 0.20565, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0b565ff", "ndvi": 0.29419, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0b561ff", "ndvi": 0.28145, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0b56bff", "ndvi": 0.28869, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0b547ff", "ndvi": 0.35438, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b543ff", "ndvi": 0.32322, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b55dff", "ndvi": 0.27098, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b559ff", "ndvi": 0.24934, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b465ff", "ndvi": 0.24966, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b461ff", "ndvi": 0.18333, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b46bff", "ndvi": 0.2102, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0b445ff", "ndvi": 0.2253, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b441ff", "ndvi": 0.24295, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b44bff", "ndvi": 0.30759, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b637ff", "ndvi": 0.22615, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b635ff", "ndvi": 0.29465, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0b63dff", "ndvi": 0.32205, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac0b639ff", "ndvi": 0.30133, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b615ff", "ndvi": 0.27352, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b61dff", "ndvi": 0.3194, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b657ff", "ndvi": 0.34004, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b651ff", "ndvi": 0.337, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac0b659ff", "ndvi": 0.3524, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac54cb3ff", "ndvi": 0.2058, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac54cb1ff", "ndvi": 0.16619, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac54cbdff", "ndvi": 0.24656, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac54cb9ff", "ndvi": 0.18379, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac54c95ff", "ndvi": 0.2485, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac54c91ff", "ndvi": 0.30654, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac54c9bff", "ndvi": 0.27147, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac57b27ff", "ndvi": 0.25296, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac57b23ff", "ndvi": 0.21432, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac57b2bff", "ndvi": 0.2416, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac57b07ff", "ndvi": 0.22428, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac57b03ff", "ndvi": 0.20234, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac57b0bff", "ndvi": 0.19571, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac57b57ff", "ndvi": 0.22522, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac57b55ff", "ndvi": 0.2561, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac57b51ff", "ndvi": 0.21815, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac57b53ff", "ndvi": 0.21375, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac57a25ff", "ndvi": 0.18538, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac57a21ff", "ndvi": 0.25242, "elevation_angle": 0, "smoothness_percent": 100}, {"v_id": "8c2912ac57a23ff", "ndvi": 0.22032, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac57a35ff", "ndvi": 0.15385, "elevation_angle": 5, "smoothness_percent": 100}, {"v_id": "8c2912ac57a37ff", "ndvi": 0.15498, "elevation_angle": 0, "smoothness_percent": 0}]}]`

            $("#btngetpath").attr("disabled", false);
            $("#btngetpath span").addClass('visually-hidden');
            response_data1 = JSON.parse(response)

            drawlayer(response_data1);


            //   });
        })
            .fail(function (response) {
                alert('Error In tigergraph Api.')
                $("#btngetpath").attr("disabled", false);
                $("#btngetpath span").addClass('visually-hidden');
            });
    }
    else {
        $("#btngetpath").attr("disabled", false);
        $("#btngetpath span").addClass('visually-hidden');
        alert('please select source and destination!');
    }
}

