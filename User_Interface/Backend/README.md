# REST API

This is a REST API example based on Node.js and axios, following the **MVC pattern** 

**TigerGraph RestAPP** is used for tigergraph quries.

The application is **production ready**, and can be used behind a Nginx reverse proxy securely.

---
## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* TigerGraph - [Download & Install TigerGraph](https://docs.tigergraph.com/tigergraph-server/current/installation/install).
* Enable RestApp - [Enable RestApp TigerGraph](https://docs.tigergraph.com/tigergraph-server/current/api/authentication) 
* Generate Secret Token - [TigerGraph Secret](https://docs.tigergraph.com/tigergraph-server/current/user-access/managing-credentials#_create_a_secre)

#### To start setting up the project

Step 1: Clone the repo

```bash
git clone https://github.com/ElectronBridge/Earth-Terrain-Data-Graph.git
```

Step 2: cd into the cloned repo and run install command:

```bash
cd Earth-Terrain-Data-Graph/User_Interface/Backend
npm install
```

Step 3: Put your credentials in the .env file.

```bash
PORT=3000
TG_SECRET=TigerGraph’s Secret.
TG_RestAppURL=TigerGraph’s RESTful APIs URL.
TG_GRAPHNAME =TigerGraph’s GraphName.
```

Step 4: Start the API by

```bash
npm start
```
Verify the deployment by navigating to your server address in
your preferred browser.

```sh
http://127.0.0.1:3000
```

## Details

TigerGraph Documentation Links:

- [TigerGraph RESTAPP] - TigerGraph RESTAPP Documents (**TigerGraph’s RESTful APIs communicate with either the REST++ server on port 9000 or the GSQL server on port 14240.**).
- [TigerGraph Secret] - Generate the TigerGraph’s Secret.

## License

This project is licensed under the MIT License.

[//]: #
[TigerGraph Secret]: <https://docs.tigergraph.com/tigergraph-server/current/user-access/managing-credentials#_create_a_secre>
[TigerGraph RESTAPP]: <https://docs.tigergraph.com/tigergraph-server/current/api/authentication>