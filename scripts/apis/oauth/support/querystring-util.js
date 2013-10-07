/*
* util.js
*  - utility helper functions for querystring module
*
* Chad Etzel
*
* Copyright (c) 2009, Yahoo! Inc. and Chad Etzel
* BSD License (see LICENSE.md for info)
*
*/

define(function() {
  
  var util = {};
  
  util.is = is;
  util.isNull = isNull;
  util.isUndefined = isUndefined;
  util.isString = isString;
  util.isNumber = isNumber;
  util.isBoolean = isBoolean;
  util.isArray = isArray;
  util.isObject = isObject;
  
  
  function is (type, obj) {
    return Object.prototype.toString.call(obj) === '[object '+type+']';
  }
  
  function isArray (obj) {
    return is("Array", obj);
  }
  
  function isObject (obj) {
    return is("Object", obj);
  }
  
  function isString (obj) {
    return is("String", obj);
  }
  
  function isNumber (obj) {
    return is("Number", obj);
  }
  
  function isBoolean (obj) {
    return is("Boolean", obj);
  }
  
  function isNull (obj) {
    return typeof obj === "object" && !obj;
  }
  
  function isUndefined (obj) {
    return typeof obj === "undefined";
  }
  
  return util;
});