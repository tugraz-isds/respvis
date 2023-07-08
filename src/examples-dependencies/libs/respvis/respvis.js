// RespVis version 2.0 ESM
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

function validate(uuid) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return stringify(rnds);
}

function sizeRound(size, decimals) {
    if (decimals === void 0) { decimals = 0; }
    var e = Math.pow(10, decimals);
    return {
        width: Math.round(size.width * e) / e,
        height: Math.round(size.height * e) / e
    };
}
function sizeEquals(a, b, epsilon) {
    if (epsilon === void 0) { epsilon = 0.001; }
    return Math.abs(a.width - b.width) < epsilon && Math.abs(a.height - b.height) < epsilon;
}
function sizeToString(size, decimals) {
    if (decimals === void 0) { decimals = 1; }
    size = sizeRound(size, decimals);
    return "".concat(size.width, ", ").concat(size.height);
}
function sizeFromString(str) {
    var parts = str.split(',').map(function (s) { return parseFloat(s.trim()); });
    return { width: parts[0], height: parts[1] };
}
function sizeToAttrs(selectionOrTransition, size) {
    size = sizeRound(size);
    selectionOrTransition.attr('width', size.width); //Typescript Problem on chaining?
    selectionOrTransition.attr('height', size.height);
}
function sizeFromAttrs(selectionOrTransition) {
    var s = selectionOrTransition.selection();
    return { width: parseFloat(s.attr('width') || '0'), height: parseFloat(s.attr('height') || '0') };
}

function positionRound(position, decimals) {
    if (decimals === void 0) { decimals = 0; }
    var e = Math.pow(10, decimals);
    return {
        x: Math.round(position.x * e) / e,
        y: Math.round(position.y * e) / e
    };
}
function positionEquals(positionA, positionB, epsilon) {
    if (epsilon === void 0) { epsilon = 0.001; }
    return (Math.abs(positionA.x - positionB.x) < epsilon && Math.abs(positionA.y - positionB.y) < epsilon);
}
function positionToString(position, decimals) {
    if (decimals === void 0) { decimals = 1; }
    position = positionRound(position, decimals);
    return "".concat(position.x, ", ").concat(position.y);
}
function positionFromString(str) {
    var parts = str.split(',').map(function (s) { return parseFloat(s.trim()); });
    return { x: parts[0], y: parts[1] };
}
function positionToAttrs(selectionOrTransition, position) {
    position = positionRound(position);
    selectionOrTransition.attr('x', position.x);
    selectionOrTransition.attr('y', position.y);
}
function positionFromAttrs(selectionOrTransition) {
    var s = selectionOrTransition.selection();
    return { x: parseFloat(s.attr('x') || '0'), y: parseFloat(s.attr('y') || '0') };
}
function positionToTransformAttr(selectionOrTransition, position) {
    selectionOrTransition.attr('transform', "translate(".concat(positionToString(positionRound(position)), ")"));
}

// source: https://stackoverflow.com/a/16436975
function arrayEquals(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] instanceof Array && !arrayEquals(a[i], b[i]))
            return false;
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
function arrayIs(array) {
    return Array.isArray(array);
}
function arrayIs2D(array) {
    return arrayIs(array) && array.every(function (e) { return Array.isArray(e); });
}
function arrayPartition(array, size) {
    var partitions = [];
    for (var i = 0; i < array.length; i += size)
        partitions.push(array.slice(i, i + size));
    return partitions;
}

function ascending$1(a, b) {
  return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function descending(a, b) {
  return a == null || b == null ? NaN
    : b < a ? -1
    : b > a ? 1
    : b >= a ? 0
    : NaN;
}

function bisector(f) {
  let compare1, compare2, delta;

  // If an accessor is specified, promote it to a comparator. In this case we
  // can test whether the search value is (self-) comparable. We can’t do this
  // for a comparator (except for specific, known comparators) because we can’t
  // tell if the comparator is symmetric, and an asymmetric comparator can’t be
  // used to test whether a single value is comparable.
  if (f.length !== 2) {
    compare1 = ascending$1;
    compare2 = (d, x) => ascending$1(f(d), x);
    delta = (d, x) => f(d) - x;
  } else {
    compare1 = f === ascending$1 || f === descending ? f : zero$1;
    compare2 = f;
    delta = f;
  }

  function left(a, x, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x, x) !== 0) return hi;
      do {
        const mid = (lo + hi) >>> 1;
        if (compare2(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      } while (lo < hi);
    }
    return lo;
  }

  function right(a, x, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x, x) !== 0) return hi;
      do {
        const mid = (lo + hi) >>> 1;
        if (compare2(a[mid], x) <= 0) lo = mid + 1;
        else hi = mid;
      } while (lo < hi);
    }
    return lo;
  }

  function center(a, x, lo = 0, hi = a.length) {
    const i = left(a, x, lo, hi - 1);
    return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
  }

  return {left, center, right};
}

function zero$1() {
  return 0;
}

function number$2(x) {
  return x === null ? NaN : +x;
}

const ascendingBisect = bisector(ascending$1);
const bisectRight = ascendingBisect.right;
bisector(number$2).center;
var bisect = bisectRight;

class InternMap extends Map {
  constructor(entries, key = keyof) {
    super();
    Object.defineProperties(this, {_intern: {value: new Map()}, _key: {value: key}});
    if (entries != null) for (const [key, value] of entries) this.set(key, value);
  }
  get(key) {
    return super.get(intern_get(this, key));
  }
  has(key) {
    return super.has(intern_get(this, key));
  }
  set(key, value) {
    return super.set(intern_set(this, key), value);
  }
  delete(key) {
    return super.delete(intern_delete(this, key));
  }
}

function intern_get({_intern, _key}, value) {
  const key = _key(value);
  return _intern.has(key) ? _intern.get(key) : value;
}

function intern_set({_intern, _key}, value) {
  const key = _key(value);
  if (_intern.has(key)) return _intern.get(key);
  _intern.set(key, value);
  return value;
}

function intern_delete({_intern, _key}, value) {
  const key = _key(value);
  if (_intern.has(key)) {
    value = _intern.get(key);
    _intern.delete(key);
  }
  return value;
}

function keyof(value) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}

const e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function tickSpec(start, stop, count) {
  const step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log10(step)),
      error = step / Math.pow(10, power),
      factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
  let i1, i2, inc;
  if (power < 0) {
    inc = Math.pow(10, -power) / factor;
    i1 = Math.round(start * inc);
    i2 = Math.round(stop * inc);
    if (i1 / inc < start) ++i1;
    if (i2 / inc > stop) --i2;
    inc = -inc;
  } else {
    inc = Math.pow(10, power) * factor;
    i1 = Math.round(start / inc);
    i2 = Math.round(stop / inc);
    if (i1 * inc < start) ++i1;
    if (i2 * inc > stop) --i2;
  }
  if (i2 < i1 && 0.5 <= count && count < 2) return tickSpec(start, stop, count * 2);
  return [i1, i2, inc];
}

function ticks(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  if (!(count > 0)) return [];
  if (start === stop) return [start];
  const reverse = stop < start, [i1, i2, inc] = reverse ? tickSpec(stop, start, count) : tickSpec(start, stop, count);
  if (!(i2 >= i1)) return [];
  const n = i2 - i1 + 1, ticks = new Array(n);
  if (reverse) {
    if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) / -inc;
    else for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) * inc;
  } else {
    if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) / -inc;
    else for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) * inc;
  }
  return ticks;
}

function tickIncrement(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  return tickSpec(start, stop, count)[2];
}

function tickStep(start, stop, count) {
  stop = +stop, start = +start, count = +count;
  const reverse = stop < start, inc = reverse ? tickIncrement(stop, start, count) : tickIncrement(start, stop, count);
  return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
}

function range(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}

function identity$4(x) {
  return x;
}

var top = 1,
    right = 2,
    bottom = 3,
    left = 4,
    epsilon = 1e-6;

function translateX(x) {
  return "translate(" + x + ",0)";
}

function translateY(y) {
  return "translate(0," + y + ")";
}

function number$1(scale) {
  return d => +scale(d);
}

function center(scale, offset) {
  offset = Math.max(0, scale.bandwidth() - offset * 2) / 2;
  if (scale.round()) offset = Math.round(offset);
  return d => +scale(d) + offset;
}

function entering() {
  return !this.__axis;
}

function axis(orient, scale) {
  var tickArguments = [],
      tickValues = null,
      tickFormat = null,
      tickSizeInner = 6,
      tickSizeOuter = 6,
      tickPadding = 3,
      offset = typeof window !== "undefined" && window.devicePixelRatio > 1 ? 0 : 0.5,
      k = orient === top || orient === left ? -1 : 1,
      x = orient === left || orient === right ? "x" : "y",
      transform = orient === top || orient === bottom ? translateX : translateY;

  function axis(context) {
    var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
        format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$4) : tickFormat,
        spacing = Math.max(tickSizeInner, 0) + tickPadding,
        range = scale.range(),
        range0 = +range[0] + offset,
        range1 = +range[range.length - 1] + offset,
        position = (scale.bandwidth ? center : number$1)(scale.copy(), offset),
        selection = context.selection ? context.selection() : context,
        path = selection.selectAll(".domain").data([null]),
        tick = selection.selectAll(".tick").data(values, scale).order(),
        tickExit = tick.exit(),
        tickEnter = tick.enter().append("g").attr("class", "tick"),
        line = tick.select("line"),
        text = tick.select("text");

    path = path.merge(path.enter().insert("path", ".tick")
        .attr("class", "domain")
        .attr("stroke", "currentColor"));

    tick = tick.merge(tickEnter);

    line = line.merge(tickEnter.append("line")
        .attr("stroke", "currentColor")
        .attr(x + "2", k * tickSizeInner));

    text = text.merge(tickEnter.append("text")
        .attr("fill", "currentColor")
        .attr(x, k * spacing)
        .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

    if (context !== selection) {
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);

      tickExit = tickExit.transition(context)
          .attr("opacity", epsilon)
          .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d + offset) : this.getAttribute("transform"); });

      tickEnter
          .attr("opacity", epsilon)
          .attr("transform", function(d) { var p = this.parentNode.__axis; return transform((p && isFinite(p = p(d)) ? p : position(d)) + offset); });
    }

    tickExit.remove();

    path
        .attr("d", orient === left || orient === right
            ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H" + offset + "V" + range1 + "H" + k * tickSizeOuter : "M" + offset + "," + range0 + "V" + range1)
            : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V" + offset + "H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + "," + offset + "H" + range1));

    tick
        .attr("opacity", 1)
        .attr("transform", function(d) { return transform(position(d) + offset); });

    line
        .attr(x + "2", k * tickSizeInner);

    text
        .attr(x, k * spacing)
        .text(format);

    selection.filter(entering)
        .attr("fill", "none")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

    selection
        .each(function() { this.__axis = position; });
  }

  axis.scale = function(_) {
    return arguments.length ? (scale = _, axis) : scale;
  };

  axis.ticks = function() {
    return tickArguments = Array.from(arguments), axis;
  };

  axis.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : Array.from(_), axis) : tickArguments.slice();
  };

  axis.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : Array.from(_), axis) : tickValues && tickValues.slice();
  };

  axis.tickFormat = function(_) {
    return arguments.length ? (tickFormat = _, axis) : tickFormat;
  };

  axis.tickSize = function(_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
  };

  axis.tickSizeInner = function(_) {
    return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
  };

  axis.tickSizeOuter = function(_) {
    return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
  };

  axis.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, axis) : tickPadding;
  };

  axis.offset = function(_) {
    return arguments.length ? (offset = +_, axis) : offset;
  };

  return axis;
}

function axisBottom(scale) {
  return axis(bottom, scale);
}

function axisLeft(scale) {
  return axis(left, scale);
}

var noop = {value: () => {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames$1(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames$1(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get$1(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set$1(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none() {}

function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection$1(subgroups, this._parents);
}

// Given something array like (or null), returns something that is strictly an
// array. This is used to ensure that array-like objects passed to d3.selectAll
// or selection.selectAll are converted into proper arrays when creating a
// selection; we don’t ever want to create a selection backed by a live
// HTMLCollection or NodeList. However, note that selection.selectAll will use a
// static NodeList as a group, since it safely derived from querySelectorAll.
function array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}

function empty() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

function arrayAll(select) {
  return function() {
    return array(select.apply(this, arguments));
  };
}

function selection_selectAll(select) {
  if (typeof select === "function") select = arrayAll(select);
  else select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection$1(subgroups, parents);
}

function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}

var find = Array.prototype.find;

function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}

function childFirst() {
  return this.firstElementChild;
}

function selection_selectChild(match) {
  return this.select(match == null ? childFirst
      : childFind(typeof match === "function" ? match : childMatcher(match)));
}

var filter = Array.prototype.filter;

function children() {
  return Array.from(this.children);
}

function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}

function selection_selectChildren(match) {
  return this.selectAll(match == null ? children
      : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection$1(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant$2(x) {
  return function() {
    return x;
  };
}

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = new Map,
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
      exit[i] = node;
    }
  }
}

function datum(node) {
  return node.__data__;
}

function selection_data(value, key) {
  if (!arguments.length) return Array.from(this, datum);

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant$2(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection$1(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

// Given some data, this returns an array-like view of it: an object that
// exposes a length property and allows numeric indexing. Note that unlike
// selectAll, this isn’t worried about “live” collections because the resulting
// array will only be used briefly while data is being bound. (It is possible to
// cause the data to change while iterating by using a key function, but please
// don’t; we’d rather avoid a gratuitous copy.)
function arraylike(data) {
  return typeof data === "object" && "length" in data
    ? data // Array, TypedArray, NodeList, array-like
    : Array.from(data); // Map, Set, iterable, string, or anything else
}

function selection_exit() {
  return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter) enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update) update = update.selection();
  }
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge(context) {
  var selection = context.selection ? context.selection() : context;

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection$1(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection$1(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  return Array.from(this);
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  let size = 0;
  for (const node of this) ++size; // eslint-disable-line no-unused-vars
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove$1(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS$1(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant$1(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS$1(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction$1(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS$1(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
      : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove$1(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant$1(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction$1(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove$1 : typeof value === "function"
            ? styleFunction$1
            : styleConstant$1)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant$1(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction$1(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction$1
          : textConstant$1)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, options) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
  return this;
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

function* selection_iterator() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) yield node;
    }
  }
}

var root = [null];

function Selection$1(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection$1([[document.documentElement]], root);
}

function selection_selection() {
  return this;
}

Selection$1.prototype = selection.prototype = {
  constructor: Selection$1,
  select: selection_select,
  selectAll: selection_selectAll,
  selectChild: selection_selectChild,
  selectChildren: selection_selectChildren,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  selection: selection_selection,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch,
  [Symbol.iterator]: selection_iterator
};

function select(selector) {
  return typeof selector === "string"
      ? new Selection$1([[document.querySelector(selector)]], [document.documentElement])
      : new Selection$1([[selector]], root);
}

function create$1(name) {
  return select(creator(name).call(document.documentElement));
}

function sourceEvent(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent) event = sourceEvent;
  return event;
}

function pointer(event, node) {
  event = sourceEvent(event);
  if (node === undefined) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

// These are typically used in conjunction with noevent to ensure that we can
const nonpassivecapture = {capture: true, passive: false};

function noevent$1(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

function dragDisable(view) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", noevent$1, nonpassivecapture);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent$1, nonpassivecapture);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent$1, nonpassivecapture);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
    reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
    reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
    reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
    reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
    reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor, this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex, // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHex8() {
  return this.rgb().formatHex8();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
      : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
      : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
      : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
      : null) // invalid hex
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return (-0.5 <= this.r && this.r < 255.5)
        && (-0.5 <= this.g && this.g < 255.5)
        && (-0.5 <= this.b && this.b < 255.5)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex, // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}

function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}

function rgb_formatRgb() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}

function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}

function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}

function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));

function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}

function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

var constant$1 = x => () => x;

function linear$1(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear$1(a, d) : constant$1(isNaN(a) ? b : a);
}

var interpolateRgb = (function rgbGamma(y) {
  var color = gamma(y);

  function rgb$1(start, end) {
    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$1.gamma = rgbGamma;

  return rgb$1;
})(1);

function numberArray(a, b) {
  if (!b) b = [];
  var n = a ? Math.min(b.length, a.length) : 0,
      c = b.slice(),
      i;
  return function(t) {
    for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
    return c;
  };
}

function isNumberArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}

function genericArray(a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(na),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = interpolate$1(a[i], b[i]);
  for (; i < nb; ++i) c[i] = b[i];

  return function(t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);
    return c;
  };
}

function date(a, b) {
  var d = new Date;
  return a = +a, b = +b, function(t) {
    return d.setTime(a * (1 - t) + b * t), d;
  };
}

function interpolateNumber(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

function object(a, b) {
  var i = {},
      c = {},
      k;

  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = interpolate$1(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function(t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
}

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

function interpolateString(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: interpolateNumber(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
}

function interpolate$1(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? constant$1(b)
      : (t === "number" ? interpolateNumber
      : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
      : b instanceof color ? interpolateRgb
      : b instanceof Date ? date
      : isNumberArray(b) ? numberArray
      : Array.isArray(b) ? genericArray
      : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
      : interpolateNumber)(a, b);
}

function interpolateRound(a, b) {
  return a = +a, b = +b, function(t) {
    return Math.round(a * (1 - t) + b * t);
  };
}

var degrees = 180 / Math.PI;

var identity$3 = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

function decompose(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

var svgNode;

/* eslint-disable no-undef */
function parseCss(value) {
  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m.isIdentity ? identity$3 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
}

function parseSvg(value) {
  if (value == null) return identity$3;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity$3;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}

function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function(a, b) {
    var s = [], // string constants and placeholders
        q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

var epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}

var interpolateZoom = (function zoomRho(rho, rho2, rho4) {

  // p0 = [ux0, uy0, w0]
  // p1 = [ux1, uy1, w1]
  function zoom(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
        ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
        dx = ux1 - ux0,
        dy = uy1 - uy0,
        d2 = dx * dx + dy * dy,
        i,
        S;

    // Special case for u0 ≅ u1.
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      };
    }

    // General case.
    else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }

    i.duration = S * 1000 * rho / Math.SQRT2;

    return i;
  }

  zoom.rho = function(_) {
    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
    return zoomRho(_1, _2, _4);
  };

  return zoom;
})(Math.SQRT2, 2, 4);

var frame = 0, // is an animation frame pending?
    timeout$1 = 0, // is a timeout pending?
    interval = 0, // are any timers active?
    pokeDelay = 1000, // how frequently we check for clock skew
    taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
    t = t._next;
  }
  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout$1 = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout$1) timeout$1 = clearTimeout(timeout$1);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

function timeout(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(elapsed => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

function schedule(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index, // For context during callback.
    group: group, // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = get(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function set(node, id) {
  var schedule = get(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function get(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween;

  // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  schedules[id] = self;
  self.timer = timer(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return timeout(start);

      // Interrupt the active transition, if any.
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }

      // Cancel any pre-empted transitions.
      else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    timeout(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted
    self.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    }

    // Dispatch the end event.
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules) return; // eslint-disable-line no-unused-vars
    delete node.__transition;
  }
}

function interrupt(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}

function selection_interrupt(name) {
  return this.each(function() {
    interrupt(this, name);
  });
}

function tweenRemove(id, name) {
  var tween0, tween1;
  return function() {
    var schedule = set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error;
  return function() {
    var schedule = set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

function transition_tween(name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = get(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function() {
    var schedule = set(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });

  return function(node) {
    return get(node, id).value[name];
  };
}

function interpolate(a, b) {
  var c;
  return (typeof b === "number" ? interpolateNumber
      : b instanceof color ? interpolateRgb
      : (c = color(b)) ? (b = c, interpolateRgb)
      : interpolateString)(a, b);
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrConstantNS(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attrFunctionNS(fullname, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function transition_attr(name, value) {
  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
      : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
      : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}

function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_attrTween(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

function delayFunction(id, value) {
  return function() {
    init(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function() {
    init(this, id).delay = value;
  };
}

function transition_delay(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? delayFunction
          : delayConstant)(id, value))
      : get(this.node(), id).delay;
}

function durationFunction(id, value) {
  return function() {
    set(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function() {
    set(this, id).duration = value;
  };
}

function transition_duration(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? durationFunction
          : durationConstant)(id, value))
      : get(this.node(), id).duration;
}

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error;
  return function() {
    set(this, id).ease = value;
  };
}

function transition_ease(value) {
  var id = this._id;

  return arguments.length
      ? this.each(easeConstant(id, value))
      : get(this.node(), id).ease;
}

function easeVarying(id, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (typeof v !== "function") throw new Error;
    set(this, id).ease = v;
  };
}

function transition_easeVarying(value) {
  if (typeof value !== "function") throw new Error;
  return this.each(easeVarying(this._id, value));
}

function transition_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
}

function transition_merge(transition) {
  if (transition._id !== this._id) throw new Error;

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Transition(merges, this._parents, this._name, this._id);
}

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0, on1, sit = start(name) ? init : set;
  return function() {
    var schedule = sit(this, id),
        on = schedule.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule.on = on1;
  };
}

function transition_on(name, listener) {
  var id = this._id;

  return arguments.length < 2
      ? get(this.node(), id).on.on(name)
      : this.each(onFunction(id, name, listener));
}

function removeFunction(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}

function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}

function transition_select(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
}

function transition_selectAll(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            schedule(child, name, id, k, children, inherit);
          }
        }
        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new Transition(subgroups, parents, name, id);
}

var Selection = selection.prototype.constructor;

function transition_selection() {
  return new Selection(this._groups, this._parents);
}

function styleNull(name, interpolate) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function styleFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
  return function() {
    var schedule = set(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

    schedule.on = on1;
  };
}

function transition_style(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
  return value == null ? this
      .styleTween(name, styleNull(name, i))
      .on("end.style." + name, styleRemove(name))
    : typeof value === "function" ? this
      .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
      .each(styleMaybeRemove(this._id, name))
    : this
      .styleTween(name, styleConstant(name, i, value), priority)
      .on("end.style." + name, null);
}

function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}

function transition_styleTween(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function transition_text(value) {
  return this.tween("text", typeof value === "function"
      ? textFunction(tweenValue(this, "text", value))
      : textConstant(value == null ? "" : value + ""));
}

function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}

function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_textTween(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, textTween(value));
}

function transition_transition() {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = get(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new Transition(groups, this._parents, name, id1);
}

function transition_end() {
  var on0, on1, that = this, id = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = {value: reject},
        end = {value: function() { if (--size === 0) resolve(); }};

    that.each(function() {
      var schedule = set(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }

      schedule.on = on1;
    });

    // The selection was empty, resolve end immediately
    if (size === 0) resolve();
  });
}

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function newId() {
  return ++id;
}

var selection_prototype = selection.prototype;

Transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  textTween: transition_textTween,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease,
  easeVarying: transition_easeVarying,
  end: transition_end,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};

