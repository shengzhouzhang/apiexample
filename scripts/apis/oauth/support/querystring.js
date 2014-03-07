
define([
  
  "querystring_util"
  
], function(util) {
  
  var querystring = {};
  
  querystring.parse = querystring_parse;
  
  /**
  * <p>The querystring module adds support for serializing JavaScript objects into
  * query strings and parsing JavaScript objects from query strings format.</p>
  *
  * <p>The <code>querystring</code> module is a rollup of <code>querystring-parse</code> and
  * <code>querystring-stringify</code>.</p>
  * 
  * <p>As their names suggest, <code>querystring-parse</code> adds support for parsing
  * Query String data (querystring.parse) and <code>querystring-stringify</code> for serializing
  * JavaScript data into Query Strings (querystring.stringify).  You may choose to
  * include either of the submodules individually if you don't need the
  * complementary functionality, or include the rollup for both.</p>
  *
  * @module querystring
  */
  
  /**
  * Provides parse method to accept Query Strings and return native
  * JavaScript objects.
  *
  * @module querystring
  * @submodule querystring-parse
  * @for querystring
  * @static
  */
  function querystring_parse (qs, sep, eq, unesc) {
    return qs.split(sep || "&")
      .map(pieceParser(eq || "=", unesc || unescape))
      .reduce(mergeParams, {});
  };
  
  function unescape (s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  };
  
  querystring.unescape=unescape;
  
  // Parse a key=val string.
  // These can get pretty hairy
  // example flow:
  // parse(foo[bar][][bla]=baz)
  // return parse(foo[bar][][bla],"baz")
  // return parse(foo[bar][], {bla : "baz"})
  // return parse(foo[bar], [{bla:"baz"}])
  // return parse(foo, {bar:[{bla:"baz"}]})
  // return {foo:{bar:[{bla:"baz"}]}}
  function pieceParser (eq, unesc) {
    return function parsePiece (key, val) {
      if (arguments.length !== 2) {
        // key=val, called from the map/reduce
        key = key.split(eq);
        return parsePiece(
          unesc(key.shift()),
          unesc(key.join(eq))
        );
      }
      key = key.replace(/^\s+|\s+$/g, '');
      if (util.isString(val)) {
        val = val.replace(/^\s+|\s+$/g, '');
        // convert numerals to numbers
        if (!isNaN(val)) {
          var numVal = +val;
          if (val === numVal.toString(10)) val = numVal;
        }
      }
      var sliced = /(.*)\[([^\]]*)\]$/.exec(key);
      if (!sliced) {
        var ret = {};
        if (key) ret[key] = val;
        return ret;
      }
      // ["foo[][bar][][baz]", "foo[][bar][]", "baz"]
      var tail = sliced[2],
          head = sliced[1];
      
      // array: key[]=val
      if (!tail) return parsePiece(head, [val]);
      
      // obj: key[subkey]=val
      var ret = {};
      ret[tail] = val;
      return parsePiece(head, ret);
    };
  };
  
  // the reducer function that merges each query piece together into one set of params
  function mergeParams (params, addition) {
    var ret;
    
    if (!params){
      // if it's uncontested, then just return the addition.
      ret = addition;
    } else if (util.isArray(params)) {
      // if the existing value is an array, then concat it.
      ret = params.concat(addition);
    } else if (!util.isObject(params) || !util.isObject(addition)) {
      // if the existing value is not an array, and either are not objects, arrayify it.    
      ret = [params].concat(addition);
    } else {
      // else merge them as objects, which is a little more complex
      ret = mergeObjects(params, addition);
    }
    return ret;
  };
  
  
  // Merge two *objects* together. If this is called, we've already ruled
  // out the simple cases, and need to do the for-in business.
  function mergeObjects (params, addition) {
    for (var i in addition) if (i && addition.hasOwnProperty(i)) {
      params[i] = mergeParams(params[i], addition[i]);
    }
    return params;
  };
  
  querystring.stringify = querystring_stringify;
  
  var stack = [];
  /**
  * <p>Converts an arbitrary value to a Query String representation.</p>
  *
  * <p>Objects with cyclical references will trigger an exception.</p>
  *
  * @method stringify
  * @param obj {Variant} any arbitrary value to convert to query string
  * @param sep {String} (optional) Character that should join param k=v pairs together. Default: "&"
  * @param eq  {String} (optional) Character that should join keys to their values. Default: "="
  * @param name {String} (optional) Name of the current key, for handling children recursively.
  * @param escape {Function} (optional) Function for escaping. Default: encodeURIComponent
  */
  function querystring_stringify (obj, sep, eq, name, escape) {
    sep = sep || "&";
    eq = eq || "=";
    escape = escape || encodeURIComponent;
    
    if (util.isNull(obj) || util.isUndefined(obj) || typeof(obj) === 'function') {
      return name ? escape(name) + eq : '';
    }
    
    if (util.isBoolean(obj)) obj = +obj;
    if (util.isNumber(obj) || util.isString(obj)) {
      return escape(name) + eq + escape(obj);
    }  
    if (util.isArray(obj)) {
      var s = [];
      name = name+'[]';
      for (var i = 0, l = obj.length; i < l; i ++) {
        s.push( querystring_stringify(obj[i], sep, eq, name, escape) );
      }
      return s.join(sep);
    }
    
    // Check for cyclical references in nested objects
    for (var i = stack.length - 1; i >= 0; --i) if (stack[i] === obj) {
      throw new Error("querystring_stringify. Cyclical reference");
    }
    
    stack.push(obj);
    
    var s = [];
    var begin = name ? name + '[' : '';
    var end = name ? ']' : '';
    for (var i in obj) if (obj.hasOwnProperty(i)) {
      var n = begin + i + end;
      s.push(querystring_stringify(obj[i], sep, eq, n, escape));
    }
    
    stack.pop();
    
    s = s.join(sep);
    if (!s && name) return name + "=";
    return s;
  };
  
  return querystring;
  
});