# Tigergraph Import Schema
A database export contains the database’s data, and optionally some types of metadata.This data can be subsequently imported in order to recreate the same database, in the original or in a different TigerGraph platform instance.
To import an exported database, ensure that the export files are from a database that was running the exact same version of TigerGraph as the database that you are importing into.


---
## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* TigerGraph - [Download & Install TigerGraph](https://docs.tigergraph.com/tigergraph-server/current/getting-started/docker). Docker Instalation version 3.5.0

#### To start setting up the project

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

## License

This project is licensed under the MIT License.
