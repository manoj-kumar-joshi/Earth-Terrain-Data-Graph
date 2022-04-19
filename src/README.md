# Tigergraph Import Schema
A database export contains the database’s data, and optionally some types of metadata.This data can be subsequently imported in order to recreate the same database, in the original or in a different TigerGraph platform instance.
To import an exported database, ensure that the export files are from a database that was running the exact same version of TigerGraph as the database that you are importing into.


---
## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* TigerGraph - [Download & Install TigerGraph](https://docs.tigergraph.com/tigergraph-server/current/getting-started/docker). Docker Instalation version 3.5.0

#### To start setting up the project and include h3 library in tigergraph system

Step 1: Clone the repo

```bash
git clone https://github.com/ElectronBridge/Earth-Terrain-Data-Graph.git
```

Step 2: Copy src folder to Shared Folder which is shared with Docker Container:

```bash
cp -R Earth-Terrain-Data-Graph/src/* /<sharedfolder>
```

Step 3:  Connect to your container (via SSH or docker exec)

```bash
docker exec -it tigergraph /bin/bash
```

Step 4: Update and install Python and pip (python version > 3.0.0)

```bash
apt-get update
apt-get install -y python3
apt-get install -y python3-pip
pip install h3
```

Step 5: Copy the static lib and headers from default installed path to tigergraph path.
```bash
#create folder for adding new lib in tigergraph
mkdir /home/tigergraph/tigergraph/app/3.5.0/dev/gdk/gsdk/include/thirdparty/h3 

#copy headers -- for example in ubuntu the default path is /usr/local/include
cp /usr/local/include/h3/h3api.h /home/tigergraph/tigergraph/app/3.5.0/dev/gdk/gsdk/include/thirdparty/h3/

#copy static lib -- for example in ubuntu the default path is /usr/local/lib
cp /usr/local/lib/libh3.a /home/tigergraph/tigergraph/app/3.5.0/dev/gdk/gsdk/lib/release/
```
Step 6: Add lib and header in tigergraph compiler path and save.
```bash
#add these lines  in "home/tigergraph/tigergraph/app/3.5.0/dev/gdk/MakeUdf"
LIBINCLUDE += -Igsdk/include/thirdparty/h3
LDFLAGS += -lh3
```

Step 7: Backup ExprFunction.hpp file and copy new ExprFunction.hpp file from exported data.
```bash
#add these lines  in "home/tigergraph/tigergraph/app/3.5.0/dev/gdk/MakeUdf"
cp /home/tigergraph/tigergraph/app/3.5.0/dev/gdk/gsql/src/QueryUdf/ExprFunctions.hpp /home/tigergraph/tigergraph/app/3.5.0/dev/gdk/gsql/src/QueryUdf/ExprFunctions.hppold
cp /home/tigergraph/mydata/ExprFunctions.hpp /home/tigergraph/tigergraph/app/3.5.0/dev/gdk/gsql/src/QueryUdf/ExprFunctions.hpp
```
Step 8: login as tigergraph user and Store the updated query UDF file
```bash
su tigergraph
gsql
GSQL > PUT ExprFunctions FROM "/home/tigergraph/tigergraph/app/3.5.0/dev/gdk/gsql/src/QueryUdf/ExprFunctions.hpp"
```
Step 9: Restart gadmin and import and install the exported data.
```bash
gadmin restart all
gsql
GSQL > IMPORT GRAPH ALL FROM "/home/tigergraph/mydata/exportgraphs/"
GSQL > INSTALL QUERY ALL 
```

# H3 Representation of Geography with our tigergraph scema.
<img src="https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/blob/main/User_Interface/Frontend/assets/img/screenshots/Screenshot4.png" width="400px" height="300px"/>

# Details

## H3(Hexagonal hierarchical geospatial indexing system) Functions port to Tigergraph

