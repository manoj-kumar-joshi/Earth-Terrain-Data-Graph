const createError = require('http-errors');
var axios = require('axios');


module.exports = {
    get_polygon: async(req, res, next) => {
        result = req.body
        url = process.env.TG_RestAppURL + "/query/" + process.env.TG_GRAPHNAME + "/tg_multi_step_search?source_vertex_12=" +
            result['source_vertex'] + "&target_vertex_12=" + result['target_vertex'] + "&search_area_ratio=1.5&display=0"
        
        var config = {
            method: 'get',
            url: url,
            headers: {
                'GSQL-TIMEOUT': '90000',
                'Authorization': 'Bearer ' + process.env.TG_SECRET
            }
        };

        axios(config)
            .then(function(response) {
                
                let response_json = response.data
                
                if (Object.keys(response_json).length > 3) {
                    
                    res.send(JSON.stringify(response_json['results']));
                } else {
                    res.send(JSON.stringify([]));
                }
            })
            .catch(function(error) {
                res.send(JSON.stringify([{"error":error.message}]));
            });
    },

    s_shortest_pathtoroad: async(req, res, next) => {
      
        result = req.body
        url = process.env.TG_RestAppURL + "/query/" + process.env.TG_GRAPHNAME + "/tg_walkable_trail_to_nearest_road?source_vertex_12=" + 
            result['source_vertex']+"&search_area_ratio=1.5&display=1&max_hops=500"
        // console.log(url)
        var config = {
            method: 'get',
            url: url,
            headers: {
                'GSQL-TIMEOUT': '90000',
                'Authorization': 'Bearer ' + process.env.TG_SECRET
            }
        };

        axios(config)
            .then(function(response) {
                
                let response_json = response.data
                
                if (Object.keys(response_json).length > 3) {
                    
                    res.send(JSON.stringify(response_json['results']));
                } else {
                    res.send(JSON.stringify([]));
                }
            })
            .catch(function(error) {
                res.send(JSON.stringify([{"error":error.message}]));
            });
     }
};