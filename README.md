
# Earth-Terrain-Data-Graph

#### Contributers and Contact Information: 

- Manoj Kumar Joshi (Email:- manoj@electronbridge.com)
- Ashok Barthwal (Email:- ashok.barthwal@electronbridge.com)
- yogesh Kumar (Email:- yogesh.kumar@electronbridge.com)

#### Problem Statement : Empower Rescue team and Volunteers with Earth Observation Data

Earth observation data is crucial in natural/disaster response and other accidental stranded people cases in national parks and mountains. In case of a natural disaster large number of resources are needed to provide timely help to the victims. A co-ordinated effort between global or local disaster response team and volunteers makes a key difference. Latest observation data from satellites plays a key role. Although many Search and Rescue organizations are already utilizing satellite data in different ways (Mostly GIS), we think we can take this to next level. With availability of scalable graph like TigerGraph, it is possible to store earth observation data in terms of Vertices and Relationships which leads to faster availability of insights out of this data specially terrain traversal applications for rescue teams and volunteers.

##### The Problem
- Natural disasters all around the world in the year 2008 to 2020 caused around 10 Millions injured and around 40 Millions displaced.
- Rescue team and volunteers need to be empowered with terrain insights they can use.


##### Existing Solutions
- GIS can lay out infographics and elevation maps in various interesting ways.
- Does not provide a quarriable interface to shortest path.
- By design meant to help the analyst and not the rescue worker or volunteer.


##### Our Challenge
- Bring earth observation data into TigerGraph
- Equip TigerGraph with required UDF to process geo-spatial data.
- Create query interfaces to this data to generate insights like terrain traversal applications.

#### Description: 

Earth observation/geography data is available from Satellite and OpenStreetMap (OSM). We attempt to solve difficult terrain problems by combing Satellite/OSM data and TigerGraph. With the combination of Tiger Graph and Geo-Spatial we can visualize geo-spatial use cases with respect to graph.

- We created UDF functions with the help of C bindings of uber H3. This allow us to call geo-spatial functions while traversing TigerGraph.
- We then did some pre-processing for our sample of satellite data. Which is elevation and multi spectral images gathered from USGS and Sentinel 2. In this pre-processing we aggregated Earth observation attributes at resolution 10,11 and 12 respectively and populated graph with it.
- We then created and optimized our queries related to traversal based on surface elevation, smoothness and distance. We kept vegetation as an extra attribute.
- After that we created front end graphical interfaces to utilize these queries.
<img src="https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/blob/main/User_Interface/Frontend/assets/img/screenshots/Screenshot5.png" width="420px" height="280px"/>


Tell us how your entry was the most...					

- Impactful in solving a real world problem 
- Innovative use case of graph
- Ambitious and complex graph
- Applicable graph solution 

Other additions: 

 - **Data**: Give context for the dataset used and give full access to judges if publicly available or metadata otherwise. 
 - **Technology Stack**: Describe technologies and programming languages used. 
 - **Visuals**: Feel free to include other images or videos to better demonstrate your work.
 - Link websites or applications if needed to demonstrate your work. 

## Dependencies

  * [Docker](https://docs.docker.com/engine/install/)
  * [Tigergraph](https://docs.tigergraph.com/tigergraph-server/current/getting-started/docker)(version : 3.5.0)
  * [Python In Docker Container](https://docs.docker.com/engine/install/) (version > 3.0)
  * [Node.js and npm package manager](https://nodejs.org/en/download/)   
  * [apache](https://httpd.apache.org/docs/2.4/install.html) or [nginx](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)  
  


## Installation

Please give detailed instructions on installing, configuring, and running the project so judges can fully replicate and assess it. 

This can include:
1. Clone repository
2. Install dependencies
3. Access data
4. Steps to build/run project

## Known Issues and Future Improvements

Since our objective is to empower volunteers at the time of crisis, we want to take this prototype to a minimum viable product level and explore its practical usage with various organizations.
We also plan to integrate more features to the applications and graph and work with Open data Cube project to gather near real time satellite imagery and other kind of data.

##### Future Vision 
- Build regular pipeline from Satellite data to TigerGraph 
  - Integrate data pipeline directly with open data cubes like “DIGITAL EARTH AFRICA” and “DIGITAL EARTH AUSTRALIA” to have a near real time update of Earth observation data into tigergraph.
- Expand applications for Rescue teams and Volunteers
  - Develop more algorithms and include attributes like “FLOOD Data”, “ELECTRICITY STATUS” and provide more real time series information.
Develop Mobile applications which can interact with Tigergraph along with other 
- Collaborate with organizations like disastercharter.org
  - Collaborate with various organizations who are helping co-ordinated Search and rescue and facilitate them with our solution.



## Reflections

Review the steps you took to create this project and the resources you were provided. Feel free to indiciate room for improvement and general reflections.

## References

Please give credit to other projects, videos, talks, people, and other sources that have inspired and influenced your project. 
