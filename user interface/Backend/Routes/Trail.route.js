const express = require('express');
const router = express.Router();

const TrailController = require('../Controllers/Trail.Controller');

//Get a list of all trails
router.post('/get_polygon', TrailController.get_polygon);
router.post('/s_shortest_pathtoroad', TrailController.s_shortest_pathtoroad);



module.exports = router;
