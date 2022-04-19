/******************************************************************************
 * Copyright (c) 2015-2016, TigerGraph Inc.
 * All rights reserved.
 * Project: TigerGraph Query Language
 * udf.hpp: a library of user defined functions used in queries.
 *
 * - This library should only define functions that will be used in
 *   TigerGraph Query scripts. Other logics, such as structs and helper
 *   functions that will not be directly called in the GQuery scripts,
 *   must be put into "ExprUtil.hpp" under the same directory where
 *   this file is located.
 *
 * - Supported type of return value and parameters
 *     - int
 *     - float
 *     - double
 *     - bool
 *     - string (don't use std::string)
 *     - accumulators
 *
 * - Function names are case sensitive, unique, and can't be conflict with
 *   built-in math functions and reserve keywords.
 *
 * - Please don't remove necessary codes in this file
 *
 * - A backup of this file can be retrieved at
 *     <tigergraph_root_path>/dev_<backup_time>/gdk/gsql/src/QueryUdf/ExprFunctions.hpp
 *   after upgrading the system.
 *
 ******************************************************************************/

#ifndef EXPRFUNCTIONS_HPP_
#define EXPRFUNCTIONS_HPP_

#include <stdlib.h>
#include <stdio.h>
#include <string>
#include <gle/engine/cpplib/headers.hpp>
#include <h3/h3api.h>

/**     XXX Warning!! Put self-defined struct in ExprUtil.hpp **
 *  No user defined struct, helper functions (that will not be directly called
 *  in the GQuery scripts) etc. are allowed in this file. This file only
 *  contains user-defined expression function's signature and body.
 *  Please put user defined structs, helper functions etc. in ExprUtil.hpp
 */
#include "ExprUtil.hpp"

namespace UDIMPL {
  typedef std::string string; //XXX DON'T REMOVE

  /****** BIULT-IN FUNCTIONS **************/
  /****** XXX DON'T REMOVE ****************/
  inline int64_t str_to_int (string str) {
    return atoll(str.c_str());
  }

  inline int64_t float_to_int (float val) {
    return (int64_t) val;
  }

  inline string to_string (double val) {
    char result[200];
    sprintf(result, "%g", val);
    return string(result);
  }

  //h3GetResolution -- Returns the resolution of the index.
  inline int eb_h3GetResolution (string h3Str) {
	  H3Index h3;
	  //H3_EXPORT(stringToH3)(h3Str.c_str(), &h3);
	  h3 = stringToH3(h3Str.c_str());
    int res = h3GetResolution(h3);
	  return res;
  }

  // h3IsValid -- Returns non-zero if this is a valid H3 index.
  inline int eb_h3IsValid (string h3index) {
	  H3Index h3 = stringToH3(h3index.c_str());
	  int res = h3IsValid(h3);
	  return res;
  }


  // h3Distance -- Returns the distance in grid cells between the two indexes.
  inline int eb_h3Distance (string origin, string h3) {
	  H3Index origin_index = stringToH3(origin.c_str());
	  H3Index h3_index = stringToH3(h3.c_str());
	  int res = h3Distance(origin_index,h3_index);
	  return res;
  }

  // kRing -- k-rings produces indices within k distance of the origin index.
  inline ListAccum <string> eb_kRing (string origin, int k) {
	  H3Index origin_index = stringToH3(origin.c_str());

    //maxKringSize -- Maximum number of indices that result from the kRing algorithm with the given k.
    int maxNeighboring = maxKringSize(k);
    
    H3Index *neighboring = (H3Index *)calloc(maxNeighboring, sizeof(H3Index));

    kRing(origin_index, k, neighboring);

    ListAccum <string> res;

	  for (int i = 0; i < maxNeighboring; i++) {
        // Some indexes may be 0 to indicate fewer than the maximum
        // number of indexes.
        if (neighboring[i] != 0) {
            char tmp_res[20];
            h3ToString(neighboring[i],tmp_res,20);
            string str(tmp_res);
            res += str;
        }
    }

    free(neighboring);

	  return res;
  }

  //Returns a unidirectional edge H3 index (string) based on the provided origin and destination.
  //Returns empty string on error
  inline string eb_getH3UnidirectionalEdge (string origin, string dest) {
    H3Index origin_index = stringToH3(origin.c_str());
	  H3Index dest_index = stringToH3(dest.c_str());

	  H3Index res = getH3UnidirectionalEdge(origin_index, dest_index);

    if(res){
      char tmp_res[20];
      h3ToString(res,tmp_res,20);
      string str(tmp_res);
      return str;
    }else{
      string str;
      return str;
    }
  }

  //Gives the "great circle" or "haversine" distance between pairs of GeoCoord points (lat/lng pairs) in meters.
  inline double eb_pointDistM (string origin, string dest) {
    GeoCoord geoH3_origin, geoH3_dest;
    H3Index origin_index = stringToH3(origin.c_str());
	  H3Index dest_index = stringToH3(dest.c_str());

    h3ToGeo(origin_index, &geoH3_origin);
    h3ToGeo(dest_index, &geoH3_dest);

    double res = pointDistM(&geoH3_origin,&geoH3_dest);
    return res;
  }

  //Returns the parent (coarser) index containing h.
  inline string eb_h3ToParent (string h3index, int parentRes) {
    H3Index h3_index = stringToH3(h3index.c_str());
    H3Index res = h3ToParent(h3_index,parentRes);
    

    // converting h3 result to h3 string
    char tmp_res[20];
    h3ToString(res,tmp_res,20);
    string str(tmp_res);
    return str;
  }

  //Populates children with the indexes contained by h at resolution childRes. children must be an array of at least size maxH3ToChildrenSize(h, childRes).
  inline ListAccum <string> eb_h3ToChildren (string h3index, int childRes) {
    H3Index h3_index = stringToH3(h3index.c_str());

    int maxChildren = maxH3ToChildrenSize(h3_index, childRes);
    H3Index *children = (H3Index *)calloc(maxChildren, sizeof(H3Index));
    h3ToChildren(h3_index, childRes, children);

    ListAccum <string> res;

	  for (int i = 0; i < maxChildren; i++) {
        // Some indexes may be 0 to indicate fewer than the maximum
        // number of indexes.
        if (children[i] != 0) {
            char tmp_res[20];
            h3ToString(children[i],tmp_res,20);
            string str(tmp_res);
            res += str;
        }
    }

    free(children);

	  return res;
  }

  //it gives exact edge length of specific unidirectional edge in meters.
  inline double eb_exactEdgeLengthM (string h3index) {
	  H3Index h3_index = stringToH3(h3index.c_str());
	  double res = exactEdgeLengthM(h3_index);
	  return res;
  }

  //Produces the hollow hexagonal ring centered at origin with sides of length k.
  inline ListAccum <string> eb_hexRing(string origin,int k){
    H3Index origin_index = stringToH3(origin.c_str());

    //maxKringSize -- Maximum number of indices that result from the kRing algorithm with the given k.
    int maxNeighboring = maxKringSize(k);

    H3Index *neighboring = (H3Index *)calloc(maxNeighboring, sizeof(H3Index));

    hexRing(origin_index,k,neighboring);

    ListAccum <string> res;

	  for (int i = 0; i < maxNeighboring; i++) {
        // Some indexes may be 0 to indicate fewer than the maximum
        // number of indexes.
        if (neighboring[i] != 0) {
            char tmp_res[20];
            h3ToString(neighboring[i],tmp_res,20);
            string str(tmp_res);
            res += str;
        }
    }

    free(neighboring);

	  return res;
  }
}

#endif /* EXPRFUNCTIONS_HPP_ */