In an attempt to bring geo-spatial features to Tigergraph, we created [UDF functions](https://docs.tigergraph.com/gsql-ref/current/ddl-and-loading/add-token-function) for some of the functions from [Uber H3](https://github.com/uber/h3) Library.


### H3 Overview
H3 is a geospatial indexing system that partitions the world into hexagonal cells. H3 is open source under the Apache 2 license. The H3 Core Library implements the H3 grid system. It includes functions for converting from latitude and longitude coordinates to the containing H3 cell, finding the center of H3 cells, finding the boundary geometry of H3 cells, finding neighbors of H3 cells, and more. For info please visit https://h3geo.org/docs.


#### Highlights:
- H3 offers an easy API for indexing coordinates into a hexagonal grid, down to square meter resolution.

- Indexed data can be quickly joined across disparate datasets and aggregated at different levels of precision.

- H3 enables a range of algorithms and optimizations based


### List of functions ported from h3 library to Tigergraph DB
  - eb_h3GetResolution: It takes a valid h3 string and returns the resolution level against the given hex id. This function is a port of [h3GetResolution](https://h3geo.org/docs/api/inspection#h3getresolution) function of H3 library.
        
    * Parameter: it takes a valid h3 string
    * Returns the resolution of the index.
        
          
      &nbsp;&nbsp;&nbsp;&nbsp;Test Tigergraph query:   
      ```bash
      CREATE QUERY test_eb_h3GetResolution(STRING in_h3_string) FOR GRAPH test_travel_network { 
         INT x;
         //STRING y = "8f2830828052d25";
         x = eb_h3GetResolution(in_h3_string);
        //result should be x = 2;
        PRINT x; 
      }
      ```
      <br />
        
  - eb_h3IsValid: It checks if the provided string is a valid h3 string or not. This function is a port of [h3IsValid](https://h3geo.org/docs/api/inspection#h3isvalid) function of H3 library.
     
    * Parameters: it takes a string
    * Returns non-zero if this is a valid H3 index.
         
      &nbsp;&nbsp;&nbsp;&nbsp;Test Tigergraph query:   
      ```bash
      CREATE QUERY test_eb_h3IsValid(STRING h3index) FOR GRAPH test_travel_network { 
        INT x;
        //STRING y = "8f2830828052d25";
         x =   eb_h3IsValid(h3index);
        //x = 2;
        PRINT x; 
      }
      ```
      <br />
        
  - eb_h3Distance: It returns the distance in grid cells between the two hex indexes. This function is a port of [h3Distance](https://h3geo.org/docs/api/traversal#h3distance) function of H3 library.
    * Parameters: 
      * origin -- string hex id
      * dest   -- string hex id
    * Returns the distance in grid cells between the two indexes.
         
      &nbsp;&nbsp;&nbsp;&nbsp;Test Tigergraph query:   
      ```bash
      CREATE QUERY test_eb_h3Distance(STRING origin, STRING h3) FOR GRAPH test_travel_network { 
        INT x =   eb_h3Distance(origin,h3);
        PRINT x; 
      }
      ```
      <br />
        
  - eb_kRing: It produces list of h3 hex indices within k distance of the origin index. This function is a port of [kRing](https://h3geo.org/docs/api/traversal#kring) function of H3 library.
    * Parameters: 
      * origin -- string hex id
      * k      -- integer value representing 'k' no of rings
    * Returns indices within k distance of the origin index.
         
      &nbsp;&nbsp;&nbsp;&nbsp;Test Tigergraph query:   
      ```bash
      CREATE QUERY test_eb_kRing(string origin, INT k) FOR GRAPH test_travel_network { 
        ListAccum <STRING> @@outList ;
        @@outList = eb_kRing(origin,k);
        PRINT @@outList;
       }
      ```
      <br />
        
  - eb_getH3UnidirectionalEdge: This gives a unidirectional edge H3 index (string) based on the provided origin and destination. This function is a port of [getH3UnidirectionalEdge](https://h3geo.org/docs/api/uniedge#geth3unidirectionaledge) function of H3 library.
    * Parameters:
      * origin -- string hex id
      * dest   -- string hex id
    * Returns a unidirectional edge H3 index (string) based on the provided origin and destination or empty string in case of error.
         
      &nbsp;&nbsp;&nbsp;&nbsp;Test Tigergraph query:   
      ```bash
      CREATE QUERY test_eb_getH3UnidirectionalEdge(STRING origin, STRING dest) FOR GRAPH test_travel_network { 
        STRING res;
        res = eb_getH3UnidirectionalEdge(origin,dest);
        PRINT(res);
      }
      ```
      <br />
        
  - eb_pointDistM: Gives the "great circle" or "haversine" distance between pairs of GeoCoord points (lat/lng pairs) in meters. This function is a port of [pointDistM](https://h3geo.org/docs/api/misc#pointdistm) function of H3 library.
    * Parameters:
      * origin -- string hex id representing point 1 (it takes the center point of this hexagon)
      * dest   -- string hex id representing point 2 (it takes the center point of this hexagon)
     * Returns the "great circle" or "haversine" distance between pairs of GeoCoord points (lat/lng pairs) in meters.
          
      &nbsp;&nbsp;&nbsp;&nbsp;Test Tigergraph query:   
      ```bash
      CREATE QUERY test_eb_pointDistM(STRING origin, STRING dest) FOR GRAPH test_travel_network { 
        DOUBLE res;
        //this function calculates distance in meters between center points of two h3 indexes
        res = eb_pointDistM(origin,dest);
        print res;
      }
      ```
      <br />
          
  - eb_h3ToParent: it gives the parent (coarser) index containing given hex id. This function is a port of [h3ToParent](https://h3geo.org/docs/api/hierarchy#h3toparent) function of H3 library.
    * Parameters:
      * h3index -- string hex id
      * parent_hex_resolution -- integer representing the parent hex resolution
    * Returns the parent (coarser) index containing h.
         
      &nbsp;&nbsp;&nbsp;&nbsp;Test Tigergraph query:   
      ```bash
      CREATE QUERY test_eb_h3ToParent(STRING h3index,INT parentRes) FOR GRAPH test_travel_network { 
        //This function prints parent h3 hexagon id with given parent resolution
        STRING result = eb_h3ToParent(h3index,parentRes);
        PRINT result;
      }
      ```
      <br />
        
  - eb_h3ToChildren: it Populates children with the indexes contained by given hex_id at provided resolution childRes. This function is port of [h3ToChildren](https://h3geo.org/docs/api/hierarchy#h3tochildren) function of H3 library
    * Parameters:
      * hex_id -- string hex id
      * childRes -- integer representing resolution of child
    * Returns a list of children with the indexes contained by h at resolution childRes.
         
      &nbsp;&nbsp;&nbsp;&nbsp;Test Tigergraph query:   
      ```bash
       CREATE QUERY test_eb_h3ToChildren(STRING h3index, INT childRes) FOR GRAPH test_travel_network { 
          //this function prints the children of given h3 hexagon with given child resolution
          ListAccum <STRING> @@children;
          @@children = eb_h3ToChildren(h3index,childRes);
          PRINT @@children;
        }
      ```
      <br />
        
  - eb_exactEdgeLengthM: it gives exact edge length of specific unidirectional edge in meters. This function is a port of [exactEdgeLengthM](https://h3geo.org/docs/api/misc#exactedgelengthm) function of H3 library.
    * Parameters:
      * hex_id: string hex id
    * Returns Exact edge length of specific unidirectional edge in meters.
         
      &nbsp;&nbsp;&nbsp;&nbsp;Test Tigergraph query:   
      ```bash
       CREATE QUERY test_eb_exactEdgeLengthM(STRING h3index) FOR GRAPH test_travel_network { 
          DOUBLE res = eb_exactEdgeLengthM(h3index);
          PRINT res;
        }
      ```
      <br />
        
  - eb_hexRing: Produces the hollow hexagonal ring centered at origin with sides of length k. This function is a port of [hexRing](https://h3geo.org/docs/api/traversal#hexring) function of H3 library.
    * Parameters:
      * origin -- string hex id
      * k -- integer representing ring number
    * Returns the list of hex_ids representing hollow hexagonal ring centered at origin with sides of length k. Returns 0 if no pentagonal distortion was encountered.
         
      &nbsp;&nbsp;&nbsp;&nbsp;Test Tigergraph query:   
      ```bash
       CREATE QUERY test_eb_hexRing(STRING origin,INT k) FOR GRAPH test_travel_network { 
          //test origin: 85283473fffffff
          ListAccum<String> @@res;
          @@res = eb_hexRing(origin,k);
          print @@res;
        }
      ```
      <br />
      
### Useful Links
  * [Uber H3](https://h3geo.org/)
  * [Tigergraph Installation](https://docs.tigergraph.com/tigergraph-server/current/getting-started/docker)
  * [Tigergraph UDF](https://docs-legacy.tigergraph.com/dev/gsql-ref/querying/func/query-user-defined-functions)
  * [Docker Installation](https://docs.docker.com/engine/install/)

## License

This project is licensed under the MIT License.
