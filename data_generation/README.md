## Jupyter Notebooks used to generate data

This directory contains jupyter notebooks related to single use case in separate directory. Each Notebook creates some csv files which will be pushed to tigergraph using separate script. 
  1. [earth_terrain_data](https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/tree/main/data_generation/earth_terrain_data): The input file for this use case is a raster image with some elevation related information etc.. After processing the resulting data will contain the csv containing hex_id against every point and its elevation etc with grouping.


### Requirement for python notebooks to run
we recommend to create a conda/miniconda environment for setting the below environment as the recommended way to install some of the requirements is through conda like gdal and geopandas
5
  * The required python modules list:
    * [h3-py](https://uber.github.io/h3-py/intro.html)
    * [osmnx](https://osmnx.readthedocs.io/en/stable/)
    * [shapely](https://shapely.readthedocs.io/en/stable/project.html)
    * [pandas](https://pandas.pydata.org/)
    * [numpy](https://numpy.org/)
    * [gdal/osgeo](https://gdal.org/api/python.html)
    * [rasterio](https://rasterio.readthedocs.io/en/latest/installation.html)
    * [geopandas](https://geopandas.org/en/stable/getting_started.html)
    * [jupyterHub](https://jupyter.org/hub)
    * [ipykernel](https://pypi.org/project/ipykernel/)

  * Command for creating new conda environment with above packages

    ```bash
    conda config --add channels conda-forge

    conda create -n eb_3.9 python=3.9 numpy pandas h3-py gdal osmnx shapely rasterio geopandas jupyterHub ipykernel

    #start jupyter hub server
    jupyterhub
    ```

### System requirements
  Some of the computations in the notebooks are in-memory computations (like reading and changing raster images) so it requires fair amount of memory. We have tested the notebooks on 
  * Memory - 16GB
  * storage - Some raster files, final csv files required to be stored in permanent storage. So, around 10GB storage should be needed.
  * CPU - 16 core

### Steps to prepare environment for running the notebooks
  * Step 1: run [prepare_system.ipynb](https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/blob/main/data_generation/prepare_system.ipynb) for preparing directory structure and downloading the required raster/csv files(can not attach those files here as size is big)
  * Step 2: run [earth_terrain_data/santa_rosa_roads.ipynb](https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/blob/main/data_generation/earth_terrain_data/santa_rosa_roads.ipynb). This will create 3 csvs in Data/final_csv
  * Step 3: run [earth_terrain_data/create_ndvi.ipynb](https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/blob/main/data_generation/earth_terrain_data/create_ndvi.ipynb). This will create 3 csvs in Data/final_csv
  * Step 4: run [earth_terrain_data/create_graph_data.ipynb](https://github.com/ElectronBridge/Earth-Terrain-Data-Graph/blob/main/data_generation/earth_terrain_data/create_graph_data.ipynb). This will create 6 csvs in Data/final_csv