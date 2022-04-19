# Earth Terrain Data Graph

#### Contributers and Contact Information: 

- Manoj Kumar Joshi (Email:- manoj@electronbridge.com)
- Ashok Barthwal (Email:- ashok.barthwal@electronbridge.com)
- Yogesh Kumar (Email:- yogesh.kumar@electronbridge.com)

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

Earth observation/geography data is available from Satellite and OpenStreetMap (OSM). We attempt to solve difficult terrain problems by combining Satellite/OSM data and TigerGraph. With the combination of Tiger Graph and Geo-Spatial we can visualize geo-spatial use cases with respect to graph.

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

 - **Data**: The Rasters images ([image1](https://demo.electronbridge.com/os/images/T10SGC_20220307T184229_B04.jp2),[image2](https://demo.electronbridge.com/os/images/T10SGC_20220307T184229_B08.jp2)) of the Santa Rosa island are taken from sentinel satellite open source image for different bands(red band and near infrared band) with some elevation related information etc. After processing the resulting data will contain the csv ([res_10_nodes](https://demo.electronbridge.com/os/csv/dem_nodes_res_10.csv),
[res_11_nodes](https://demo.electronbridge.com/os/csv/dem_nodes_res_11.csv),
[res_12_nodes](https://demo.electronbridge.com/os/csv/dem_nodes_res_12.csv),
[res_10_edges](https://demo.electronbridge.com/os/csv/dem_edges_res_10.csv),
[res_12_edges](https://demo.electronbridge.com/os/csv/dem_edges_res_11.csv),
[res_12_edges](https://demo.electronbridge.com/os/csv/dem_edges_res_12.csv)
) containing hex_id against every point and its elevation etc with grouping.
 - **Technology Stack**: 
    - In data preparation we have used **python** as programming language. 
    - In UDF Functions we used  **C/C++ library h3** and used C/C++ as programming language. 
    - In Backend API we have used **Node.js** as programming language. 
    - In User Interface we have used **HTML5, jquery** as programming language. 
 - **Video**: Feel free to include other images or videos to better demonstrate your work.
 - **Demo preview on**
    - [Discover trail to nearest road in hilly area](https://demo.electronbridge.com/os/TigerGraphEB/)
    - [Road or Pipeline layout path planning](https://demo.electronbridge.com/os/TigerGraphEB/trailroad.html)

## Dependencies

  * [Docker](https://docs.docker.com/engine/install/)
  * [Tigergraph](https://docs.tigergraph.com/tigergraph-server/current/getting-started/docker)(version : 3.5.0)
  * [Python In Docker Container](https://docs.docker.com/engine/install/) (version > 3.0)
  * [Node.js and npm package manager](https://nodejs.org/en/download/)   
  * [apache](https://httpd.apache.org/docs/2.4/install.html) or [nginx](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)  
  


## Installation

In the project we have three differnt sub-modules.Install sub modules as per below hierarchy only.

- Data preparation (**You can skip as in tigergraph import zip file is already exported with data**).
  - [Steps For Data Preparation](https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/tree/main/data_generation)
- Tigergraph schema and UDF function installations.
  - [Steps To Import Tigergraph and Install UDF Functions](https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/tree/main/src)
- User interface and API'S to communicate with UI.
  - [API'S](https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/tree/main/User_Interface/Backend)
  - [UI](https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/tree/main/User_Interface/Frontend)



## Limitations And Future Improvements

For demo purpose we have only processed and implemented data of Santa Rosa Island of California.

Since our objective is to empower volunteers at the time of crisis, we want to take this prototype to a minimum viable product level and explore its practical usage with various organizations.
We also plan to integrate more features to the applications and graph and work with Open data Cube project to gather near real time satellite imagery and other kind of data.

#### Future Vision 
- Build regular pipeline from Satellite data to TigerGraph 
  - Integrate data pipeline directly with open data cubes like “DIGITAL EARTH AFRICA” and “DIGITAL EARTH AUSTRALIA” to have a near real time update of Earth observation data into tigergraph.
- Expand applications for Rescue teams and Volunteers
  - Develop more algorithms and include attributes like “FLOOD Data”, “ELECTRICITY STATUS” and provide more real time series information.
Develop Mobile applications which can interact with Tigergraph along with other 
- Collaborate with organizations like disastercharter.org
  - Collaborate with various organizations who are helping co-ordinated Search and rescue and facilitate them with our solution.
<img src="https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/blob/main/User_Interface/Frontend/assets/img/screenshots/Screenshot6.png" width="420px" height="280px"/>


## Reflections

Review the steps you took to create this project and the resources you were provided. Feel free to indiciate room for improvement and general reflections.

## References

Please give credit to other projects, videos, talks, people, and other sources that have inspired and influenced your project. 
