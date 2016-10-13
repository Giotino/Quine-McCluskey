exports.clone = function(source) {
  if(source == null) {
    return null;
  }
  if (Object.prototype.toString.call(source) === '[object Array]') {
    var clone = [];
    for (var i=0; i<source.length; i++) {
      clone[i] = exports.clone(source[i]);
    }
    return clone;
  } else if (typeof(source)=="object") {
    var clone = {};
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        clone[prop] = exports.clone(source[prop]);
      }
    }
    return clone;
  } else {
    return source;
  }
}

exports.inArray = function(array, el) {
  for ( var i = array.length; i--; ) {
    if ( array[i] === el ) return true;
  }
  return false;
}

exports.isEqArrays = function(arr1, arr2) {
  if ( arr1.length !== arr2.length ) {
    return false;
  }
  for ( var i = arr1.length; i--; ) {
    if ( !exports.inArray( arr2, arr1[i] ) ) {
      return false;
    }
  }
  return true;
}

exports.arrayInArray = function(array, find) {
  for (var i = array.length; i--;) {
    if (exports.isEqArrays(array[i],  find)) return true;
  }
  return false;
}

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};