function cubicOut(t) {
  return --t * t * t + 1;
}

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

var defaultTiming = {
  time: null, // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};

function inherit(node, id) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id} not found`);
    }
  }
  return timing;
}

function selection_transition(name) {
  var id,
      timing;

  if (name instanceof Transition) {
    id = name._id, name = name._name;
  } else {
    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new Transition(groups, this._parents, name, id);
}

selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;

function formatDecimal(x) {
  return Math.abs(x = Math.round(x)) >= 1e21
      ? x.toLocaleString("en").replace(/,/g, "")
      : x.toString(10);
}

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimalParts(1.23) returns ["123", 0].
function formatDecimalParts(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i, coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
}

function exponent(x) {
  return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
}

function formatGroup(grouping, thousands) {
  return function(value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
}

function formatNumerals(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}

// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
  this.align = specifier.align === undefined ? ">" : specifier.align + "";
  this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === undefined ? undefined : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === undefined ? "" : specifier.type + "";
}

FormatSpecifier.prototype.toString = function() {
  return this.fill
      + this.align
      + this.sign
      + this.symbol
      + (this.zero ? "0" : "")
      + (this.width === undefined ? "" : Math.max(1, this.width | 0))
      + (this.comma ? "," : "")
      + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
      + (this.trim ? "~" : "")
      + this.type;
};

// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
function formatTrim(s) {
  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (s[i]) {
      case ".": i0 = i1 = i; break;
      case "0": if (i0 === 0) i0 = i; i1 = i; break;
      default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
    }
  }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

var prefixExponent;

function formatPrefixAuto(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient
      : i > n ? coefficient + new Array(i - n + 1).join("0")
      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
      : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
}

function formatRounded(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

var formatTypes = {
  "%": (x, p) => (x * 100).toFixed(p),
  "b": (x) => Math.round(x).toString(2),
  "c": (x) => x + "",
  "d": formatDecimal,
  "e": (x, p) => x.toExponential(p),
  "f": (x, p) => x.toFixed(p),
  "g": (x, p) => x.toPrecision(p),
  "o": (x) => Math.round(x).toString(8),
  "p": (x, p) => formatRounded(x * 100, p),
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": (x) => Math.round(x).toString(16).toUpperCase(),
  "x": (x) => Math.round(x).toString(16)
};

function identity$2(x) {
  return x;
}

var map = Array.prototype.map,
    prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

function formatLocale(locale) {
  var group = locale.grouping === undefined || locale.thousands === undefined ? identity$2 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
      currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
      currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
      decimal = locale.decimal === undefined ? "." : locale.decimal + "",
      numerals = locale.numerals === undefined ? identity$2 : formatNumerals(map.call(locale.numerals, String)),
      percent = locale.percent === undefined ? "%" : locale.percent + "",
      minus = locale.minus === undefined ? "−" : locale.minus + "",
      nan = locale.nan === undefined ? "NaN" : locale.nan + "";

  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);

    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        trim = specifier.trim,
        type = specifier.type;

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // The "" type, and any invalid type, is an alias for ".12~g".
    else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision === undefined ? 6
        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
        : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i, n, c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;

        // Determine the sign. -0 is not less than 0, but 1 / -0 is!
        var valueNegative = value < 0 || 1 / value < 0;

        // Perform the initial formatting.
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

        // Trim insignificant zeros.
        if (trim) value = formatTrim(value);

        // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
        if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

        // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }

      // If the fill character is not "0", grouping is applied before padding.
      if (comma && !zero) value = group(value, Infinity);

      // Compute the padding.
      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : "";

      // If the fill character is "0", grouping is applied after padding.
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

      // Reconstruct the final output based on the desired alignment.
      switch (align) {
        case "<": value = valuePrefix + value + valueSuffix + padding; break;
        case "=": value = valuePrefix + padding + value + valueSuffix; break;
        case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
        default: value = padding + valuePrefix + value + valueSuffix; break;
      }

      return numerals(value);
    }

    format.toString = function() {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function(value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
}

var locale;
var format;
var formatPrefix;

defaultLocale({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

function defaultLocale(definition) {
  locale = formatLocale(definition);
  format = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}

function precisionFixed(step) {
  return Math.max(0, -exponent(Math.abs(step)));
}

function precisionPrefix(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
}

function precisionRound(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent(max) - exponent(step)) + 1;
}

function initRange(domain, range) {
  switch (arguments.length) {
    case 0: break;
    case 1: this.range(domain); break;
    default: this.range(range).domain(domain); break;
  }
  return this;
}

const implicit = Symbol("implicit");

function ordinal() {
  var index = new InternMap(),
      domain = [],
      range = [],
      unknown = implicit;

  function scale(d) {
    let i = index.get(d);
    if (i === undefined) {
      if (unknown !== implicit) return unknown;
      index.set(d, i = domain.push(d) - 1);
    }
    return range[i % range.length];
  }

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [], index = new InternMap();
    for (const value of _) {
      if (index.has(value)) continue;
      index.set(value, domain.push(value) - 1);
    }
    return scale;
  };

  scale.range = function(_) {
    return arguments.length ? (range = Array.from(_), scale) : range.slice();
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function() {
    return ordinal(domain, range).unknown(unknown);
  };

  initRange.apply(scale, arguments);

  return scale;
}

function band() {
  var scale = ordinal().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      r0 = 0,
      r1 = 1,
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;

  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = r1 < r0,
        start = reverse ? r1 : r0,
        stop = reverse ? r0 : r1;
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = range(n).map(function(i) { return start + step * i; });
    return ordinalRange(reverse ? values.reverse() : values);
  }

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function(_) {
    return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
  };

  scale.rangeRound = function(_) {
    return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
  };

  scale.bandwidth = function() {
    return bandwidth;
  };

  scale.step = function() {
    return step;
  };

  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  scale.padding = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
  };

  scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
  };

  scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
  };

  scale.align = function(_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };

  scale.copy = function() {
    return band(domain(), [r0, r1])
        .round(round)
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter)
        .align(align);
  };

  return initRange.apply(rescale(), arguments);
}

function pointish(scale) {
  var copy = scale.copy;

  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;

  scale.copy = function() {
    return pointish(copy());
  };

  return scale;
}

function point() {
  return pointish(band.apply(null, arguments).paddingInner(1));
}

function constants(x) {
  return function() {
    return x;
  };
}

function number(x) {
  return +x;
}

var unit = [0, 1];

function identity$1(x) {
  return x;
}

function normalize(a, b) {
  return (b -= (a = +a))
      ? function(x) { return (x - a) / b; }
      : constants(isNaN(b) ? NaN : 0.5);
}

function clamper(a, b) {
  var t;
  if (a > b) t = a, a = b, b = t;
  return function(x) { return Math.max(a, Math.min(b, x)); };
}

// normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
function bimap(domain, range, interpolate) {
  var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
  if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
  else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
  return function(x) { return r0(d0(x)); };
}

function polymap(domain, range, interpolate) {
  var j = Math.min(domain.length, range.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1;

  // Reverse descending domains.
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++i < j) {
    d[i] = normalize(domain[i], domain[i + 1]);
    r[i] = interpolate(range[i], range[i + 1]);
  }

  return function(x) {
    var i = bisect(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}

function copy(source, target) {
  return target
      .domain(source.domain())
      .range(source.range())
      .interpolate(source.interpolate())
      .clamp(source.clamp())
      .unknown(source.unknown());
}

function transformer() {
  var domain = unit,
      range = unit,
      interpolate = interpolate$1,
      transform,
      untransform,
      unknown,
      clamp = identity$1,
      piecewise,
      output,
      input;

  function rescale() {
    var n = Math.min(domain.length, range.length);
    if (clamp !== identity$1) clamp = clamper(domain[0], domain[n - 1]);
    piecewise = n > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate)))(transform(clamp(x)));
  }

  scale.invert = function(y) {
    return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
  };

  scale.domain = function(_) {
    return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
  };

  scale.rangeRound = function(_) {
    return range = Array.from(_), interpolate = interpolateRound, rescale();
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = _ ? true : identity$1, rescale()) : clamp !== identity$1;
  };

  scale.interpolate = function(_) {
    return arguments.length ? (interpolate = _, rescale()) : interpolate;
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  return function(t, u) {
    transform = t, untransform = u;
    return rescale();
  };
}

function continuous() {
  return transformer()(identity$1, identity$1);
}

function tickFormat(start, stop, count, specifier) {
  var step = tickStep(start, stop, count),
      precision;
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return format(specifier);
}

function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function(count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function(count, specifier) {
    var d = domain();
    return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
  };

  scale.nice = function(count) {
    if (count == null) count = 10;

    var d = domain();
    var i0 = 0;
    var i1 = d.length - 1;
    var start = d[i0];
    var stop = d[i1];
    var prestep;
    var step;
    var maxIter = 10;

    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }
    
    while (maxIter-- > 0) {
      step = tickIncrement(start, stop, count);
      if (step === prestep) {
        d[i0] = start;
        d[i1] = stop;
        return domain(d);
      } else if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
      } else {
        break;
      }
      prestep = step;
    }

    return scale;
  };

  return scale;
}

function linear() {
  var scale = continuous();

  scale.copy = function() {
    return copy(scale, linear());
  };

  initRange.apply(scale, arguments);

  return linearish(scale);
}

var constant = x => () => x;

function ZoomEvent(type, {
  sourceEvent,
  target,
  transform,
  dispatch
}) {
  Object.defineProperties(this, {
    type: {value: type, enumerable: true, configurable: true},
    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
    target: {value: target, enumerable: true, configurable: true},
    transform: {value: transform, enumerable: true, configurable: true},
    _: {value: dispatch}
  });
}

function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}

Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};

var identity = new Transform(1, 0, 0);

Transform.prototype;

function nopropagation(event) {
  event.stopImmediatePropagation();
}

function noevent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// Ignore right-click, since that should open the context menu.
// except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
function defaultFilter(event) {
  return (!event.ctrlKey || event.type === 'wheel') && !event.button;
}

function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}

function defaultTransform() {
  return this.__zoom || identity;
}

function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

function defaultConstrain(transform, extent, translateExtent) {
  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
      dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
      dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
      dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
  return transform.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}

function zoom() {
  var filter = defaultFilter,
      extent = defaultExtent,
      constrain = defaultConstrain,
      wheelDelta = defaultWheelDelta,
      touchable = defaultTouchable,
      scaleExtent = [0, Infinity],
      translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
      duration = 250,
      interpolate = interpolateZoom,
      listeners = dispatch("start", "zoom", "end"),
      touchstarting,
      touchfirst,
      touchending,
      touchDelay = 500,
      wheelDelay = 150,
      clickDistance2 = 0,
      tapDistance = 10;

  function zoom(selection) {
    selection
        .property("__zoom", defaultTransform)
        .on("wheel.zoom", wheeled, {passive: false})
        .on("mousedown.zoom", mousedowned)
        .on("dblclick.zoom", dblclicked)
      .filter(touchable)
        .on("touchstart.zoom", touchstarted)
        .on("touchmove.zoom", touchmoved)
        .on("touchend.zoom touchcancel.zoom", touchended)
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  zoom.transform = function(collection, transform, point, event) {
    var selection = collection.selection ? collection.selection() : collection;
    selection.property("__zoom", defaultTransform);
    if (collection !== selection) {
      schedule(collection, transform, point, event);
    } else {
      selection.interrupt().each(function() {
        gesture(this, arguments)
          .event(event)
          .start()
          .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
          .end();
      });
    }
  };

  zoom.scaleBy = function(selection, k, p, event) {
    zoom.scaleTo(selection, function() {
      var k0 = this.__zoom.k,
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p, event);
  };

  zoom.scaleTo = function(selection, k, p, event) {
    zoom.transform(selection, function() {
      var e = extent.apply(this, arguments),
          t0 = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
          p1 = t0.invert(p0),
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p, event);
  };

  zoom.translateBy = function(selection, x, y, event) {
    zoom.transform(selection, function() {
      return constrain(this.__zoom.translate(
        typeof x === "function" ? x.apply(this, arguments) : x,
        typeof y === "function" ? y.apply(this, arguments) : y
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };

  zoom.translateTo = function(selection, x, y, p, event) {
    zoom.transform(selection, function() {
      var e = extent.apply(this, arguments),
          t = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(identity.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x === "function" ? -x.apply(this, arguments) : -x,
        typeof y === "function" ? -y.apply(this, arguments) : -y
      ), e, translateExtent);
    }, p, event);
  };

  function scale(transform, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
  }

  function translate(transform, p0, p1) {
    var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
    return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
  }

  function centroid(extent) {
    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
  }

  function schedule(transition, transform, point, event) {
    transition
        .on("start.zoom", function() { gesture(this, arguments).event(event).start(); })
        .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).event(event).end(); })
        .tween("zoom", function() {
          var that = this,
              args = arguments,
              g = gesture(that, args).event(event),
              e = extent.apply(that, args),
              p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
              w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
              a = that.__zoom,
              b = typeof transform === "function" ? transform.apply(that, args) : transform,
              i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
          return function(t) {
            if (t === 1) t = b; // Avoid rounding error on end.
            else { var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
            g.zoom(null, t);
          };
        });
  }

  function gesture(that, args, clean) {
    return (!clean && that.__zooming) || new Gesture(that, args);
  }

  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }

  Gesture.prototype = {
    event: function(event) {
      if (event) this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
      this.that.__zoom = transform;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type) {
      var d = select(this.that).datum();
      listeners.call(
        type,
        this.that,
        new ZoomEvent(type, {
          sourceEvent: this.sourceEvent,
          target: zoom,
          type,
          transform: this.that.__zoom,
          dispatch: listeners
        }),
        d
      );
    }
  };

  function wheeled(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var g = gesture(this, args).event(event),
        t = this.__zoom,
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
        p = pointer(event);

    // If the mouse is in the same location as before, reuse it.
    // If there were recent wheel events, reset the wheel idle timeout.
    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }
      clearTimeout(g.wheel);
    }

    // If this wheel event won’t trigger a transform change, ignore it.
    else if (t.k === k) return;

    // Otherwise, capture the mouse point and location at the start.
    else {
      g.mouse = [p, t.invert(p)];
      interrupt(this);
      g.start();
    }

    noevent(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }

  function mousedowned(event, ...args) {
    if (touchending || !filter.apply(this, arguments)) return;
    var currentTarget = event.currentTarget,
        g = gesture(this, args, true).event(event),
        v = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
        p = pointer(event, currentTarget),
        x0 = event.clientX,
        y0 = event.clientY;

    dragDisable(event.view);
    nopropagation(event);
    g.mouse = [p, this.__zoom.invert(p)];
    interrupt(this);
    g.start();

    function mousemoved(event) {
      noevent(event);
      if (!g.moved) {
        var dx = event.clientX - x0, dy = event.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event)
       .zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }

    function mouseupped(event) {
      v.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event.view, g.moved);
      noevent(event);
      g.event(event).end();
    }
  }

  function dblclicked(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var t0 = this.__zoom,
        p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this),
        p1 = t0.invert(p0),
        k1 = t0.k * (event.shiftKey ? 0.5 : 2),
        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);

    noevent(event);
    if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0, event);
    else select(this).call(zoom.transform, t1, p0, event);
  }

  function touchstarted(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var touches = event.touches,
        n = touches.length,
        g = gesture(this, args, event.changedTouches.length === n).event(event),
        started, i, t, p;

    nopropagation(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer(t, this);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }

    if (touchstarting) touchstarting = clearTimeout(touchstarting);

    if (started) {
      if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
      interrupt(this);
      g.start();
    }
  }

  function touchmoved(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event),
        touches = event.changedTouches,
        n = touches.length, i, t, p, l;

    noevent(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer(t, this);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
    }
    t = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1],
          p1 = g.touch1[0], l1 = g.touch1[1],
          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    }
    else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
    else return;

    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }

  function touchended(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event),
        touches = event.changedTouches,
        n = touches.length, i, t;

    nopropagation(event);
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, touchDelay);
    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }
    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
      if (g.taps === 2) {
        t = pointer(t, this);
        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
          var p = select(this).on("dblclick.zoom");
          if (p) p.apply(this, arguments);
        }
      }
    }
  }

  zoom.wheelDelta = function(_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant(+_), zoom) : wheelDelta;
  };

  zoom.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), zoom) : filter;
  };

  zoom.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), zoom) : touchable;
  };

  zoom.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
  };

  zoom.scaleExtent = function(_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
  };

  zoom.translateExtent = function(_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };

  zoom.constrain = function(_) {
    return arguments.length ? (constrain = _, zoom) : constrain;
  };

  zoom.duration = function(_) {
    return arguments.length ? (duration = +_, zoom) : duration;
  };

  zoom.interpolate = function(_) {
    return arguments.length ? (interpolate = _, zoom) : interpolate;
  };

  zoom.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom : value;
  };

  zoom.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
  };

  zoom.tapDistance = function(_) {
    return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
  };

  return zoom;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function rectRound(rect, decimals) {
    if (decimals === void 0) { decimals = 0; }
    return __assign(__assign({}, positionRound(rect, decimals)), sizeRound(rect, decimals));
}
function rectEquals(rectA, rectB, epsilon) {
    if (epsilon === void 0) { epsilon = 0.001; }
    return positionEquals(rectA, rectB, epsilon) && sizeEquals(rectA, rectB, epsilon);
}
function rectMinimized(rect) {
    return __assign(__assign({}, rectCenter(rect)), { width: 0, height: 0 });
}
function rectFitStroke(rect, stroke) {
    return {
        x: rect.x + stroke / 2,
        y: rect.y + stroke / 2,
        width: Math.max(0, rect.width - stroke),
        height: Math.max(0, rect.height - stroke)
    };
}
function rectPosition(rect, sizePercentageFromTopLeft) {
    return {
        x: rect.x + rect.width * sizePercentageFromTopLeft.x,
        y: rect.y + rect.height * sizePercentageFromTopLeft.y
    };
}
function rectCenter(rect) {
    return rectPosition(rect, { x: 0.5, y: 0.5 });
}
function rectTop(rect) {
    return rectPosition(rect, { x: 0.5, y: 0 });
}
function rectBottom(rect) {
    return rectPosition(rect, { x: 0.5, y: 1 });
}
function rectLeft(rect) {
    return rectPosition(rect, { x: 0, y: 0.5 });
}
function rectRight(rect) {
    return rectPosition(rect, { x: 1, y: 0.5 });
}
function rectBottomLeft(rect) {
    return rectPosition(rect, { x: 0, y: 1 });
}
function rectBottomRight(rect) {
    return rectPosition(rect, { x: 1, y: 1 });
}
function rectTopRight(rect) {
    return rectPosition(rect, { x: 1, y: 0 });
}
function rectTopLeft(rect) {
    return rectPosition(rect, { x: 0, y: 0 });
}
function rectToString(rect, decimals) {
    if (decimals === void 0) { decimals = 0; }
    return "".concat(positionToString(rect, decimals), ", ").concat(sizeToString(rect, decimals));
}
function rectFromString(str) {
    var parts = str.split(',').map(function (s) { return parseFloat(s.trim()); });
    return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}
function rectToViewBox(selectionOrTransition, rect) {
    selectionOrTransition
        .call(function (s) {
        var _a = positionRound(rect), x = _a.x, y = _a.y;
        var _b = sizeRound(rect), width = _b.width, height = _b.height;
        s.attr('viewbox', "".concat(x, ", ").concat(y, ", ").concat(width, ", ").concat(height));
    });
}
function rectToAttrs(selectionOrTransition, rect) {
    selectionOrTransition
        .call(function (s) { return positionToAttrs(s, rect); })
        .call(function (s) { return sizeToAttrs(s, rect); });
}
function rectFromAttrs(selectionOrTransition) {
    return __assign(__assign({}, positionFromAttrs(selectionOrTransition)), sizeFromAttrs(selectionOrTransition));
}
function rectFromSize(size) {
    return __assign({ x: 0, y: 0 }, size);
}

function elementRelativeBounds(element) {
    console.assert(element.isConnected, 'Element needs to be attached to the DOM.');
    var bounds = element.getBoundingClientRect();
    var parentBounds = element.parentElement.getBoundingClientRect();
    return rectRound({
        x: bounds.x - parentBounds.x,
        y: bounds.y - parentBounds.y,
        width: bounds.width,
        height: bounds.height
    }, 2);
}
// inspired by https://stackoverflow.com/a/22909984
function elementComputedStyleWithoutDefaults(element, properties) {
    var dummy = document.createElement('style-dummy-tag');
    element.parentElement.appendChild(dummy);
    var defaultStyle = window.getComputedStyle(dummy);
    var style = window.getComputedStyle(element);
    var diff = {};
    properties.forEach(function (p) {
        var defaultValue = defaultStyle.getPropertyValue(p);
        var value = style.getPropertyValue(p);
        if (p === 'overflow' || defaultValue !== value) {
            diff[p] = value;
        }
    });
    dummy.remove();
    return diff;
}
function elementData(element) {
    return select(element).datum();
}
function elementIs(obj) {
    return obj instanceof Element || obj instanceof HTMLElement || obj instanceof SVGElement;
}
// extracted from the SVG specification
var elementSVGPresentationAttrs = [
    'fill',
    'alignment-baseline',
    'baseline-shift',
    'clip-path',
    'clip-rule',
    'color',
    'color-interpolation',
    'color-interpolation-filters',
    'color-rendering',
    'cursor',
    'direction',
    'display',
    'dominant-baseline',
    'fill-opacity',
    'fill-rule',
    'filter',
    'flood-color',
    'flood-opacity',
    'font-family',
    'font-size',
    'font-size-adjust',
    'font-stretch',
    'font-style',
    'font-variant',
    'font-weight',
    'glyph-orientation-horizontal',
    'glyph-orientation-vertical',
    'image-rendering',
    'letter-spacing',
    'lighting-color',
    'marker-end',
    'marker-mid',
    'marker-start',
    'mask',
    'opacity',
    'overflow',
    'paint-order',
    'pointer-events',
    'shape-rendering',
    'stop-color',
    'stop-opacity',
    'stroke',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'text-anchor',
    'text-decoration',
    'text-overflow',
    'text-rendering',
    'unicode-bidi',
    'vector-effect',
    'visibility',
    'white-space',
    'word-spacing',
    'writing-mode',
    'transform',
];

function circleRound(circle, decimals) {
    if (decimals === void 0) { decimals = 0; }
    var e = Math.pow(10, decimals);
    return {
        center: positionRound(circle.center, decimals),
        radius: Math.round(circle.radius * e) / e
    };
}
function circleEquals(a, b, epsilon) {
    if (epsilon === void 0) { epsilon = 0.001; }
    return positionEquals(a.center, b.center, epsilon) && Math.abs(a.radius - b.radius) < epsilon;
}
function circleToString(circle, decimals) {
    if (decimals === void 0) { decimals = 1; }
    circle = circleRound(circle, decimals);
    return "".concat(circle.center.x, ", ").concat(circle.center.y, ", ").concat(circle.radius);
}
function circleFromString(str) {
    var parts = str.split(',').map(function (s) { return parseFloat(s.trim()); });
    return { center: { x: parts[0], y: parts[1] }, radius: parts[2] };
}
function circleToAttrs(selectionOrTransition, circle) {
    selectionOrTransition.attr('cx', circle.center.x); //Typescript Problem on chaining?
    selectionOrTransition.attr('cy', circle.center.y);
    selectionOrTransition.attr('r', circle.radius);
    selectionOrTransition.attr('fill', circle.color ? circle.color : null);
}
function circleFromAttrs(selectionOrTransition) {
    var s = selectionOrTransition.selection();
    return {
        center: { x: parseFloat(s.attr('cx') || '0'), y: parseFloat(s.attr('cy') || '0') },
        radius: parseFloat(s.attr('r') || '0')
    };
}
function circleMinimized(circle) {
    return { center: circle.center, radius: 0 };
}
function circleFitStroke(circle, stroke) {
    return { center: circle.center, radius: circle.radius - stroke / 2 };
}
function circlePosition(circle, angleInDegrees, distancePercentage) {
    if (distancePercentage === void 0) { distancePercentage = 1; }
    var angleInRad = (angleInDegrees * Math.PI) / 180;
    return {
        x: circle.center.x + circle.radius * Math.cos(angleInRad) * distancePercentage,
        y: circle.center.y + circle.radius * Math.sin(angleInRad) * distancePercentage
    };
}
function circleInsideRect(rect) {
    return { center: rectCenter(rect), radius: Math.min(rect.width, rect.height) / 2 };
}
function circleOutsideRect(rect) {
    return {
        center: rectCenter(rect),
        radius: Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2)) / 2
    };
}

function pathRect(selectionOrTransition, rect) {
    var x = rect.x, y = rect.y, w = rect.width, h = rect.height;
    selectionOrTransition = elementIs(selectionOrTransition)
        ? select(selectionOrTransition)
        : selectionOrTransition;
    selectionOrTransition.attr('d', "M ".concat(x, " ").concat(y, " h ").concat(w, " v ").concat(h, " h ").concat(-w, " v ").concat(-h));
}
function pathCircle(selectionOrTransition, circle) {
    var _a = circle.center, cx = _a.x, cy = _a.y, r = circle.radius;
    selectionOrTransition = elementIs(selectionOrTransition)
        ? select(selectionOrTransition)
        : selectionOrTransition;
    selectionOrTransition.attr('d', "M ".concat(cx - r, " ").concat(cy, " \n    a ").concat(r, ",").concat(r, " 0 1,0 ").concat(r * 2, ",0 \n    a ").concat(r, ",").concat(r, " 0 1,0 -").concat(r * 2, ",0"));
}
function pathLine(selectionOrTransition, positions) {
    if (positions.length < 2)
        return;
    selectionOrTransition = elementIs(selectionOrTransition)
        ? select(selectionOrTransition)
        : selectionOrTransition;
    selectionOrTransition.attr('d', "M".concat(positions.map(function (p) { return "".concat(p.x, ",").concat(p.y); }).join('L')));
}

function formatWithDecimalZero(formatFunction) {
    return function (val) {
        if (val === 0)
            return '0';
        return formatFunction(val);
    };
}

var boundRegex = /(\d+(?:\.\d+)?)(px|rem)/;
function findMatchingBoundsIndex(element, boundsList) {
    var e_1, _a;
    try {
        for (var _b = __values(boundsList.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), index = _d[0], bounds = _d[1];
            if (matchesBounds(element, bounds))
                return index;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return -1;
}
function matchesBounds(element, bounds) {
    var _a, _b, _c, _d;
    var _e = element.getBoundingClientRect(), width = _e.width, height = _e.height;
    var minWidthMatch = (_a = bounds.minWidth) === null || _a === void 0 ? void 0 : _a.match(boundRegex);
    if (minWidthMatch) {
        var _f = __read(minWidthMatch, 3), minWidth = _f[1], minWidthUnit = _f[2];
        if (convertToPx(element, minWidth, minWidthUnit) > width)
            return false;
    }
    var minHeightMatch = (_b = bounds.minHeight) === null || _b === void 0 ? void 0 : _b.match(boundRegex);
    if (minHeightMatch) {
        var _g = __read(minHeightMatch, 3), minHeight = _g[1], minHeightUnit = _g[2];
        if (convertToPx(element, minHeight, minHeightUnit) > height)
            return false;
    }
    var maxWidthMatch = (_c = bounds.maxWidth) === null || _c === void 0 ? void 0 : _c.match(boundRegex);
    if (maxWidthMatch) {
        var _h = __read(maxWidthMatch, 3), maxWidth = _h[1], maxWidthUnit = _h[2];
        if (convertToPx(element, maxWidth, maxWidthUnit) < width)
            return false;
    }
    var maxHeightMatch = (_d = bounds.maxHeight) === null || _d === void 0 ? void 0 : _d.match(boundRegex);
    if (maxHeightMatch) {
        var _j = __read(maxHeightMatch, 3), maxHeight = _j[1], maxHeightUnit = _j[2];
        if (convertToPx(element, maxHeight, maxHeightUnit) < height)
            return false;
    }
    return true;
}
function convertToPx(element, value, unit) {
    if (unit === 'px') {
        return value;
    }
    else if (unit === 'rem') {
        return value * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }
    else if (unit === 'em') {
        return value * parseFloat(getComputedStyle(element).fontSize);
    }
    else {
        throw new Error("Invalid unit: ".concat(unit));
    }
}

function isSelection(selectionOrTransition) {
    return selectionOrTransition['join'];
}
function isTransition(selectionOrTransition) {
    return !isSelection(selectionOrTransition);
}

function layoutNodeRoot(layouter) {
    return select(layouter)
        .selectChildren('.layout')
        .data(layedOutChildren(layouter))
        .join('div');
}
function layoutNodeStyleAttr(selection) {
    selection.each(function (d, i, g) {
        var propTrue = function (p) { return p.trim() === 'true'; };
        var computedStyle = window.getComputedStyle(g[i]);
        var fitWidth = propTrue(computedStyle.getPropertyValue('--fit-width'));
        var fitHeight = propTrue(computedStyle.getPropertyValue('--fit-height'));
        var style = '';
        if (fitWidth || fitHeight) {
            var bbox = d.getBoundingClientRect();
            if (fitWidth)
                style += "width: ".concat(bbox.width, "px; ");
            if (fitHeight)
                style += "height: ".concat(bbox.height, "px; ");
        }
        g[i].setAttribute('style', style);
    });
}
function layoutNodeClassAttr(selection) {
    selection
        .attr('class', function (d) { return d.getAttribute('class'); })
        .each(function (d, i, g) { return select(g[i]).classed(d.tagName, true); })
        .classed('layout', true);
}
function layoutNodeDataAttrs(selection) {
    selection.each(function (svgE, i, g) {
        var layoutE = g[i];
        var dataAttrsToObj = function (attrs) {
            return Array.from(attrs)
                .filter(function (a) { return a.name.startsWith('data-'); })
                .reduce(function (obj, a) {
                var _a;
                return Object.assign(obj, (_a = {}, _a["".concat(a.name)] = a.value, _a));
            }, {});
        };
        var layoutAttrs = dataAttrsToObj(layoutE.attributes);
        var svgAttrs = dataAttrsToObj(svgE.attributes);
        // remove layoutE data attrs that don't exist on svgE
        Object.keys(layoutAttrs)
            .filter(function (attr) { return svgAttrs[attr] !== undefined; })
            .forEach(function (attr) { return layoutE.removeAttribute(attr); });
        // set svgE data attrs on layoutE
        Object.keys(svgAttrs).forEach(function (attr) { return layoutE.setAttribute(attr, svgAttrs[attr]); });
    });
}
function layoutNodeBounds(selection) {
    var anyChanged = false;
    selection.each(function (svgE) {
        var svgS = select(svgE);
        var prevBounds = rectFromString(svgS.attr('bounds') || '0, 0, 0, 0');
        var bounds = elementRelativeBounds(this);
        var changed = !rectEquals(prevBounds, bounds, 0.1);
        anyChanged = anyChanged || changed;
        if (changed) {
            svgS.attr('bounds', rectToString(bounds));
            switch (svgE.tagName) {
                case 'svg':
                case 'rect':
                    svgS.call(function (s) { return rectToAttrs(s, bounds); });
                    break;
                case 'circle':
                    svgS.call(function (s) { return circleToAttrs(s, circleInsideRect(bounds)); });
                    break;
                case 'line':
                    var bottomLeft = rectBottomLeft(bounds);
                    var topRight = rectTopRight(bounds);
                    svgS
                        .attr('x1', bottomLeft.x)
                        .attr('y1', bottomLeft.y)
                        .attr('x2', topRight.x)
                        .attr('y2', topRight.y);
                    break;
                default:
                    svgS.call(function (s) { return positionToTransformAttr(s, bounds); });
            }
        }
    });
    return anyChanged;
}
function layoutNodeChildren(selection) {
    return selection
        .selectChildren('.layout')
        .data(function (d) { return layedOutChildren(d); })
        .join('div');
}
function layedOutChildren(parent) {
    return select(parent)
        .filter(':not([data-ignore-layout-children])')
        .selectChildren(':not([data-ignore-layout]):not(.layout)')
        .nodes();
}
function layouterRender(selection) {
    selection.classed('layouter', true);
}
function layouterCompute(selection) {
    selection.each(function () {
        var layouterS = select(this);
        var layoutRootS = layoutNodeRoot(this);
        var layoutS = layoutRootS;
        while (!layoutS.empty()) {
            layoutNodeClassAttr(layoutS);
            layoutNodeStyleAttr(layoutS);
            layoutNodeDataAttrs(layoutS);
            layoutS = layoutNodeChildren(layoutS);
        }
        var anyBoundsChanged = false;
        layouterS.selectAll('.layout').each(function () {
            var layoutS = select(this);
            var boundsChanged = layoutNodeBounds(layoutS);
            anyBoundsChanged = anyBoundsChanged || boundsChanged;
        });
        if (anyBoundsChanged) {
            var bounds = rectFromString(select(layoutRootS.datum()).attr('bounds'));
            layoutRootS
                .style('left', bounds.x)
                .style('top', bounds.y)
                .attr('x', null)
                .attr('y', null)
                .attr('width', null)
                .attr('height', null)
                .attr('viewBox', rectToString(__assign(__assign({}, bounds), { x: 0, y: 0 })));
            layouterS.dispatch('boundschange');
        }
    });
}

var resizeEventDispatcher = new ResizeObserver(function (entries) {
    entries.forEach(function (entry) {
        return select(entry.target).dispatch('resize', {
            detail: { bounds: entry.target.getBoundingClientRect() }
        });
    });
});
function resizeEventListener(selection) {
    selection.each(function (d, i, g) { return resizeEventDispatcher.observe(g[i]); });
}

function calcDefaultScale(values) {
    var scale = linear().domain([0, 1]);
    if (values.length > 0) {
        if (typeof values[0] === 'number') {
            var extent = [Math.min.apply(Math, __spreadArray([], __read(values), false)), Math.max.apply(Math, __spreadArray([], __read(values), false))];
            var range = extent[1] - extent[0];
            var domain = [extent[0] - range * 0.05, extent[1] + range * 0.05];
            scale = linear().domain(domain).nice();
        }
        else {
            scale = point().domain(values);
        }
    }
    return scale;
}

function calcTickAngle(element, tickOrientation) {
    function calcBoundWidthToPx(bounds) {
        var _a;
        var boundMatch = (_a = bounds.minWidth) === null || _a === void 0 ? void 0 : _a.match(boundRegex);
        if (!boundMatch)
            return 0; //TODO: enforce use of minwidth in arguments
        var _b = __read(boundMatch, 3), boundWidth = _b[1], boundWidthUnit = _b[2];
        return convertToPx(element, boundWidth, boundWidthUnit);
    }
    var boundsIndex = findMatchingBoundsIndex(element, tickOrientation.bounds);
    var orientationIndex = boundsIndex >= 0 ? boundsIndex : tickOrientation.orientation.length - 1;
    var verticalAngle = tickOrientation.rotationDirection === 'clockwise' ? 90 : -90;
    if (tickOrientation.orientation[orientationIndex] === 'horizontal')
        return 0;
    if (tickOrientation.orientation[orientationIndex] === 'vertical')
        return verticalAngle;
    var prevBoundWidth = calcBoundWidthToPx(tickOrientation.bounds[boundsIndex - 1]);
    var currentBoundWidth = calcBoundWidthToPx(tickOrientation.bounds[boundsIndex]);
    var elementWidth = element.getBoundingClientRect().width;
    var angleRatio = (prevBoundWidth - elementWidth) / (prevBoundWidth - currentBoundWidth);
    return tickOrientation.orientation[boundsIndex - 1] === 'vertical' ? (verticalAngle - angleRatio * verticalAngle) : angleRatio * verticalAngle;
}

function axisData(data) {
    return {
        scale: data.scale || linear().domain([0, 1]).range([0, 600]),
        title: data.title || '',
        subtitle: data.subtitle || '',
        configureAxis: data.configureAxis || (function () {
        }),
        tickOrientation: data.tickOrientation
    };
}
function axisLeftRender(selection) {
    selection.classed('axis axis-left', true)
        .each(function (d, i, g) { return axisRender(select(g[i]), d3Axis(axisLeft, d), d); });
}
function axisBottomRender(selection) {
    selection.classed('axis axis-bottom', true)
        .each(function (d, i, g) { return axisRender(select(g[i]), d3Axis(axisBottom, d), d); });
}
function axisSequenceRender(selection) {
    selection.classed('axis axis-sequence', true)
        .each(function (d, i, g) { return axisRender(select(g[i]), d3Axis(axisLeft, d), d); });
}
function axisRender(selection, a, axisD) {
    selection
        .selectAll('.title')
        .data([null])
        .join('g')
        .classed('title', true)
        .attr('data-ignore-layout-children', true)
        .selectAll('text')
        .data([null])
        .join('text')
        .text(axisD.title);
    selection.selectAll('.subtitle')
        .data([null])
        .join('g')
        .classed('subtitle', true)
        .attr('data-ignore-layout-children', true)
        .selectAll('text')
        .data([null])
        .join('text')
        .text(axisD.subtitle);
    var ticksS = selection
        .selectAll('.ticks-transform')
        .data([null])
        .join('g')
        .classed('ticks-transform', true)
        .selectAll('.ticks')
        .data([null])
        .join('g')
        .classed('ticks', true)
        .attr('data-ignore-layout-children', true);
    a(ticksS);
    ticksS
        .attr('fill', null)
        .attr('font-family', null)
        .attr('font-size', null)
        .attr('text-anchor', null);
    ticksS
        .selectAll('.tick')
        .attr('opacity', null)
        .attr('data-key', function (d) { return d; });
    ticksS.selectAll('.tick')
        .selectAll('.pivot')
        .data([null])
        .join('g')
        .classed('pivot', true);
    var orientation = calcOrientation();
    ticksS.selectAll('.tick').each(function (d, i, g) {
        configureTick(select(g[i]));
    });
    ticksS.selectAll('.tick line').attr('stroke', null);
    ticksS.selectAll('.tick text').attr('fill', null).attr('dx', null).attr('dy', null);
    ticksS.selectAll('.domain').attr('stroke', null).attr('fill', null);
    function configureTick(tickS) {
        var _a;
        var textS = tickS.select('text');
        var x = textS.attr('x') || '0';
        var y = textS.attr('y') || '0';
        textS.attr('x', null).attr('y', null);
        var pivotS = tickS.select('.pivot');
        pivotS.append(function () { return textS.node(); });
        if (!orientation || !axisD.tickOrientation || !selection.classed("axis-bottom")) {
            pivotS.attr('transform', "translate(".concat(x, ", ").concat(y, ")"));
            return;
        }
        var rotationDirection = orientation.angle > 15 ? 'clockwise' : orientation.angle < -15 ? 'counterclockwise' : 'none';
        textS.attr('angle', rotationDirection !== 'none' ? (_a = axisD.tickOrientation) === null || _a === void 0 ? void 0 : _a.orientation[orientation.orientationIndex] : 'horizontal')
            .style('text-anchor', rotationDirection === 'clockwise' ? 'start' : rotationDirection === 'counterclockwise' ? 'end' : 'middle')
            .style('dominant-baseline', rotationDirection !== 'none' ? 'central' : 'hanging');
        //TODO: no interpolation possible for text-anchor. Maybe do tranform translate workaround
        // console.log(orientation.angle)
        // const {width, height} = pivotS.node()!.getBoundingClientRect()
        pivotS //.transition().duration(200) //TODO: enable D3 transitions when being able to differ between initial render and succeeding renders
            .attr("transform", "translate(" + x + "," + y + ") rotate(" + orientation.angle + ")");
    }
    function calcOrientation() {
        var _a, _b;
        var tickOrientation = axisD.tickOrientation;
        var axisElement = (_b = (_a = axisD.tickOrientation) === null || _a === void 0 ? void 0 : _a.boundElement) !== null && _b !== void 0 ? _b : selection.select('.domain').node();
        if (!tickOrientation || !axisElement)
            return undefined;
        // console.log(axisElement, tickOrientation)
        var angle = calcTickAngle(axisElement, tickOrientation);
        var boundIndex = findMatchingBoundsIndex(axisElement, tickOrientation.bounds);
        var orientationIndex = boundIndex >= 0 ? boundIndex : tickOrientation.orientation.length - 1;
        return {
            angle: angle,
            boundIndex: boundIndex,
            orientationIndex: orientationIndex
        };
    }
}
function d3Axis(axisGenerator, data) {
    var axis = axisGenerator(data.scale);
    data.configureAxis(axis);
    return axis;
}

function chartBaseRender(selection) {
    selection
        .classed('chart', true)
        .attr('xmlns', 'http://www.w3.org/2000/svg');
    selection
        .selectAll('.draw-area')
        .data([null])
        .join('svg')
        .classed('draw-area', true)
        .selectAll('.background')
        .data([null])
        .join('rect')
        .classed('background', true);
    var header = selection
        .selectAll('.header')
        .data(function (d) { return [d]; })
        .join('g')
        .classed('header', true);
    header
        .selectAll('.title')
        .data(function (d) { return [d.title ? d.title : ""]; })
        .join('g')
        .classed('title', true)
        .attr('data-ignore-layout-children', true)
        .selectAll('text')
        .data(function (d) { return [d]; })
        .join('text')
        .text(function (d) { return d; });
    header
        .selectAll('.subtitle')
        .data(function (d) { return [d.subtitle ? d.subtitle : ""]; })
        .join('g')
        .classed('subtitle', true)
        .attr('data-ignore-layout-children', true)
        .selectAll('text')
        .data(function (d) { return [d]; })
        .join('text')
        .text(function (d) { return d; });
    return selection;
}

function menuDropdownRender(selection) {
    selection.classed('menu', true);
    // chevron & text
    selection.selectChildren('.chevron').data([null]).join('span').text('❮').classed('chevron', true);
    selection.selectChildren('.text').data([null]).join('span').classed('text', true);
    // items
    selection.selectChildren('.items').data([null]).join('ul').classed('items', true);
}

function windowChartBaseRender(selection) {
    selection.classed('chart-window', true);
    selection
        .selectAll('.toolbar')
        .data([null])
        .join('div')
        .call(function (s) { return toolbarRender(s); });
    selection
        .selectAll('.layouter')
        .data([null])
        .join('div')
        .call(function (s) { return layouterRender(s); });
    resizeEventListener(selection);
}
function toolbarRender(selection) {
    selection.classed('toolbar', true);
    selection
        .selectAll('.menu-tools')
        .data([null])
        .join('div')
        .call(function (s) { return menuToolsRender(s); });
}
function menuToolsRender(selection) {
    selection.call(function (s) { return menuDropdownRender(s); }).classed('menu-tools', true);
    selection.selectChildren('.chevron').remove();
    selection.selectChildren('.text').text('☰');
}

function chartCartesianData(data) {
    return {
        title: data.title || '',
        subtitle: data.subtitle || '',
        xAxis: axisData(data.xAxis || {}),
        yAxis: axisData(data.yAxis || {}),
        flipped: data.flipped || false
    };
}
function chartCartesianAxisRender(selection) {
    selection
        .classed('chart-cartesian', true)
        .each(function (_a, i, g) {
        var flipped = _a.flipped, xAxis = _a.xAxis, yAxis = _a.yAxis;
        var s = select(g[i]);
        var flippedBool = flipped ? flipped : false;
        s.selectAll('.axis-left')
            .data([flipped ? xAxis : yAxis])
            .join('g')
            .call(function (s) { return axisLeftRender(s); })
            .classed('axis-x', flippedBool)
            .classed('axis-y', !flipped);
        s.selectAll('.axis-bottom')
            .data([flipped ? yAxis : xAxis])
            .join('g')
            .call(function (s) { return axisBottomRender(s); })
            .classed('axis-x', !flipped)
            .classed('axis-y', flippedBool);
    })
        .attr('data-flipped', function (d) { return d.flipped ? d.flipped : false; });
}
var LegendPosition;
(function (LegendPosition) {
    LegendPosition["Top"] = "top";
    LegendPosition["Right"] = "right";
    LegendPosition["Bottom"] = "bottom";
    LegendPosition["Left"] = "left";
})(LegendPosition || (LegendPosition = {}));
function chartLegendPosition(chartSelection, position) {
    chartSelection.attr('data-legend-position', position);
}

var Orientation;
(function (Orientation) {
    Orientation["Horizontal"] = "horizontal";
    Orientation["Vertical"] = "vertical";
})(Orientation || (Orientation = {}));
var VerticalAlignment;
(function (VerticalAlignment) {
    VerticalAlignment["Top"] = "top";
    VerticalAlignment["Center"] = "center";
    VerticalAlignment["Bottom"] = "bottom";
})(VerticalAlignment || (VerticalAlignment = {}));
var HorizontalAlignment;
(function (HorizontalAlignment) {
    HorizontalAlignment["Left"] = "left";
    HorizontalAlignment["Center"] = "center";
    HorizontalAlignment["Right"] = "right";
})(HorizontalAlignment || (HorizontalAlignment = {}));
function textAlignVertical(selection, align) {
    selection.attr('data-align-v', align);
}
function textAlignHorizontal(selection, align) {
    selection.attr('data-align-h', align);
}
function textOrientation(selection, orientation) {
    selection.attr('data-orientation', orientation);
}

function seriesCheckboxData(data) {
    var labels = data.labels || [];
    return {
        container: data.container || 'div',
        labels: labels,
        keys: data.keys || labels
    };
}
function seriesCheckboxCreateCheckboxes(seriesData) {
    var labels = seriesData.labels, container = seriesData.container, keys = seriesData.keys;
    return labels.map(function (l, i) {
        return {
            container: container,
            label: l,
            key: keys[i]
        };
    });
}
function seriesCheckboxRender(selection) {
    selection
        .classed('series-checkbox', true)
        .on('click.seriescheckbox', function (e) { return e.target.classList.contains('checkbox') && e.target.querySelector('input').click(); })
        .each(function (d, i, g) {
        var seriesS = select(g[i]);
        seriesS
            .selectAll('.checkbox')
            .data(seriesCheckboxCreateCheckboxes(d), function (d) { return d.label; })
            .call(function (s) { return seriesCheckboxJoin(seriesS, s); });
    });
}
function seriesCheckboxJoin(seriesSelection, joinSelection) {
    joinSelection
        .join(function (enter) {
        return enter
            .append(function (d, i, g) {
            return d.container instanceof Function
                ? d.container.call(g[i], d, i, g)
                : create$1(d.container).node();
        })
            .classed('checkbox', true)
            .each(function (d, i, g) {
            var s = select(g[i]), id = v4();
            s.append('input').attr('type', 'checkbox').attr('id', id).attr('checked', true);
            s.append('label').attr('for', id);
        })
            .call(function (s) { return seriesSelection.dispatch('enter', { detail: { selection: s } }); });
    }, undefined, function (exit) {
        return exit.remove().call(function (s) { return seriesSelection.dispatch('exit', { detail: { selection: s } }); });
    })
        .each(function (d, i, g) {
        var s = select(g[i]).attr('data-key', d.key);
        s.selectChildren('label').text(d.label);
    })
        .call(function (s) { return seriesSelection.dispatch('update', { detail: { selection: s } }); });
}

// TODO: maybe SVGO could be used to optimize the downloaded SVG? https://github.com/svg/svgo
function toolDownloadSVGRender(selection) {
    selection
        .classed('tool-download-svg', true)
        .text('Download SVG')
        .on('click', function () {
        select(this.closest('.chart-window'))
            .selectAll('.layouter > svg.chart')
            .call(function (s) { return chartDownload(s, 'chart.svg'); });
    });
}
function chartDownload(chartSelection, fileName) {
    chartSelection.each(function (d, i, g) {
        var clonedChart = g[i].cloneNode(true);
        var width = clonedChart.getAttribute('width');
        var height = clonedChart.getAttribute('height');
        clonedChart.setAttribute('viewBox', "0, 0, ".concat(width, ", ").concat(height));
        clonedChart.removeAttribute('width');
        clonedChart.removeAttribute('height');
        clonedChart.removeAttribute('x');
        clonedChart.removeAttribute('y');
        attrsFromComputedStyle(clonedChart, g[i]);
        var cloneContainer = document.createElement('div');
        cloneContainer.append(clonedChart);
        var cloneHTML = cloneContainer.innerHTML.replace(/ (style|layout|bounds|data-ignore-layout|data-ignore-layout-children)=".*?"/g, '');
        var blobType = 'image/svg+xml;charset=utf-8';
        var blob = new Blob([cloneHTML], { type: blobType });
        var url = URL.createObjectURL(blob);
        var anchor = document.createElement('a');
        fileName = fileName instanceof Function ? fileName.call(g[i], d, i, g) : fileName;
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    });
}
function attrsFromComputedStyle(target, source) {
    var style = elementComputedStyleWithoutDefaults(source, elementSVGPresentationAttrs);
    for (var prop in style) {
        target.setAttribute(prop, style[prop]);
    }
    for (var i = 0; i < source.children.length; ++i) {
        attrsFromComputedStyle(target.children[i], source.children[i]);
    }
}

function toolFilterNominalData(data) {
    var options = data.options || [];
    return {
        text: data.text || 'Filter',
        options: options,
        keys: data.keys || options
    };
}
function toolFilterNominalRender(selection) {
    selection.classed('tool-filter-nominal', true).call(function (s) { return menuDropdownRender(s); });
    selection.each(function (d, i, g) {
        var s = select(g[i]);
        s.selectAll('.text').text(d.text);
        s.selectAll('.items')
            .datum(seriesCheckboxData({
            container: function () { return create$1('li').node(); },
            labels: d.options,
            keys: d.keys
        }))
            .call(function (s) { return seriesCheckboxRender(s); });
    });
}

function tooltip(selection) {
    selection.classed('tooltip', true);
}
function tooltipSelectOrCreate() {
    var tooltipSelection = select('.tooltip');
    return tooltipSelection.size() > 0
        ? tooltipSelection
        : select(document.body)
            .append('div')
            .call(function (s) { return tooltip(s); });
}
function tooltipShow(tooltipSelection) {
    tooltipSelection = tooltipSelection || tooltipSelectOrCreate();
    tooltipSelection.classed('show', true);
}
function tooltipHide(tooltipSelection) {
    tooltipSelection = tooltipSelection || tooltipSelectOrCreate();
    tooltipSelection.classed('show', false);
}
function tooltipContent(tooltipSelection, content) {
    tooltipSelection = tooltipSelection || tooltipSelectOrCreate();
    tooltipSelection.html(content);
}
function tooltipPosition(tooltipSelection, config) {
    var position = config.position, offset = config.offset, offsetDirection = config.offsetDirection;
    tooltipSelection = tooltipSelection || tooltipSelectOrCreate();
    offset = offset || 8;
    var windowSize = { width: window.innerWidth, height: window.innerHeight };
    offsetDirection = config.offsetDirection || {
        x: position.x <= windowSize.width / 2 ? 1 : -1,
        y: position.y <= windowSize.height / 2 ? 1 : -1
    };
    var left = offsetDirection.x >= 0;
    var top = offsetDirection.y >= 0;
    var leftOffset = position.x + offsetDirection.x * offset;
    var rightOffset = windowSize.width - leftOffset;
    var topOffset = position.y + offsetDirection.y * offset;
    var bottomOffset = windowSize.height - topOffset;
    tooltipSelection
        .style(left ? 'right' : 'left', null)
        .style(left ? 'left' : 'right', "".concat(left ? leftOffset : rightOffset, "px"))
        .style(top ? 'bottom' : 'top', null)
        .style(top ? 'top' : 'bottom', "".concat(top ? topOffset : bottomOffset, "px"));
}

function seriesConfigTooltipsData(data) {
    var _a;
    return {
        tooltipsEnabled: (_a = data.tooltipsEnabled) !== null && _a !== void 0 ? _a : true,
        tooltips: data.tooltips || (function (data) { return 'Tooltip'; }),
        tooltipPosition: data.tooltipPosition || (function (item, data, mousePosition) { return ({ position: mousePosition }); })
    };
}
function seriesConfigTooltipsHandleEvents(seriesSelection, seriesItemFinder) {
    seriesSelection
        .on('pointerover.tooltip', function (e, d) {
        var tooltips = d.tooltips, tooltipsEnabled = d.tooltipsEnabled;
        var item = seriesItemFinder ? seriesItemFinder(e.target) : e.target;
        if (!tooltipsEnabled || !item)
            return;
        var data = select(item).datum();
        tooltipShow(null);
        tooltipContent(null, tooltips(item, data));
    })
        .on('pointermove.tooltip', function (e, d) {
        var tooltipsEnabled = d.tooltipsEnabled, position = d.tooltipPosition;
        var item = seriesItemFinder ? seriesItemFinder(e.target) : e.target;
        if (!tooltipsEnabled || !item)
            return;
        var data = select(item).datum();
        tooltipPosition(null, position(item, data, { x: e.clientX, y: e.clientY }));
    })
        .on('pointerout.tooltip', function (e, d) {
        var tooltipsEnabled = d.tooltipsEnabled;
        if (tooltipsEnabled)
            tooltipHide(null);
    });
}

var parseUnit = function parseUnit(str, out) {
    if (!out)
        out = [ 0, '' ];

    str = String(str);
    var num = parseFloat(str, 10);
    out[0] = num;
    out[1] = str.match(/[\d.\-\+]*\s*(.*)/)[1] || '';
    return out
};

var browser = toPX;

var PIXELS_PER_INCH = getSizeBrutal('in', document.body); // 96


function getPropertyInPX(element, prop) {
  var parts = parseUnit(getComputedStyle(element).getPropertyValue(prop));
  return parts[0] * toPX(parts[1], element)
}

//This brutal hack is needed
function getSizeBrutal(unit, element) {
  var testDIV = document.createElement('div');
  testDIV.style['height'] = '128' + unit;
  element.appendChild(testDIV);
  var size = getPropertyInPX(testDIV, 'height') / 128;
  element.removeChild(testDIV);
  return size
}

function toPX(str, element) {
  if (!str) return null

  element = element || document.body;
  str = (str + '' || 'px').trim().toLowerCase();
  if(element === window || element === document) {
    element = document.body;
  }

  switch(str) {
    case '%':  //Ambiguous, not sure if we should use width or height
      return element.clientHeight / 100.0
    case 'ch':
    case 'ex':
      return getSizeBrutal(str, element)
    case 'em':
      return getPropertyInPX(element, 'font-size')
    case 'rem':
      return getPropertyInPX(document.body, 'font-size')
    case 'vw':
      return window.innerWidth/100
    case 'vh':
      return window.innerHeight/100
    case 'vmin':
      return Math.min(window.innerWidth, window.innerHeight) / 100
    case 'vmax':
      return Math.max(window.innerWidth, window.innerHeight) / 100
    case 'in':
      return PIXELS_PER_INCH
    case 'cm':
      return PIXELS_PER_INCH / 2.54
    case 'mm':
      return PIXELS_PER_INCH / 25.4
    case 'pt':
      return PIXELS_PER_INCH / 72
    case 'pc':
      return PIXELS_PER_INCH / 6
    case 'px':
      return 1
  }

  // detect number of units
  var parts = parseUnit(str);
  if (!isNaN(parts[0]) && parts[1]) {
    var px = toPX(parts[1], element);
    return typeof px === 'number' ? parts[0] * px : null
  }

  return null
}

function seriesBarData(data) {
    var categories = data.categories || [];
    return __assign(__assign({ bounds: data.bounds || { width: 600, height: 400 }, categories: categories, styleClasses: data.styleClasses || 'categorical-0', categoryScale: data.categoryScale || band().domain(categories).padding(0.1), values: data.values || [], valueScale: data.valueScale ||
            linear()
                .domain([0, Math.max.apply(Math, __spreadArray([], __read((data.values || [])), false))])
                .nice(), flipped: data.flipped || false, keys: data.keys || categories }, seriesConfigTooltipsData(data)), { tooltipsEnabled: data.tooltipsEnabled || true, tooltips: data.tooltips || (function (element, data) { return "Category: ".concat(data.category, "<br/>Value: ").concat(data.value); }) });
}
function seriesBarCreateBars(seriesData) {
    var categories = seriesData.categories, categoryScale = seriesData.categoryScale, values = seriesData.values, valueScale = seriesData.valueScale, keys = seriesData.keys, styleClasses = seriesData.styleClasses, flipped = seriesData.flipped, bounds = seriesData.bounds;
    if (!flipped) {
        categoryScale.range([0, bounds.width]);
        valueScale.range([bounds.height, 0]);
    }
    else {
        categoryScale.range([0, bounds.height]);
        valueScale.range([0, bounds.width]);
    }
    var data = [];
    for (var i = 0; i < values.length; ++i) {
        var c = categories[i], v = values[i], rect = {
            x: categoryScale(c),
            y: Math.min(valueScale(0), valueScale(v)),
            width: categoryScale.bandwidth(),
            height: Math.abs(valueScale(0) - valueScale(v))
        }, flippedRect = {
            x: Math.min(valueScale(0), valueScale(v)),
            y: categoryScale(c),
            width: Math.abs(valueScale(0) - valueScale(v)),
            height: categoryScale.bandwidth()
        }, bar = __assign({ category: c, value: v, key: keys[i], styleClass: arrayIs(styleClasses) ? styleClasses[i] : styleClasses }, (flipped ? flippedRect : rect));
        data.push(bar);
    }
    return data;
}
function seriesBarRender(selection) {
    selection
        .classed('series-bar', true)
        .attr('data-ignore-layout-children', true)
        .each(function (d, i, g) {
        var seriesS = select(g[i]);
        var boundsAttr = seriesS.attr('bounds');
        if (!boundsAttr)
            return;
        d.bounds = rectFromString(boundsAttr);
        seriesS
            .selectAll('rect')
            .data(seriesBarCreateBars(d), function (d) { return d.key; })
            .call(function (s) { return seriesBarJoin(seriesS, s); });
    })
        .on('pointerover.seriesbarhighlight pointerout.seriesbarhighlight', function (e) {
        return e.target.classList.toggle('highlight', e.type.endsWith('over'));
    })
        .call(function (s) { return seriesConfigTooltipsHandleEvents(s); });
}
function seriesBarJoin(seriesSelection, joinSelection) {
    joinSelection
        .join(function (enter) {
        return enter
            .append('rect')
            .classed('bar', true)
            .each(function (d, i, g) { return rectToAttrs(select(g[i]), rectMinimized(d)); })
            .call(function (s) { return seriesSelection.dispatch('enter', { detail: { selection: s } }); });
    }, undefined, function (exit) {
        return exit
            .classed('exiting', true)
            .each(function (d, i, g) {
            return select(g[i])
                .transition('minimize')
                .duration(250)
                .call(function (t) { return rectToAttrs(t, rectMinimized(d)); })
                .remove();
        })
            .call(function (s) { return seriesSelection.dispatch('exit', { detail: { selection: s } }); });
    })
        .each(function (d, i, g) {
        return select(g[i])
            .transition('position')
            .duration(250)
            .ease(cubicOut)
            .call(function (t) { return rectToAttrs(t, rectFitStroke(d, browser(select(g[i]).style('stroke-width')))); });
    })
        .attr('data-style', function (d) { return d.styleClass; })
        .attr('data-category', function (d) { return d.category; })
        .attr('data-key', function (d) { return d.key; })
        .call(function (s) { return seriesSelection.dispatch('update', { detail: { selection: s } }); });
}

function seriesBarGroupedData(data) {
    var _a;
    var categories = data.categories || [];
    var subcategories = data.subcategories || [];
    return __assign(__assign({ categories: categories, categoryScale: data.categoryScale ||
            band()
                .domain(data.categories || [])
                .padding(0.1), values: data.values || [], valueScale: data.valueScale ||
            linear()
                .domain([0, Math.max.apply(Math, __spreadArray([], __read((((_a = data.values) === null || _a === void 0 ? void 0 : _a.map(function (values) { return Math.max.apply(Math, __spreadArray([], __read(values), false)); })) || [])), false))])
                .nice(), subcategories: subcategories, flipped: data.flipped || false, subcategoryPadding: data.subcategoryPadding || 0.1, styleClasses: data.styleClasses || subcategories.map(function (c, i) { return "categorical-".concat(i); }), keys: data.keys || categories.map(function (c) { return subcategories.map(function (sc) { return "".concat(c, "/").concat(sc); }); }), bounds: data.bounds || { width: 600, height: 400 } }, seriesConfigTooltipsData(data)), { tooltipsEnabled: data.tooltipsEnabled || true, tooltips: data.tooltips ||
            (function (element, data) {
                return "Category: ".concat(data.category, "<br/>Subcategory: ").concat(data.subcategory, "<br/>Value: ").concat(data.value);
            }) });
}
function seriesBarGroupedCreateBars(seriesData) {
    var _a;
    var categories = seriesData.categories, categoryScale = seriesData.categoryScale, values = seriesData.values, valueScale = seriesData.valueScale, subcategories = seriesData.subcategories, flipped = seriesData.flipped, subcategoryPadding = seriesData.subcategoryPadding, styleClasses = seriesData.styleClasses, keys = seriesData.keys, bounds = seriesData.bounds;
    if (!flipped) {
        categoryScale.range([0, bounds.width]);
        valueScale.range([bounds.height, 0]);
    }
    else {
        categoryScale.range([0, bounds.height]);
        valueScale.range([0, bounds.width]);
    }
    var innerScale = band()
        .domain(range(((_a = values[0]) === null || _a === void 0 ? void 0 : _a.length) || 0))
        .range([0, categoryScale.bandwidth()])
        .padding(subcategoryPadding);
    var data = [];
    for (var i = 0; i < values.length; ++i) {
        var subcategoryValues = values[i];
        for (var j = 0; j < subcategoryValues.length; ++j) {
            var c = categories[i], v = subcategoryValues[j], rect = {
                x: categoryScale(c) + innerScale(j),
                y: Math.min(valueScale(0), valueScale(v)),
                width: innerScale.bandwidth(),
                height: Math.abs(valueScale(0) - valueScale(v))
            }, flippedRect = {
                x: Math.min(valueScale(0), valueScale(v)),
                y: categoryScale(c) + innerScale(j),
                width: Math.abs(valueScale(0) - valueScale(v)),
                height: innerScale.bandwidth()
            }, bar = __assign({ category: c, subcategory: subcategories[j], value: v, styleClass: arrayIs2D(styleClasses)
                    ? styleClasses[i][j]
                    : arrayIs(styleClasses)
                        ? styleClasses[j]
                        : styleClasses, key: keys[i][j] }, (flipped ? flippedRect : rect));
            data.push(bar);
        }
    }
    return data;
}
function seriesBarGroupedRender(selection) {
    selection
        .classed('series-bar', true)
        .classed('series-bar-grouped', true)
        .attr('data-ignore-layout-children', true)
        .on('update.subcategory', function (e) {
        return e.detail.selection.attr('data-subcategory', function (d) { return d.subcategory; });
    })
        .each(function (d, i, g) {
        var seriesS = select(g[i]);
        var boundsAttr = seriesS.attr('bounds');
        if (!boundsAttr)
            return;
        d.bounds = rectFromString(boundsAttr);
        seriesS
            .selectAll('rect')
            .data(seriesBarGroupedCreateBars(d), function (d) { return d.key; })
            .call(function (s) { return seriesBarJoin(seriesS, s); });
    })
        .on('pointerover.seriesbargroupedhighlight pointerout.seriesbargroupedhighlight', function (e) {
        return e.target.classList.toggle('highlight', e.type.endsWith('over'));
    })
        .call(function (s) { return seriesConfigTooltipsHandleEvents(s); });
}

function seriesBarStackedData(data) {
    var _a;
    var categories = data.categories || [];
    var subcategories = data.subcategories || [];
    return __assign(__assign({ categories: categories, categoryScale: data.categoryScale ||
            band()
                .domain(data.categories || [])
                .padding(0.1), values: data.values || [], valueScale: data.valueScale ||
            linear()
                .domain([
                0,
                Math.max.apply(Math, __spreadArray([], __read((((_a = data.values) === null || _a === void 0 ? void 0 : _a.map(function (values) { return values.reduce(function (a, b) { return a + b; }); })) || [])), false)),
            ])
                .nice(), subcategories: subcategories, styleClasses: data.styleClasses || subcategories.map(function (c, i) { return "categorical-".concat(i); }), flipped: data.flipped || false, keys: data.keys, bounds: data.bounds || { width: 600, height: 400 } }, seriesConfigTooltipsData(data)), { tooltipsEnabled: data.tooltipsEnabled || true, tooltips: data.tooltips ||
            (function (element, data) {
                return "Category: ".concat(data.category, "<br/>Subcategory: ").concat(data.subcategory, "<br/>Value: ").concat(data.value);
            }) });
}
function seriesBarStackedCreateBars(seriesData) {
    var categories = seriesData.categories, categoryScale = seriesData.categoryScale, values = seriesData.values, valueScale = seriesData.valueScale, subcategories = seriesData.subcategories, flipped = seriesData.flipped, styleClasses = seriesData.styleClasses, keys = seriesData.keys, bounds = seriesData.bounds;
    if (!flipped) {
        categoryScale.range([0, bounds.width]);
        valueScale.range([bounds.height, 0]);
    }
    else {
        categoryScale.range([0, bounds.height]);
        valueScale.range([0, bounds.width]);
    }
    var data = [];
    for (var i = 0; i < categories.length; ++i) {
        var subcategoryValues = values[i];
        var nextStart = valueScale(0);
        for (var j = 0; j < subcategoryValues.length; ++j) {
            var c = categories[i], sc = subcategories[j], v = subcategoryValues[j], unflippedRect = {
                x: categoryScale(c),
                y: nextStart - Math.abs(valueScale(0) - valueScale(v)),
                width: categoryScale.bandwidth(),
                height: Math.abs(valueScale(0) - valueScale(v))
            }, flippedRect = {
                x: nextStart,
                y: categoryScale(c),
                width: Math.abs(valueScale(0) - valueScale(v)),
                height: categoryScale.bandwidth()
            }, rect = flipped ? flippedRect : unflippedRect, bar = __assign({ category: c, subcategory: sc, value: v, key: (keys === null || keys === void 0 ? void 0 : keys[i][j]) || "".concat(c, "/").concat(sc), styleClass: arrayIs2D(styleClasses)
                    ? styleClasses[i][j]
                    : arrayIs(styleClasses)
                        ? styleClasses[j]
                        : styleClasses }, rect);
            nextStart = flipped ? rect.x + rect.width /* - sw*/ : rect.y /* + sw*/;
            data.push(bar);
        }
    }
    return data;
}
function seriesBarStackedRender(selection) {
    selection
        .classed('series-bar', true)
        .classed('series-bar-stacked', true)
        .attr('data-ignore-layout-children', true)
        .on('update.subcategory', function (e) {
        return e.detail.selection.attr('data-subcategory', function (d) { return d.subcategory; });
    })
        .each(function (d, i, g) {
        var seriesS = select(g[i]);
        var boundsAttr = seriesS.attr('bounds');
        if (!boundsAttr)
            return;
        d.bounds = rectFromString(boundsAttr);
        seriesS
            .selectAll('rect')
            .data(seriesBarStackedCreateBars(d), function (d) { return d.key; })
            .call(function (s) { return seriesBarJoin(seriesS, s); });
    })
        .on('pointerover.seriesbargroupedhighlight pointerout.seriesbargroupedhighlight', function (e) {
        return e.target.classList.toggle('highlight', e.type.endsWith('over'));
    })
        .call(function (s) { return seriesConfigTooltipsHandleEvents(s); });
}

function seriesLabelData(data) {
    return {
        texts: data.texts || [],
        positions: data.positions || [],
        keys: data.keys
    };
}
function seriesLabelCreateLabels(seriesData) {
    var texts = seriesData.texts, keys = seriesData.keys, positions = seriesData.positions;
    return texts.map(function (text, i) { return (__assign({ text: text, key: (keys === null || keys === void 0 ? void 0 : keys[i]) || text }, positions[i])); });
}
function seriesLabelRender(selection) {
    selection.classed('series-label', true).attr('data-ignore-layout-children', true);
    selection.each(function (d, i, g) {
        var seriesS = select(g[i]);
        seriesS
            .selectAll('text')
            .data(seriesLabelCreateLabels(d), function (d) { return d.key; })
            .call(function (s) { return seriesLabelJoin(seriesS, s); });
    });
}
function seriesLabelJoin(seriesSelection, joinSelection) {
    joinSelection
        .join(function (enter) {
        return enter
            .append('text')
            .classed('label', true)
            .each(function (d, i, g) { return positionToTransformAttr(select(g[i]), d); })
            .attr('font-size', '0em')
            .attr('opacity', 0)
            .call(function (s) {
            return s.transition('enter').duration(250).attr('font-size', '1em').attr('opacity', 1);
        })
            .call(function (s) { return seriesSelection.dispatch('enter', { detail: { selection: s } }); });
    }, undefined, function (exit) {
        return exit
            .classed('exiting', true)
            .call(function (s) {
            return s.transition('exit').duration(250).attr('font-size', '0em').attr('opacity', 0).remove();
        })
            .call(function (s) { return seriesSelection.dispatch('exit', { detail: { selection: s } }); });
    })
        .each(function (d, i, g) {
        return select(g[i])
            .transition('position')
            .duration(250)
            .ease(cubicOut)
            .call(function (t) { return positionToTransformAttr(t, d); });
    })
        .text(function (d) { return d.text; })
        .attr('data-key', function (d) { return d.key; })
        .call(function (s) { return seriesSelection.dispatch('update', { detail: { selection: s } }); });
}

function seriesLabelBarData(data) {
    return {
        barContainer: data.barContainer || select('.chart'),
        labels: data.labels || (function (bar) { return bar.value.toString(); }),
        relativePositions: data.relativePositions || { x: 0.5, y: 0.5 },
        offsets: data.offsets || 3
    };
}
function seriesLabelBarCreateLabels(seriesData) {
    var barContainer = seriesData.barContainer, labels = seriesData.labels, relativePositions = seriesData.relativePositions, offsets = seriesData.offsets;
    return barContainer
        .selectAll('.bar:not(.exiting)')
        .nodes()
        .map(function (barNode, i) {
        var barS = select(barNode);
        var barD = barS.datum();
        var relativePosition = relativePositions instanceof Function
            ? relativePositions(barD)
            : arrayIs(relativePositions)
                ? relativePositions[i]
                : relativePositions;
        var offset = typeof offsets === 'number'
            ? {
                x: (relativePosition.x < 0.5 ? -1 : relativePosition.x === 0.5 ? 0 : 1) * offsets,
                y: (relativePosition.y < 0.5 ? -1 : relativePosition.y === 0.5 ? 0 : 1) * offsets
            }
            : offsets instanceof Function
                ? offsets(barD)
                : arrayIs(offsets)
                    ? offsets[i]
                    : offsets;
        var position = rectPosition(barD, relativePosition);
        return {
            x: position.x + offset.x,
            y: position.y + offset.y,
            relativePosition: relativePosition,
            offset: offset,
            text: labels instanceof Function ? labels(barD) : labels[i],
            bar: barS,
            key: barD.key
        };
    });
}
function seriesLabelBar(selection) {
    selection
        .classed('series-label', true)
        .classed('series-label-bar', true)
        .attr('data-ignore-layout-children', true)
        .each(function (d, i, g) {
        var seriesS = select(g[i]);
        seriesS
            .on('update.serieslabelbar', function (e) {
            e.detail.selection.each(function (d, i, g) {
                var s = select(g[i]);
                var relPos = d.relativePosition;
                var HA = HorizontalAlignment;
                var VA = VerticalAlignment;
                var hPos = relPos.x < 0.5 ? HA.Left : relPos.x === 0.5 ? HA.Center : HA.Right;
                var vPos = relPos.y < 0.5 ? VA.Top : relPos.y === 0.5 ? VA.Center : VA.Bottom;
                textAlignHorizontal(s, hPos);
                textAlignVertical(s, vPos);
            });
        })
            .selectAll('text')
            .data(seriesLabelBarCreateLabels(d), function (d) { return d.key; })
            .call(function (s) { return seriesLabelJoin(seriesS, s); });
    });
}

function chartBarData(data) {
    var _a;
    return __assign(__assign(__assign({}, seriesBarData(data)), chartCartesianData(data)), { labelsEnabled: (_a = data.labelsEnabled) !== null && _a !== void 0 ? _a : true, labels: data.labels || {} });
}
function chartBarRender(selection) {
    selection
        .call(function (s) { return chartBaseRender(s); })
        .classed('chart-bar', true)
        .each(function (chartD, i, g) {
        var chartS = select(g[i]);
        var drawAreaS = chartS.selectAll('.draw-area');
        var barSeriesS = drawAreaS
            .selectAll('.series-bar')
            .data([chartD])
            .join('g')
            .call(function (s) { return seriesBarRender(s); })
            .on('pointerover.chartbarhighlight', function (e) { return chartBarHoverBar(chartS, select(e.target), true); })
            .on('pointerout.chartbarhighlight', function (e) { return chartBarHoverBar(chartS, select(e.target), false); });
        drawAreaS
            .selectAll('.series-label-bar')
            .data(chartD.labelsEnabled
            ? [
                seriesLabelBarData(__assign({ barContainer: barSeriesS }, chartD.labels)),
            ]
            : [])
            .join('g')
            .call(function (s) { return seriesLabelBar(s); });
        chartD.xAxis.scale = chartD.categoryScale;
        chartD.yAxis.scale = chartD.valueScale;
        chartCartesianAxisRender(chartS);
    });
}
function chartBarHoverBar(chart, bar, hover) {
    bar.each(function (barD) {
        chart.selectAll(".label[data-key=\"".concat(barD.key, "\"]")).classed('highlight', hover);
        chart.selectAll(".axis-x .tick[data-key=\"".concat(barD.category, "\"]")).classed('highlight', hover);
    });
}

var LegendOrientation;
(function (LegendOrientation) {
    LegendOrientation["Vertical"] = "vertical";
    LegendOrientation["Horizontal"] = "horizontal";
})(LegendOrientation || (LegendOrientation = {}));
function legendData(data) {
    var labels = data.labels || [];
    return {
        title: data.title || '',
        labels: labels,
        reverse: data.reverse,
        styleClasses: data.styleClasses || labels.map(function (l, i) { return "categorical-".concat(i); }),
        symbols: data.symbols || (function (e, s) { return pathRect(e, rectFromSize(s)); }),
        keys: data.keys
    };
}
function legendCreateItems(legendData) {
    var labels = legendData.labels, styleClasses = legendData.styleClasses, symbols = legendData.symbols, keys = legendData.keys, reverse = legendData.reverse;
    var items = labels.map(function (l, i) {
        return {
            label: l,
            styleClass: arrayIs(styleClasses) ? styleClasses[i] : styleClasses,
            symbol: arrayIs(symbols) ? symbols[i] : symbols,
            key: keys === undefined ? l : keys[i]
        };
    });
    return reverse ? items.reverse() : items;
}
function legendRender(selection) {
    selection.classed('legend', true).each(function (legendD, i, g) {
        var legendS = select(g[i]);
        legendS
            .selectAll('.title')
            .data([null])
            .join('text')
            .classed('title', true)
            .text(legendD.title);
        var itemS = legendS.selectAll('.items').data([null]).join('g').classed('items', true);
        itemS
            .selectAll('.legend-item')
            .data(legendCreateItems(legendD), function (d) { return d.label; })
            .join(function (enter) {
            return enter
                .append('g')
                .classed('legend-item', true)
                .call(function (itemS) { return itemS.append('path').classed('symbol', true); })
                .call(function (itemS) { return itemS.append('text').classed('label', true); })
                .call(function (s) { return legendS.dispatch('enter', { detail: { selection: s } }); });
        }, undefined, function (exit) { return exit.remove().call(function (s) { return legendS.dispatch('exit', { detail: { selection: s } }); }); })
            .each(function (itemD, i, g) {
            var itemS = select(g[i]);
            itemS.selectAll('.label').text(itemD.label);
            itemS.selectAll('.symbol').call(function (symbolS) {
                var boundsAttr = symbolS.attr('bounds');
                if (!boundsAttr)
                    return;
                itemD.symbol(symbolS.node(), rectFromString(boundsAttr));
            });
        })
            .attr('data-style', function (d) { return d.styleClass; })
            .attr('data-key', function (d) { return d.key; })
            .call(function (s) { return legendS.dispatch('update', { detail: { selection: s } }); });
    });
    selection.on('pointerover.legend pointerout.legend', function (e) {
        var item = e.target.closest('.legend-item');
        if (item) {
            item.classList.toggle('highlight', e.type.endsWith('over'));
        }
    });
}

function chartBarStackedData(data) {
    var _a;
    var seriesData = seriesBarStackedData(data);
    return __assign(__assign(__assign({}, seriesData), chartCartesianData(data)), { styleClasses: data.styleClasses || seriesData.subcategories.map(function (c, i) { return "categorical-".concat(i); }), legend: data.legend || {}, labelsEnabled: (_a = data.labelsEnabled) !== null && _a !== void 0 ? _a : true, labels: __assign({ labels: function (bar) { return (bar.height > 10 && bar.width > 7 ? Math.round(bar.value).toString() : ''); } }, data.labels) });
}
function chartBarStackedRender(selection) {
    selection
        .call(function (s) { return chartBaseRender(s); })
        .classed('chart-bar-stacked', true)
        .each(function (chartD, i, g) {
        var subcategories = chartD.subcategories, styleClasses = chartD.styleClasses, xAxis = chartD.xAxis, yAxis = chartD.yAxis, categoryScale = chartD.categoryScale, valueScale = chartD.valueScale, labelsEnabled = chartD.labelsEnabled, legendD = chartD.legend, labelsD = chartD.labels;
        var chartS = select(g[i]);
        var drawAreaS = chartS.selectAll('.draw-area');
        var barSeriesS = drawAreaS
            .selectAll('.series-bar-stacked')
            .data([chartD])
            .join('g')
            .call(function (s) { return seriesBarStackedRender(s); })
            .on('pointerover.chartbarstackedhighlight pointerout.chartbarstackedhighlight', function (e) {
            return chartBarStackedHoverBar(chartS, select(e.target), e.type.endsWith('over'));
        });
        drawAreaS
            .selectAll('.series-label-bar')
            .data(labelsEnabled
            ? [
                seriesLabelBarData(__assign({ barContainer: barSeriesS }, labelsD)),
            ]
            : [])
            .join('g')
            .call(function (s) { return seriesLabelBar(s); });
        chartS
            .selectAll('.legend')
            .data([
            legendData(__assign(__assign({ labels: subcategories, styleClasses: styleClasses }, legendD), { keys: subcategories })),
        ])
            .join('g')
            .call(function (s) { return legendRender(s); })
            .on('pointerover.chartbarstackedhighlight pointerout.chartbarstackedhighlight', function (e) {
            chartBarStackedHoverLegendItem(chartS, select(e.target.closest('.legend-item')), e.type.endsWith('over'));
        });
        xAxis.scale = categoryScale;
        yAxis.scale = valueScale;
        chartCartesianAxisRender(chartS);
        chartS
            .selectAll(".axis-x .tick")
            .on('pointerover.chartbarstackedhighlight pointerout.chartbarstackedhighlight', function (e) {
            return chartBarStackedHoverAxisTick(chartS, select(e.currentTarget), e.type.endsWith('over'));
        });
    });
}
function chartBarStackedHoverBar(chart, bar, hover) {
    bar.each(function (barD, i, g) {
        chart.selectAll(".label[data-key=\"".concat(barD.key, "\"]")).classed('highlight', hover);
        chart.selectAll(".axis-x .tick[data-key=\"".concat(barD.category, "\"]")).classed('highlight', hover);
        chart.selectAll(".legend-item[data-key=\"".concat(barD.subcategory, "\"]")).classed('highlight', hover);
    });
}
function chartBarStackedHoverLegendItem(chart, legendItem, hover) {
    legendItem.each(function (_, i, g) {
        var subcategory = g[i].getAttribute('data-key');
        chart
            .selectAll(".bar[data-subcategory=\"".concat(subcategory, "\"]"))
            .classed('highlight', hover)
            .each(function (d) { return chart.selectAll(".label[data-key=\"".concat(d.key, "\"]")).classed('highlight', hover); });
    });
}
function chartBarStackedHoverAxisTick(chart, tick, hover) {
    tick.classed('highlight', hover).each(function (_, i, g) {
        var category = g[i].getAttribute('data-key');
        chart
            .selectAll(".bar[data-category=\"".concat(category, "\"]"))
            .classed('highlight', hover)
            .each(function (d) { return chart.selectAll(".label[data-key=\"".concat(d.key, "\"]")).classed('highlight', hover); });
    });
}

function chartBarGroupedData(data) {
    var _a;
    var seriesData = seriesBarGroupedData(data);
    return __assign(__assign(__assign({}, seriesData), chartCartesianData(data)), { styleClasses: data.styleClasses || seriesData.subcategories.map(function (c, i) { return "categorical-".concat(i); }), legend: data.legend || {}, labelsEnabled: (_a = data.labelsEnabled) !== null && _a !== void 0 ? _a : true, labels: data.labels || {} });
}
function chartBarGroupedRender(selection) {
    selection
        .call(function (s) { return chartBaseRender(s); })
        .classed('chart-bar-grouped', true)
        .each(function (chartD, i, g) {
        var subcategories = chartD.subcategories, xAxis = chartD.xAxis, yAxis = chartD.yAxis, categoryScale = chartD.categoryScale, valueScale = chartD.valueScale, styleClasses = chartD.styleClasses, labelsEnabled = chartD.labelsEnabled, labelsD = chartD.labels, legendD = chartD.legend; chartD.values;
        var chartS = select(g[i]);
        var drawAreaS = chartS.selectAll('.draw-area');
        var barSeriesS = drawAreaS
            .selectAll('.series-bar-grouped')
            .data([chartD])
            .join('g')
            .call(function (s) { return seriesBarGroupedRender(s); })
            .on('pointerover.chartbargroupedhighlight pointerout.chartbargroupedhighlight', function (e) {
            return chartBarGroupedHoverBar(chartS, select(e.target), e.type.endsWith('over'));
        });
        drawAreaS
            .selectAll('.series-label-bar')
            .data(labelsEnabled
            ? [
                seriesLabelBarData(__assign({ barContainer: barSeriesS }, labelsD)),
            ]
            : [])
            .join('g')
            .call(function (s) { return seriesLabelBar(s); });
        chartS
            .selectAll('.legend')
            .data([
            legendData(__assign(__assign({ labels: subcategories, styleClasses: styleClasses }, legendD), { keys: subcategories })),
        ])
            .join('g')
            .call(function (s) { return legendRender(s); })
            .on('pointerover.chartbargroupedhighlight pointerout.chartbargroupedhighlight', function (e) {
            chartBarGroupedHoverLegendItem(chartS, select(e.target.closest('.legend-item')), e.type.endsWith('over'));
        });
        xAxis.scale = categoryScale;
        yAxis.scale = valueScale;
        chartCartesianAxisRender(chartS);
        chartS
            .selectAll(".axis-x .tick")
            .on('pointerover.chartbargroupedhighlight pointerout.chartbargroupedhighlight', function (e) {
            return chartBarGroupedHoverAxisTick(chartS, select(e.currentTarget), e.type.endsWith('over'));
        });
    });
}
var chartBarGroupedHoverBar = chartBarStackedHoverBar;
var chartBarGroupedHoverLegendItem = chartBarStackedHoverLegendItem;
var chartBarGroupedHoverAxisTick = chartBarStackedHoverAxisTick;

function chartWindowBarData(data) {
    var chartData = chartBarData(data), valueDomain = data.valueDomain || (function (values) { return [0, Math.max.apply(Math, __spreadArray([], __read(values), false)) * 1.05]; });
    chartData.valueScale.domain(valueDomain instanceof Function ? valueDomain(chartData.values) : valueDomain);
    return __assign(__assign({}, chartData), { categoryEntity: data.categoryEntity || 'Categories', valueEntity: data.valueEntity || 'Values', categoryActiveStates: data.categoryActiveStates || chartData.categories.map(function () { return true; }), valueDomain: valueDomain });
}
function chartWindowBarRender(selection) {
    selection
        .classed('chart-window-bar', true)
        .call(function (s) { return windowChartBaseRender(s); })
        .each(function (chartWindowD, i, g) {
        var categoryActiveStates = chartWindowD.categoryActiveStates, categories = chartWindowD.categories, categoryScale = chartWindowD.categoryScale, values = chartWindowD.values, valueScale = chartWindowD.valueScale, styleClasses = chartWindowD.styleClasses, keys = chartWindowD.keys, valueDomain = chartWindowD.valueDomain, labels = chartWindowD.labels.labels;
        var chartWindowS = select(g[i]), menuItemsS = chartWindowS.selectAll('.menu-tools > .items'), layouterS = chartWindowS.selectAll('.layouter');
        // category filter
        menuItemsS
            .selectAll('.tool-filter-categories')
            .data([
            toolFilterNominalData({
                text: chartWindowD.categoryEntity,
                options: chartWindowD.categories,
                keys: chartWindowD.categories
            }),
        ])
            .join('li')
            .classed('tool-filter-categories', true)
            .call(function (s) { return toolFilterNominalRender(s); })
            .call(function (s) {
            return s.selectAll('.checkbox input').attr('checked', function (d, i) { return categoryActiveStates[i]; });
        })
            .on('change.chartwindowbar', function (e, filterD) {
            var categoryFilterS = select(this);
            var checkedStates = [];
            categoryFilterS
                .selectAll('.checkbox')
                .each(function (d, i, g) { return checkedStates.push(g[i].querySelector('input').checked); });
            chartWindowS.dispatch('categoryfilter', {
                detail: { categoryActiveStates: checkedStates }
            });
        });
        // download svg
        menuItemsS
            .selectAll('.tool-download-svg')
            .data([null])
            .join('li')
            .call(function (s) { return toolDownloadSVGRender(s); });
        var filterCat = function (v, i) { return categoryActiveStates[i]; };
        var filteredCategories = categories.filter(filterCat);
        var filteredValues = values.filter(filterCat);
        var filteredStyleClasses = arrayIs(styleClasses)
            ? styleClasses.filter(filterCat)
            : styleClasses;
        var filteredKeys = keys === null || keys === void 0 ? void 0 : keys.filter(filterCat);
        var filteredLabels = arrayIs(labels) ? labels.filter(filterCat) : labels;
        var filteredValueDomain = valueDomain instanceof Function ? valueDomain(filteredValues) : valueDomain;
        categoryScale.domain(filteredCategories);
        valueScale.domain(filteredValueDomain);
        // chart
        var chartS = layouterS
            .selectAll('svg.chart-bar')
            .data([
            chartBarData(__assign(__assign({}, chartWindowD), { categories: filteredCategories, values: filteredValues, keys: filteredKeys, styleClasses: filteredStyleClasses, labels: __assign(__assign({}, chartWindowD.labels), { labels: filteredLabels }) })),
        ])
            .join('svg')
            .call(function (s) { return chartBarRender(s); });
        layouterS
            .on('boundschange.chartwindowbar', function () { return chartBarRender(chartS); })
            .call(function (s) { return layouterCompute(s); });
    });
}
function chartWindowBarAutoResize(selection) {
    selection.on('resize', function () {
        select(this).call(function (s) { return chartWindowBarRender(s); });
    });
}
function chartWindowBarAutoFilterCategories(data) {
    return function (s) {
        s.on('categoryfilter', function (e, d) {
            data = data || d;
            data.categoryActiveStates = e.detail.categoryActiveStates;
            select(this)
                .datum(chartWindowBarData(data))
                .call(function (s) { return chartWindowBarRender(s); });
        });
    };
}

function chartWindowBarGroupedData(data) {
    var chartData = chartBarGroupedData(data), valueDomain = data.valueDomain ||
        (function (values) { return [0, Math.max.apply(Math, __spreadArray([], __read(values.map(function (catV) { return Math.max.apply(Math, __spreadArray([], __read(catV), false)); })), false)) * 1.05]; });
    chartData.valueScale.domain(valueDomain instanceof Function ? valueDomain(chartData.values) : valueDomain);
    return __assign(__assign({}, chartData), { categoryEntity: data.categoryEntity || 'Categories', subcategoryEntity: data.subcategoryEntity || 'Subcategories', valueEntity: data.valueEntity || 'Values', valueDomain: valueDomain, categoryActiveStates: data.categoryActiveStates || chartData.categories.map(function () { return true; }), subcategoryActiveStates: data.subcategoryActiveStates || chartData.subcategories.map(function () { return true; }) });
}
function chartWindowBarGroupedRender(selection) {
    selection
        .classed('chart-window-bar-grouped', true)
        .call(function (s) { return windowChartBaseRender(s); })
        .each(function (chartWindowD, i, g) {
        var categories = chartWindowD.categories, categoryScale = chartWindowD.categoryScale, subcategories = chartWindowD.subcategories, styleClasses = chartWindowD.styleClasses, values = chartWindowD.values, valueScale = chartWindowD.valueScale, keys = chartWindowD.keys, valueDomain = chartWindowD.valueDomain, categoryActiveStates = chartWindowD.categoryActiveStates, subcategoryActiveStates = chartWindowD.subcategoryActiveStates, labels = chartWindowD.labels.labels;
        var chartWindowS = select(g[i]), menuItemsS = chartWindowS.selectAll('.menu-tools > .items'), layouterS = chartWindowS.selectAll('.layouter');
        // category filter
        menuItemsS
            .selectAll('.tool-filter-categories')
            .data([
            toolFilterNominalData({
                text: chartWindowD.categoryEntity,
                options: chartWindowD.categories,
                keys: chartWindowD.categories
            }),
        ])
            .join('li')
            .classed('tool-filter-categories', true)
            .call(function (s) { return toolFilterNominalRender(s); })
            .call(function (s) {
            return s.selectAll('.checkbox input').attr('checked', function (d, i) { return categoryActiveStates[i]; });
        })
            .on('change.chartwindowbar', function (e, filterD) {
            var categoryFilterS = select(this);
            var checkedStates = [];
            categoryFilterS
                .selectAll('.checkbox')
                .each(function (d, i, g) { return checkedStates.push(g[i].querySelector('input').checked); });
            chartWindowS.dispatch('categoryfilter', {
                detail: { categoryActiveStates: checkedStates }
            });
        });
        // subcategory filter
        menuItemsS
            .selectAll('.tool-filter-subcategories')
            .data([
            toolFilterNominalData({
                text: chartWindowD.subcategoryEntity,
                options: chartWindowD.subcategories,
                keys: chartWindowD.subcategories
            }),
        ])
            .join('li')
            .classed('tool-filter-subcategories', true)
            .call(function (s) { return toolFilterNominalRender(s); })
            .call(function (s) {
            return s.selectAll('.checkbox input').attr('checked', function (d, i) { return subcategoryActiveStates[i]; });
        })
            .on('change.chartwindowbar', function (e, filterD) {
            var subcategoryFilterS = select(this);
            var checkedStates = [];
            subcategoryFilterS
                .selectAll('.checkbox')
                .each(function (d, i, g) { return checkedStates.push(g[i].querySelector('input').checked); });
            chartWindowS.dispatch('subcategoryfilter', {
                detail: { subcategoryActiveStates: checkedStates }
            });
        });
        // download svg
        menuItemsS
            .selectAll('.tool-download-svg')
            .data([null])
            .join('li')
            .call(function (s) { return toolDownloadSVGRender(s); });
        var filterCat = function (v, i) { return categoryActiveStates[i]; };
        var filterSubcat = function (v, i) { return subcategoryActiveStates[i]; };
        var filteredCats = categories.filter(filterCat), filteredSubcats = subcategories.filter(filterSubcat), filteredStyleClasses = styleClasses.filter(filterSubcat), filteredValues = values.filter(filterCat).map(function (v) { return v.filter(filterSubcat); }), filteredKeys = keys === null || keys === void 0 ? void 0 : keys.filter(filterCat).map(function (v) { return v.filter(filterSubcat); }), filteredLabels = arrayIs(labels)
            ? arrayPartition(labels, subcategories.length)
                .filter(filterCat)
                .map(function (v) { return v.filter(filterSubcat); })
                .flat()
            : labels, filteredValueDomain = valueDomain instanceof Function ? valueDomain(filteredValues) : valueDomain;
        categoryScale.domain(filteredCats);
        valueScale.domain(filteredValueDomain).nice();
        // chart
        var chartS = layouterS
            .selectAll('svg.chart-bar-grouped')
            .data([
            chartBarGroupedData(__assign(__assign({}, chartWindowD), { categories: filteredCats, subcategories: filteredSubcats, values: filteredValues, keys: filteredKeys, styleClasses: filteredStyleClasses, labels: __assign(__assign({}, chartWindowD.labels), { labels: filteredLabels }) })),
        ])
            .join('svg')
            .call(function (s) { return chartBarGroupedRender(s); });
        layouterS
            .on('boundschange.chartwindowbargrouped', function () { return chartBarGroupedRender(chartS); })
            .call(function (s) { return layouterCompute(s); });
    });
}
function chartWindowBarGroupedAutoResize(selection) {
    selection.on('resize', function () {
        select(this).call(function (s) { return chartWindowBarGroupedRender(s); });
    });
}
function chartWindowBarGroupedAutoFilterCategories(data) {
    return function (s) {
        return s.on('categoryfilter', function (e, d) {
            data = data || d;
            data.categoryActiveStates = e.detail.categoryActiveStates;
            select(this)
                .datum(chartWindowBarGroupedData(data))
                .call(function (s) { return chartWindowBarGroupedRender(s); });
        });
    };
}
function chartWindowBarGroupedAutoFilterSubcategories(data) {
    return function (s) {
        return s.on('subcategoryfilter', function (e, d) {
            data = data || d;
            data.subcategoryActiveStates = e.detail.subcategoryActiveStates;
            select(this)
                .datum(chartWindowBarGroupedData(data))
                .call(function (s) { return chartWindowBarGroupedRender(s); });
        });
    };
}

function chartWindowBarStackedData(data) {
    var chartData = chartBarStackedData(data), valuesAsRatios = data.valuesAsRatios || false, valueDomain = data.valueDomain ||
        (function (values) {
            return valuesAsRatios
                ? [0, 100]
                : [0, Math.max.apply(Math, __spreadArray([], __read(values.map(function (catV) { return catV.reduce(function (a, b) { return a + b; }); })), false)) * 1.05];
        });
    chartData.valueScale.domain(valueDomain instanceof Function ? valueDomain(chartData.values) : valueDomain);
    return __assign(__assign({}, chartData), { categoryEntity: data.categoryEntity || 'Categories', subcategoryEntity: data.subcategoryEntity || 'Subcategories', valueEntity: data.valueEntity || 'Values', valueDomain: valueDomain, valuesAsRatios: valuesAsRatios, categoryActiveStates: data.categoryActiveStates || chartData.categories.map(function () { return true; }), subcategoryActiveStates: data.subcategoryActiveStates || chartData.subcategories.map(function () { return true; }) });
}
function chartWindowBarStackedRender(selection) {
    selection
        .classed('chart-window-bar-stacked', true)
        .call(function (s) { return windowChartBaseRender(s); })
        .each(function (chartWindowD, i, g) {
        var categories = chartWindowD.categories, categoryScale = chartWindowD.categoryScale, subcategories = chartWindowD.subcategories, values = chartWindowD.values, valueScale = chartWindowD.valueScale, keys = chartWindowD.keys, styleClasses = chartWindowD.styleClasses, valueDomain = chartWindowD.valueDomain, valuesAsRatios = chartWindowD.valuesAsRatios, categoryActiveStates = chartWindowD.categoryActiveStates, subcategoryActiveStates = chartWindowD.subcategoryActiveStates, labels = chartWindowD.labels.labels;
        var chartWindowS = select(g[i]), menuItemsS = chartWindowS.selectAll('.menu-tools > .items'), layouterS = chartWindowS.selectAll('.layouter');
        // category filter
        menuItemsS
            .selectAll('.tool-filter-categories')
            .data([
            toolFilterNominalData({
                text: chartWindowD.categoryEntity,
                options: chartWindowD.categories,
                keys: chartWindowD.categories
            }),
        ])
            .join('li')
            .classed('tool-filter-categories', true)
            .call(toolFilterNominalRender)
            .call(function (s) {
            return s.selectAll('.checkbox input').attr('checked', function (d, i) { return categoryActiveStates[i]; });
        })
            .on('change.chartwindowbar', function (e, filterD) {
            var categoryFilterS = select(this);
            var checkedStates = [];
            categoryFilterS
                .selectAll('.checkbox')
                .each(function (d, i, g) { return checkedStates.push(g[i].querySelector('input').checked); });
            chartWindowS.dispatch('categoryfilter', {
                detail: { categoryActiveStates: checkedStates }
            });
        });
        // subcategory filter
        menuItemsS
            .selectAll('.tool-filter-subcategories')
            .data([
            toolFilterNominalData({
                text: chartWindowD.subcategoryEntity,
                options: chartWindowD.subcategories,
                keys: chartWindowD.subcategories
            }),
        ])
            .join('li')
            .classed('tool-filter-subcategories', true)
            .call(toolFilterNominalRender)
            .call(function (s) {
            return s.selectAll('.checkbox input').attr('checked', function (d, i) { return subcategoryActiveStates[i]; });
        })
            .on('change.chartwindowbar', function (e, filterD) {
            var subcategoryFilterS = select(this);
            var checkedStates = [];
            subcategoryFilterS
                .selectAll('.checkbox')
                .each(function (d, i, g) { return checkedStates.push(g[i].querySelector('input').checked); });
            chartWindowS.dispatch('subcategoryfilter', {
                detail: { subcategoryActiveStates: checkedStates }
            });
        });
        // download svg
        menuItemsS
            .selectAll('.tool-download-svg')
            .data([null])
            .join('li')
            .call(function (s) { return toolDownloadSVGRender(s); });
        var filterCat = function (v, i) { return categoryActiveStates[i]; };
        var filterSubcat = function (v, i) { return subcategoryActiveStates[i]; };
        var filteredCats = categories.filter(filterCat);
        var filteredSubcats = subcategories.filter(filterSubcat);
        var filteredStyleClasses = styleClasses.filter(filterSubcat);
        var filteredValues = values
            .filter(filterCat)
            .map(function (catValues) { return catValues.filter(filterSubcat); })
            .map(function (catValues) {
            if (!valuesAsRatios)
                return catValues;
            var sum = catValues.reduce(function (prev, curr) { return prev + curr; }, 0);
            return catValues.map(function (v) { return (v / sum) * 100 || 0; });
        });
        var filteredKeys = keys === null || keys === void 0 ? void 0 : keys.filter(filterCat).map(function (v) { return v.filter(filterSubcat); });
        var filteredLabels = arrayIs(labels)
            ? arrayPartition(labels, subcategories.length)
                .filter(filterCat)
                .map(function (v) { return v.filter(filterSubcat); })
                .flat()
            : labels;
        var filteredValueDomain = valueDomain instanceof Function ? valueDomain(filteredValues) : valueDomain;
        categoryScale.domain(filteredCats);
        valueScale.domain(filteredValueDomain).nice();
        // chart
        var chartS = layouterS
            .selectAll('svg.chart-bar-stacked')
            .data([
            chartBarStackedData(__assign(__assign({}, chartWindowD), { categories: filteredCats, subcategories: filteredSubcats, values: filteredValues, keys: filteredKeys, styleClasses: filteredStyleClasses, labels: __assign(__assign({}, chartWindowD.labels), { labels: filteredLabels }) })),
        ])
            .join('svg')
            .call(function (s) { return chartBarStackedRender(s); });
        layouterS
            .on('boundschange.chartwindowbarstacked', function () { return chartBarStackedRender(chartS); })
            .call(function (s) { return layouterCompute(s); });
    });
}
function chartWindowBarStackedAutoResize(selection) {
    selection.on('resize', function () {
        select(this).call(function (s) { return chartWindowBarStackedRender(s); });
    });
}
function chartWindowBarStackedAutoFilterCategories(data) {
    return function (s) {
        return s.on('categoryfilter', function (e, d) {
            data = data || d;
            data.categoryActiveStates = e.detail.categoryActiveStates;
            select(this)
                .datum(chartWindowBarStackedData(data))
                .call(function (s) { return chartWindowBarStackedRender(s); });
        });
    };
}
function chartWindowBarStackedAutoFilterSubcategories(data) {
    return function (s) {
        return s.on('subcategoryfilter', function (e, d) {
            data = data || d;
            data.subcategoryActiveStates = e.detail.subcategoryActiveStates;
            select(this)
                .datum(chartWindowBarStackedData(data))
                .call(function (s) { return chartWindowBarStackedRender(s); });
        });
    };
}

function seriesPointData(data) {
    var xValues = data.xValues || [];
    var yValues = data.yValues || [];
    var xScale = data.xScale || calcDefaultScale(xValues);
    var yScale = data.yScale || calcDefaultScale(xValues);
    var keys = data.keys || yValues.map(function (c, i) { return i.toString(); });
    return __assign(__assign({ xValues: xValues, xScale: xScale, yValues: yValues, yScale: yScale, radiuses: data.radiuses || 5, color: data.color, styleClasses: data.styleClasses || 'categorical-0', keys: keys, bounds: data.bounds || { width: 600, height: 400 }, flipped: data.flipped || false }, seriesConfigTooltipsData(data)), { tooltipsEnabled: data.tooltipsEnabled || true, tooltips: data.tooltips || (function (e, d) { return "X-Value: ".concat(d.xValue, "<br/>Y-Value: ").concat(d.yValue); }) });
}
function seriesPointCreatePoints(seriesData) {
    var xScale = seriesData.xScale, yScale = seriesData.yScale, xValues = seriesData.xValues, yValues = seriesData.yValues, radiuses = seriesData.radiuses; seriesData.bounds; var keys = seriesData.keys, styleClasses = seriesData.styleClasses, flipped = seriesData.flipped, color = seriesData.color;
    var data = [];
    for (var i = 0; i < xValues.length; ++i) {
        var x = xValues[i];
        var y = yValues[i];
        var r = typeof radiuses === "number" ? radiuses : radiuses.scale(radiuses.radiusDim[i]);
        data.push({
            styleClass: arrayIs(styleClasses) ? styleClasses[i] : styleClasses,
            key: (keys === null || keys === void 0 ? void 0 : keys[i]) || i.toString(),
            center: {
                x: flipped ? yScale(y) : xScale(x),
                y: flipped ? xScale(x) : yScale(y)
            },
            radius: r !== null && r !== void 0 ? r : 5,
            xValue: x,
            yValue: y,
            color: color === null || color === void 0 ? void 0 : color.colorScale(color.colorDim[i])
        });
    }
    return data;
}
function seriesPointRender(selection) {
    selection
        .classed('series-point', true)
        .attr('data-ignore-layout-children', true)
        .each(function (d, i, g) {
        var seriesS = select(g[i]);
        var boundsAttr = seriesS.attr('bounds');
        if (!boundsAttr)
            return;
        d.bounds = rectFromString(boundsAttr);
        seriesS
            .selectAll('.point')
            .data(seriesPointCreatePoints(d), function (d) { return d.key; })
            .call(function (s) { return seriesPointJoin(seriesS, s); });
    })
        .on('pointerover.seriespointhighlight pointerout.seriespointhighlight', function (e) {
        return e.target.classList.toggle('highlight', e.type.endsWith('over'));
    })
        .call(function (s) { return seriesConfigTooltipsHandleEvents(s); });
}
function seriesPointJoin(seriesSelection, joinSelection) {
    joinSelection
        .join(function (enter) {
        return enter
            .append('circle')
            .classed('point', true)
            .each(function (d, i, g) { return circleToAttrs(select(g[i]), circleMinimized(d)); })
            .call(function (s) { return seriesSelection.dispatch('enter', { detail: { selection: s } }); });
    }, undefined, function (exit) {
        return exit
            .classed('exiting', true)
            .call(function (s) {
            return s
                .transition('exit')
                .duration(250)
                .each(function (d, i, g) { return circleToAttrs(select(g[i]), circleMinimized(d)); })
                .remove();
        })
            .call(function (s) { return seriesSelection.dispatch('exit', { detail: { selection: s } }); });
    })
        .call(function (s) {
        return s
            .transition('update')
            .duration(250)
            .ease(cubicOut)
            .each(function (d, i, g) { return circleToAttrs(select(g[i]), d); });
    })
        .attr('data-style', function (d) { return !d.color ? d.styleClass : null; })
        .attr('data-key', function (d) { return d.key; })
        .call(function (s) { return seriesSelection.dispatch('update', { detail: { selection: s } }); });
}

function chartPointRender(selection) {
    selection
        .call(function (s) { return chartBaseRender(s); })
        .classed('chart-point', true)
        .each(function (chartD, i, g) {
        setScale(chartD, g[i]);
        renderAllSeriesOfPoints(chartD, g[i]);
        renderLegend(chartD, g[i]);
        chartD.xAxis.scale = chartD.xScale;
        chartD.yAxis.scale = chartD.yScale;
    })
        .call(function (s) { return chartCartesianAxisRender(s); });
    function setScale(data, g) {
        var drawAreaS = select(g).selectAll('.draw-area');
        var drawAreaBounds = rectFromString(drawAreaS.attr('bounds') || '0, 0, 600, 400');
        var flipped = data.flipped, xScale = data.xScale, yScale = data.yScale, maxRadius = data.maxRadius;
        xScale.range(flipped ? [drawAreaBounds.height - maxRadius, maxRadius] : [maxRadius, drawAreaBounds.width - 2 * maxRadius]);
        yScale.range(flipped ? [maxRadius, drawAreaBounds.width - 2 * maxRadius] : [drawAreaBounds.height - maxRadius, maxRadius]);
    }
    function renderAllSeriesOfPoints(data, g) {
        var flipped = data.flipped, pointSeries = data.pointSeries, xScale = data.xScale, yScale = data.yScale;
        select(g)
            .selectAll('.draw-area')
            .selectAll('.series-point')
            .data(pointSeries.map(function (p) {
            return seriesPointData({
                styleClasses: p.styleClasses,
                keys: p.keys,
                xValues: p.xValues,
                yValues: p.yValues,
                radiuses: p.radiuses,
                color: p.color,
                xScale: xScale,
                yScale: yScale,
                flipped: flipped
            });
        })).join('svg')
            .call(function (s) { return seriesPointRender(s); });
    }
    function renderLegend(chartD, g) {
        var drawAreaS = select(g).selectAll('.draw-area');
        var legend = chartD.legend;
        selection
            .selectAll('.legend')
            .data([legend])
            .join('g')
            .call(function (s) { return legendRender(s); })
            .on('pointerover.chartpointhighlight pointerout.chartpointhighlight', function (e) {
            chartPointHoverLegendItem(drawAreaS, select(e.target.closest('.legend-item')), e.type.endsWith('over'));
        });
    }
}
function chartPointHoverLegendItem(chartS, legendItemS, hover) {
    legendItemS.each(function (_, i, g) {
        var key = g[i].getAttribute('data-key');
        console.log(key);
        chartS.selectAll(".point[data-key^=\"".concat(key, "\"]")).classed('highlight', hover);
        chartS.selectAll(".label[data-key^=\"".concat(key, "\"]")).classed('highlight', hover);
    });
}

function chartPointData(data) {
    var xValues = data.xValues, yValues = data.yValues, xScale = data.xScale, yScale = data.yScale, legend = data.legend, flipped = data.flipped, radiuses = data.radiuses, zoomData = data.zoom, color = data.color;
    var lowerLength = xValues.length < yValues.length ? xValues.length : yValues.length;
    var xVals = xValues.slice(0, lowerLength);
    var yVals = yValues.slice(0, lowerLength);
    var xScaleValid = xScale !== null && xScale !== void 0 ? xScale : calcDefaultScale(xValues);
    var yScaleValid = yScale !== null && yScale !== void 0 ? yScale : calcDefaultScale(yValues);
    var points = xVals.map(function (xVal, index) {
        var styleClasses = data.styleClasses ? data.styleClasses[index] : "categorical-".concat(index);
        var radiusesValid = typeof radiuses === "number" ? radiuses : typeof radiuses === "object" ? {
            scale: radiuses.scale,
            radiusDim: radiuses.radiusDim[index]
        } : 5;
        return seriesPointData({
            flipped: flipped,
            styleClasses: styleClasses,
            keys: yVals[index].map(function (_, markerI) { var _a, _b; return "".concat((_b = (_a = legend === null || legend === void 0 ? void 0 : legend.keys) === null || _a === void 0 ? void 0 : _a[index]) !== null && _b !== void 0 ? _b : index, "-").concat(markerI); }),
            xValues: xVals[index],
            yValues: yVals[index],
            radiuses: radiusesValid,
            color: color,
            xScale: xScaleValid,
            yScale: yScaleValid
        });
    });
    var firstPoint = points[0];
    var maxRadius = typeof firstPoint.radiuses === "number" ? firstPoint.radiuses : firstPoint.radiuses.scale.range()[1];
    var labels = (legend === null || legend === void 0 ? void 0 : legend.labels) ? legend.labels : yVals.map(function (yVal, index) { return "categorical-".concat(index); });
    //TODO: make zoom optional
    return __assign(__assign({ xScale: xScaleValid, yScale: yScaleValid, pointSeries: points, maxRadius: maxRadius, legend: legendData(legend ? legend : { labels: labels }) }, chartCartesianData(data)), { zoom: zoomData ? __assign(__assign({}, zoomData), { behaviour: zoom() }) : undefined });
}

function chartWindowPointData(data) {
    var chartData = chartPointData(data);
    return __assign({}, chartData);
}
var ScatterPlot = /** @class */ (function () {
    function ScatterPlot(selection, data) {
        this.selection = selection;
        this.addedListeners = false;
        this.data = chartWindowPointData(data);
    }
    /**
     * Adds custom event listener. Be sure to add custom event listeners before calling {@link buildWindowChart}
     * as the method also adds listeners and the order matters.
     */
    ScatterPlot.prototype.addCustomListener = function (name, callback) {
        this.selection.on(name, callback);
    };
    ScatterPlot.prototype.buildWindowChart = function () {
        this.renderWindow();
        this.addBuiltInListeners();
        this.addedListeners = true;
    };
    ScatterPlot.prototype.renderWindow = function () {
        this.selection
            .datum(this.data)
            .classed('chart-window-point', true)
            .call(function (s) { return windowChartBaseRender(s); })
            .each(function (chartWindowD, i, g) {
            var chartWindowS = select(g[i]);
            var menuItemsS = chartWindowS.selectAll('.menu-tools > .items');
            var layouterS = chartWindowS.selectAll('.layouter');
            // download svg
            menuItemsS
                .selectAll('.tool-download-svg')
                .data([null])
                .join('li')
                .call(function (s) { return toolDownloadSVGRender(s); });
            // chart
            var chartS = layouterS
                .selectAll('svg.chart-point')
                .data([chartWindowD])
                .join('svg')
                .call(function (s) { return chartPointRender(s); });
            layouterS
                .on('boundschange.chartwindowpoint', function () { return chartPointRender(chartS); })
                .call(function (s) { return layouterCompute(s); });
        });
    };
    ScatterPlot.prototype.addBuiltInListeners = function () {
        if (this.addedListeners)
            return;
        this.addZoomListeners();
        this.addFinalListeners();
    };
    ScatterPlot.prototype.addZoomListeners = function () {
        var renderer = this;
        var drawArea = this.selection.selectAll('.draw-area');
        this.selection
            .each(function (chartWindowD, i, g) {
            var chartWindowS = select(g[i]);
            var xScale = chartWindowD.xScale, yScale = chartWindowD.yScale, zoom = chartWindowD.zoom;
            if (!zoom)
                return;
            drawArea.call(zoom.behaviour.scaleExtent([zoom.out, zoom["in"]]).on('zoom.autozoom', function (e) {
                renderer.data = __assign(__assign({}, chartWindowD), { xScale: e.transform.rescaleX(xScale), yScale: e.transform.rescaleY(yScale) });
                chartWindowS.dispatch('resize');
            }));
            chartWindowS.on('resize.autozoom', function () {
                var _a = __read(xScale.range(), 2), x = _a[0], widthTranslate = _a[1];
                var _b = __read(yScale.range(), 2), y = _b[0], heightTranslate = _b[1];
                var extent = [
                    [x, heightTranslate],
                    [widthTranslate, y],
                ];
                zoom.behaviour.extent(extent).translateExtent(extent);
            });
        });
    };
    ScatterPlot.prototype.addFinalListeners = function () {
        var _a;
        var instance = this;
        this.selection.on('resize.final', function () { instance.renderWindow(); });
        (_a = this.data.zoom) === null || _a === void 0 ? void 0 : _a.behaviour.on('zoom.final', function () { instance.renderWindow(); });
    };
    return ScatterPlot;
}());

function seriesLineData(data) {
    var _a, _b, _c;
    var xValues = data.xValues || [];
    var yValues = data.yValues || [];
    // todo: figure out a better way to create default scales
    // todo: what if typeof xValues[0] === Date? scaleUTC?
    // todo: should we support xValues: any[][]?
    var xScale = (_a = data.xScale) !== null && _a !== void 0 ? _a : (typeof (xValues === null || xValues === void 0 ? void 0 : xValues[0]) === 'number' ?
        linear()
            .domain([Math.min.apply(Math, __spreadArray([], __read(xValues), false)), Math.max.apply(Math, __spreadArray([], __read(xValues), false))])
            .nice() :
        point().domain(new Set(xValues)));
    var yScale = (_b = data.yScale) !== null && _b !== void 0 ? _b : (typeof ((_c = yValues === null || yValues === void 0 ? void 0 : yValues[0]) === null || _c === void 0 ? void 0 : _c[0]) === 'number' ?
        linear()
            .domain([
            Math.min.apply(Math, __spreadArray([], __read(yValues.map(function (a) { return Math.min.apply(Math, __spreadArray([], __read(a), false)); })), false)),
            Math.max.apply(Math, __spreadArray([], __read(yValues.map(function (a) { return Math.max.apply(Math, __spreadArray([], __read(a), false)); })), false)),
        ])
            .nice() :
        point().domain(new Set(yValues.flat())));
    var yScales = data.yScales;
    var styleClasses = data.styleClasses || yValues.map(function (_, i) { return "categorical-".concat(i); });
    var keys = data.keys || yValues.map(function (c, i) { return i.toString(); });
    var flipped = data.flipped || false;
    return { xValues: xValues, yValues: yValues, xScale: xScale, yScale: yScale, yScales: yScales, styleClasses: styleClasses, keys: keys, flipped: flipped };
}
function seriesLineRender(selection) {
    selection
        .classed('series-line', true)
        .attr('data-ignore-layout-children', true)
        .each(function (seriesD, i, g) {
        var seriesS = select(g[i]);
        var boundsStr = seriesS.attr('bounds');
        if (!boundsStr)
            return;
        rectFromString(boundsStr);
        var xValues = seriesD.xValues, yValues = seriesD.yValues, xScale = seriesD.xScale, yScale = seriesD.yScale, yScales = seriesD.yScales, keys = seriesD.keys, styleClasses = seriesD.styleClasses, flipped = seriesD.flipped;
        var lines = yValues.map(function (yValues, lineIndex) { return ({
            positions: yValues.map(function (yValue, pointIndex) {
                var x = xScale(xValues[pointIndex]);
                var y = yScales ? yScales[pointIndex](yValue) : yScale(yValue); //Todo: ! is Dirty. Refactoring!
                return {
                    x: flipped ? y : x,
                    y: flipped ? x : y
                };
            }),
            key: keys[lineIndex],
            styleClass: arrayIs(styleClasses) ? styleClasses[lineIndex] : styleClasses
        }); });
        // todo: enter transition
        // todo: exit transition
        seriesS
            .selectAll('path')
            .data(lines, function (d) { return d.key; })
            .join(function (enter) {
            return enter
                .append('path')
                .classed('line', true)
                .call(function (s) { return seriesS.dispatch('enter', { detail: { selection: s } }); });
        }, undefined, function (exit) {
            return exit.remove().call(function (s) { return seriesS.dispatch('exit', { detail: { selection: s } }); });
        })
            .each(function (lineD, i, g) {
            pathLine(g[i], lineD.positions);
        })
            .attr('data-style', function (d) { return d.styleClass; })
            .attr('data-key', function (d) { return d.key; })
            .call(function (s) { return seriesS.dispatch('update', { detail: { selection: s } }); });
    })
        .on('pointerover.serieslinehighlight pointerout.serieslinehighlight', function (e) {
        return e.target.classList.toggle('highlight', e.type.endsWith('over'));
    });
}

function chartLineData(data) {
    var seriesD = seriesLineData(data);
    var chartCartesianD = chartCartesianData(data);
    return __assign(__assign(__assign({}, seriesD), chartCartesianD), { legend: data.legend || {}, markerLabelsEnabled: data.markerLabelsEnabled || true, markerLabels: data.markerLabels || (function (chartD, markerD) { return "".concat(markerD.yValue); }), markerTooltips: data.markerTooltips || {} });
}
function chartLineRender(selection) {
    selection
        .call(function (s) { return chartBaseRender(s); })
        .classed('chart-line', true)
        .each(function (chartD, i, g) {
        var chartS = select(g[i]);
        var drawAreaS = chartS.selectAll('.draw-area');
        var drawAreaBounds = rectFromString(drawAreaS.attr('bounds') || '0, 0, 600, 400');
        var styleClasses = chartD.styleClasses, keys = chartD.keys, xValues = chartD.xValues, yValues = chartD.yValues, xScale = chartD.xScale, yScale = chartD.yScale, flipped = chartD.flipped;
        xScale.range(flipped ? [drawAreaBounds.height, 0] : [0, drawAreaBounds.width]);
        yScale.range(flipped ? [0, drawAreaBounds.width] : [drawAreaBounds.height, 0]);
        drawAreaS
            .selectAll('.series-line')
            .data([chartD])
            .join('g')
            .call(function (s) { return seriesLineRender(s); })
            .on('pointerover.chartlinehighlight', function (e) {
            return chartLineHoverLine(chartS, select(e.target), true);
        })
            .on('pointerout.chartlinehighlight', function (e) {
            return chartLineHoverLine(chartS, select(e.target), false);
        });
        var markerTooltips = chartD.markerTooltips;
        var markerS = drawAreaS
            .selectAll('.series-point')
            .data(keys.map(function (k, lineI) {
            return seriesPointData(__assign({ styleClasses: arrayIs(styleClasses) ? styleClasses[lineI] : styleClasses, keys: yValues[lineI].map(function (_, markerI) { return "".concat(k, "-").concat(markerI); }), xValues: xValues, yValues: yValues[lineI], xScale: xScale, yScale: yScale, flipped: flipped }, markerTooltips));
        }))
            .join('g')
            .call(function (s) { return seriesPointRender(s); })
            .on('pointerover.chartlinehighlight', function (e) {
            return chartLineHoverMarker(chartS, select(e.target), true);
        })
            .on('pointerout.chartlinehighlight', function (e) {
            return chartLineHoverMarker(chartS, select(e.target), false);
        })
            .attr('data-key', function (d, i) { return keys[i]; });
        var markerLabelsEnabled = chartD.markerLabelsEnabled, markerLabels = chartD.markerLabels;
        drawAreaS
            .selectAll('.series-label')
            .data(markerLabelsEnabled
            ? keys.map(function (lineKey, lineI) {
                var markerPoints = markerS
                    .selectAll(".point[data-key^=\"".concat(lineKey, "\"]"))
                    .data();
                return seriesLabelData({
                    positions: markerPoints.map(function (p) { return p.center; }),
                    keys: markerPoints.map(function (p) { return p.key; }),
                    texts: markerPoints.map(function (p, markerI) {
                        return markerLabels(chartD, {
                            lineIndex: lineI,
                            markerIndex: markerI,
                            xValue: p.xValue,
                            yValue: p.yValue
                        });
                    })
                });
            })
            : [])
            .join('g')
            .call(function (s) { return seriesLabelRender(s); });
        var legendD = chartD.legend;
        chartS
            .selectAll('.legend')
            .data(arrayIs(styleClasses) && styleClasses.length > 1
            ? [legendData(__assign(__assign({ styleClasses: styleClasses, labels: keys }, legendD), { keys: keys }))]
            : [])
            .join('g')
            .call(function (s) { return legendRender(s); })
            .on('pointerover.chartlinehighlight pointerout.chartlinehighlight', function (e) {
            chartLineHoverLegendItem(chartS, select(e.target.closest('.legend-item')), e.type.endsWith('over'));
        });
        chartD.xAxis.scale = chartD.xScale;
        chartD.yAxis.scale = chartD.yScale;
        chartCartesianAxisRender(chartS);
    });
}
function chartLineHoverLine(chartS, lineS, hover) {
    lineS.each(function (lineD) {
        chartS.selectAll(".legend-item[data-key=\"".concat(lineD.key, "\"]")).classed('highlight', hover);
        chartS.selectAll(".point[data-key^=\"".concat(lineD.key, "\"]")).classed('highlight', hover);
        chartS.selectAll(".label[data-key^=\"".concat(lineD.key, "\"]")).classed('highlight', hover);
    });
}
function chartLineHoverMarker(chartS, markerS, hover) {
    markerS.each(function (pointD) {
        var lineKey = pointD.key.replace(/-[0-9]+$/, '');
        chartS.selectAll(".legend-item[data-key=\"".concat(lineKey, "\"]")).classed('highlight', hover);
        chartS.selectAll(".line[data-key^=\"".concat(lineKey, "\"]")).classed('highlight', hover);
        chartS.selectAll(".label[data-key=\"".concat(pointD.key, "\"]")).classed('highlight', hover);
    });
}
function chartLineHoverLegendItem(chartS, legendItemS, hover) {
    legendItemS.each(function (_, i, g) {
        var key = g[i].getAttribute('data-key');
        chartS.selectAll(".line[data-key=\"".concat(key, "\"]")).classed('highlight', hover);
        chartS.selectAll(".point[data-key^=\"".concat(key, "\"]")).classed('highlight', hover);
        chartS.selectAll(".label[data-key^=\"".concat(key, "\"]")).classed('highlight', hover);
    });
}

function chartWindowLineData(data) {
    var chartD = chartLineData(data);
    return __assign({}, chartD);
}
function chartWindowLineRender(selection) {
    selection
        .call(function (s) { return windowChartBaseRender(s); })
        .classed('chart-window-line', true)
        .each(function (chartWindowD, i, g) {
        var chartWindowS = select(g[i]);
        var menuItemsS = chartWindowS.selectAll('.menu-tools > .items');
        var layouterS = chartWindowS.selectAll('.layouter');
        // todo: more tools?
        // download svg
        menuItemsS
            .selectAll('.tool-download-svg')
            .data([null])
            .join('li')
            .call(function (s) { return toolDownloadSVGRender(s); });
        var chartS = layouterS
            .selectAll('svg.chart-line')
            .data([chartWindowD])
            .join('svg')
            .call(function (s) { return chartLineRender(s); });
        layouterS
            .on('boundschange.chartwindowline', function () { return chartLineRender(chartS); })
            .call(function (s) { return layouterCompute(s); });
    });
}
function chartWindowLineAutoResize(selection) {
    selection.on('resize', function () {
        select(this).call(function (s) { return chartWindowLineRender(s); });
    });
}

function parcoordData(data) {
    data.legend; var dimensions = data.dimensions, title = data.title, subtitle = data.subtitle, flipped = data.flipped;
    var dimensionsValid = dimensions.map(function (dimension, index) {
        var scale = dimension.scale, title = dimension.title, subtitle = dimension.subtitle, styleClass = dimension.styleClass, values = dimension.values, configureAxes = dimension.configureAxes;
        return {
            values: dimension.values,
            scale: scale ? scale : calcDefaultScale(values),
            styleClass: styleClass ? styleClass : "dimension-".concat(index),
            axis: axisData({
                scale: scale,
                title: title,
                subtitle: subtitle,
                configureAxis: configureAxes === null || configureAxes === void 0 ? void 0 : configureAxes[index]
            })
        };
    });
    var axisScale = point()
        .domain(dimensionsValid.map(function (data, index) { return index.toString(); }));
    return {
        dimensions: dimensionsValid,
        axisScale: axisScale,
        title: title,
        subtitle: subtitle,
        flipped: flipped //TODO: Legend
    };
}

function chartParcoordRender(selection) {
    selection
        .call(function (s) { return chartBaseRender(s); })
        .classed('chart-parcoord', true)
        .each(function (chartD, i, g) {
        setScale(chartD, g[i]);
        renderLines(chartD, g[i]);
        renderAxes(chartD, g[i]);
        // renderLegend(chartD)
    });
}
function calcBounds(data, g) {
    var drawAreaS = select(g).selectAll('.draw-area');
    var drawAreaBounds = rectFromString(drawAreaS.attr('bounds') || '0, 0, 600, 400');
    var titleS = drawAreaS.select('.title');
    var titleBounds = rectFromString(!titleS.empty() ? titleS.attr('bounds') || '0, 0, 0, 0' : '0, 0, 0, 0');
    var subtitleS = drawAreaS.select('.subtitle');
    var subtitleBounds = rectFromString(!subtitleS.empty() ? subtitleS.attr('bounds') || '0, 0, 0, 0' : '0, 0, 0, 0');
    return { drawAreaBounds: drawAreaBounds, titleBounds: titleBounds, subtitleBounds: subtitleBounds };
}
function setScale(data, g) {
    var _a = calcBounds(data, g), drawAreaBounds = _a.drawAreaBounds, titleBounds = _a.titleBounds, subtitleBounds = _a.subtitleBounds;
    var dimensions = data.dimensions, flipped = data.flipped, axisScale = data.axisScale;
    dimensions.forEach(function (dimension) { return dimension.scale.range(flipped ? [0, drawAreaBounds.width] : [drawAreaBounds.height - titleBounds.height - subtitleBounds.height, 0]); }); //TODO: dynamic Padding
    axisScale.padding(0.25).range(flipped ? [drawAreaBounds.height, 0] : [0, drawAreaBounds.width]); //TODO: dynamic Padding
}
function renderAxes(data, g) {
    data.flipped; var dimensions = data.dimensions, axisScale = data.axisScale;
    dimensions.forEach(function (dimension, index) {
        select(g).selectAll('.draw-area').selectAll(".axis-".concat(index))
            .data([null])
            .join('g')
            .data([dimension.axis])
            .join('g')
            .attr("transform", function () { return "translate(" + axisScale(index.toString()) + ")"; })
            .call(function (s) { return axisSequenceRender(s); })
            // .each((d, i, g) => {
            //   console.log(g[i])
            //   select(g[i]).call(axisLeft(d.scale)).attr('data-ignore-layout-children', true)
            //   select(g[i])
            //     .selectAll('.title')
            //     .data([null])
            //     .join('g')
            //     .classed('title', true)
            //     .attr("y", -12)
            //     .attr('data-ignore-layout-children', true)
            //     .selectAll('text')
            //     .data([null])
            //     .join('text')
            //     .text(d.title)
            //     .style("text-anchor", "middle")
            //     .style("fill", "black")
            // })
            .classed("axis axis-".concat(index), true);
        // .each(function(d) { select(this).call(axisLeft(d.scale)); })
        // // And I build the axis with the call function
        // .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
        // // Add axis title
        // .append("text")
        // .style("text-anchor", "middle")
        // .attr("y", -9)
        // .text(function(d) { return d; })
        // .style("fill", "black")
        //
        // .call((s) => axisLeftRender(s))
        // .classed(`.axis-${index}`, flippedBool)
    });
}
function renderLines(data, g) {
    data.flipped; var dimensions = data.dimensions, axisScale = data.axisScale;
    var _a = calcBounds(data, g), titleBounds = _a.titleBounds, subtitleBounds = _a.subtitleBounds;
    var xVals = dimensions.map(function (dimension, index) { return index.toString(); });
    var yVals = [];
    var yScales = dimensions.map(function (dimension) { return dimension.scale; });
    var dimensionLength = dimensions[0].values.length;
    var _loop_1 = function (vectorIndex) {
        var vector = dimensions.map(function (dimension) {
            return dimension.values[vectorIndex];
        });
        yVals.push(vector);
    };
    for (var vectorIndex = 0; vectorIndex <= dimensionLength; vectorIndex++) {
        _loop_1(vectorIndex);
    }
    var lineSeriesD = seriesLineData({
        xValues: xVals,
        yValues: yVals,
        yScales: yScales,
        xScale: axisScale
    });
    var titleSpace = titleBounds.height + subtitleBounds.height;
    select(g).selectAll('.draw-area').selectAll('.series-line')
        .data([lineSeriesD])
        .join('g')
        .call(function (s) { return seriesLineRender(s); })
        .attr("transform", function () {
        console.log(titleSpace);
        return "translate(0, " + titleSpace + ")";
    });
    // .on('pointerover.chartlinehighlight', (e) =>
    //   chartLineHoverLine(chartS, select(e.target), true)
    // )
    // .on('pointerout.chartlinehighlight', (e) =>
    //   chartLineHoverLine(chartS, select(e.target), false)
    // );
}

function windowChartParcoordData(data) {
    var chartData = parcoordData(data);
    return __assign({}, chartData);
}

var WindowChartParcoordRenderer = /** @class */ (function () {
    function WindowChartParcoordRenderer(selection, data) {
        this.selection = selection;
        this.addedListeners = false;
        this.data = windowChartParcoordData(data);
    }
    WindowChartParcoordRenderer.prototype.addCustomListener = function (name, callback) {
    };
    WindowChartParcoordRenderer.prototype.buildWindowChart = function () {
        this.renderWindow();
        this.addFinalListeners();
        this.addedListeners = true;
    };
    WindowChartParcoordRenderer.prototype.renderWindow = function () {
        this.selection
            .datum(this.data)
            .classed('chart-window-parcoord', true)
            .call(function (s) { return windowChartBaseRender(s); })
            .each(function (chartWindowD, i, g) {
            var chartWindowS = select(g[i]);
            var menuItemsS = chartWindowS.selectAll('.menu-tools > .items');
            var layouterS = chartWindowS.selectAll('.layouter');
            // download svg
            menuItemsS
                .selectAll('.tool-download-svg')
                .data([null])
                .join('li')
                .call(function (s) { return toolDownloadSVGRender(s); });
            // chart
            var chartS = layouterS
                .selectAll('svg.chart-parcoord')
                .data([chartWindowD])
                .join('svg')
                .call(function (s) { return chartParcoordRender(s); });
            layouterS
                .on('boundschange.chartwindowparcoords', function () { return chartParcoordRender(chartS); })
                .call(function (s) { return layouterCompute(s); });
        });
    };
    WindowChartParcoordRenderer.prototype.addFinalListeners = function () {
        if (this.addedListeners)
            return;
        var instance = this;
        this.selection.on('resize.final', function () { instance.renderWindow(); });
    };
    return WindowChartParcoordRenderer;
}());

export { HorizontalAlignment, LegendOrientation, LegendPosition, Orientation, ScatterPlot, VerticalAlignment, WindowChartParcoordRenderer, arrayEquals, arrayIs, arrayIs2D, arrayPartition, axisBottomRender, axisData, axisLeftRender, axisSequenceRender, boundRegex, calcDefaultScale, chartBarData, chartBarGroupedData, chartBarGroupedHoverAxisTick, chartBarGroupedHoverBar, chartBarGroupedHoverLegendItem, chartBarGroupedRender, chartBarHoverBar, chartBarRender, chartBarStackedData, chartBarStackedHoverAxisTick, chartBarStackedHoverBar, chartBarStackedHoverLegendItem, chartBarStackedRender, chartBaseRender, chartCartesianAxisRender, chartCartesianData, chartDownload, chartLegendPosition, chartLineData, chartLineHoverLegendItem, chartLineHoverLine, chartLineHoverMarker, chartLineRender, chartParcoordRender, chartPointData, chartPointHoverLegendItem, chartPointRender, chartWindowBarAutoFilterCategories, chartWindowBarAutoResize, chartWindowBarData, chartWindowBarGroupedAutoFilterCategories, chartWindowBarGroupedAutoFilterSubcategories, chartWindowBarGroupedAutoResize, chartWindowBarGroupedData, chartWindowBarGroupedRender, chartWindowBarRender, chartWindowBarStackedAutoFilterCategories, chartWindowBarStackedAutoFilterSubcategories, chartWindowBarStackedAutoResize, chartWindowBarStackedData, chartWindowBarStackedRender, chartWindowLineAutoResize, chartWindowLineData, chartWindowLineRender, chartWindowPointData, circleEquals, circleFitStroke, circleFromAttrs, circleFromString, circleInsideRect, circleMinimized, circleOutsideRect, circlePosition, circleRound, circleToAttrs, circleToString, convertToPx, elementComputedStyleWithoutDefaults, elementData, elementIs, elementRelativeBounds, elementSVGPresentationAttrs, findMatchingBoundsIndex, formatWithDecimalZero, isSelection, isTransition, layouterCompute, layouterRender, legendCreateItems, legendData, legendRender, matchesBounds, menuDropdownRender, menuToolsRender, parcoordData, pathCircle, pathLine, pathRect, positionEquals, positionFromAttrs, positionFromString, positionRound, positionToAttrs, positionToString, positionToTransformAttr, rectBottom, rectBottomLeft, rectBottomRight, rectCenter, rectEquals, rectFitStroke, rectFromAttrs, rectFromSize, rectFromString, rectLeft, rectMinimized, rectPosition, rectRight, rectRound, rectToAttrs, rectToString, rectToViewBox, rectTop, rectTopLeft, rectTopRight, resizeEventListener, seriesBarCreateBars, seriesBarData, seriesBarGroupedCreateBars, seriesBarGroupedData, seriesBarGroupedRender, seriesBarJoin, seriesBarRender, seriesBarStackedCreateBars, seriesBarStackedData, seriesBarStackedRender, seriesCheckboxCreateCheckboxes, seriesCheckboxData, seriesCheckboxJoin, seriesCheckboxRender, seriesConfigTooltipsData, seriesConfigTooltipsHandleEvents, seriesLabelBar, seriesLabelBarCreateLabels, seriesLabelBarData, seriesLabelCreateLabels, seriesLabelData, seriesLabelJoin, seriesLabelRender, seriesLineData, seriesLineRender, seriesPointCreatePoints, seriesPointData, seriesPointJoin, seriesPointRender, sizeEquals, sizeFromAttrs, sizeFromString, sizeRound, sizeToAttrs, sizeToString, textAlignHorizontal, textAlignVertical, textOrientation, toolDownloadSVGRender, toolFilterNominalData, toolFilterNominalRender, toolbarRender, tooltip, tooltipContent, tooltipHide, tooltipPosition, tooltipSelectOrCreate, tooltipShow, v4 as uuid, windowChartBaseRender, windowChartParcoordData };
//# sourceMappingURL=respvis.js.map
