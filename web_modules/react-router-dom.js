import { c as createCommonjsModule } from './common/_commonjsHelpers-eb5a497e.js';
import { r as react } from './common/index-d0e3fe20.js';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var m,x=m||(m={});x.Pop="POP";x.Push="PUSH";x.Replace="REPLACE";var y=function(a){return a};function A(a){a.preventDefault();a.returnValue="";}
function B(){var a=[];return {get length(){return a.length},push:function(b){a.push(b);return function(){a=a.filter(function(a){return a!==b});}},call:function(b){a.forEach(function(a){return a&&a(b)});}}}function D(){return Math.random().toString(36).substr(2,8)}function E(a){var b=a.pathname,g=a.search;a=a.hash;return (void 0===b?"/":b)+(void 0===g?"":g)+(void 0===a?"":a)}
function F(a){var b={};if(a){var g=a.indexOf("#");0<=g&&(b.hash=a.substr(g),a=a.substr(0,g));g=a.indexOf("?");0<=g&&(b.search=a.substr(g),a=a.substr(0,g));a&&(b.pathname=a);}return b}
function createBrowserHistory(a){function b(){var a=h.location,d=f.state||{};return [d.idx,y({pathname:a.pathname,search:a.search,hash:a.hash,state:d.usr||null,key:d.key||"default"})]}function g(a){return "string"===typeof a?a:E(a)}function t(a,d){void 0===d&&(d=null);return y(_extends({},l,{},"string"===typeof a?F(a):a,{state:d,key:D()}))}function v(a){n=a;a=b();q=a[0];l=a[1];c.call({action:n,location:l});}function w(a,d){function c(){w(a,d);}var k=m.Push,C=t(a,d);if(!e.length||(e.call({action:k,
location:C,retry:c}),!1)){var b=[{usr:C.state,key:C.key,idx:q+1},g(C)];C=b[0];b=b[1];try{f.pushState(C,"",b);}catch(G){h.location.assign(b);}v(k);}}function u(a,d){function c(){u(a,d);}var b=m.Replace,k=t(a,d);e.length&&(e.call({action:b,location:k,retry:c}),1)||(k=[{usr:k.state,key:k.key,idx:q},g(k)],f.replaceState(k[0],"",k[1]),v(b));}function r(a){f.go(a);}void 0===a&&(a={});a=a.window;var h=void 0===a?document.defaultView:a,f=h.history,p=null;h.addEventListener("popstate",function(){if(p)e.call(p),
p=null;else {var a=m.Pop,d=b(),c=d[0];d=d[1];if(e.length)if(null!=c){var f=q-c;f&&(p={action:a,location:d,retry:function(){r(-1*f);}},r(f));}else;else v(a);}});var n=
m.Pop;a=b();var q=a[0],l=a[1],c=B(),e=B();null==q&&(q=0,f.replaceState(_extends({},f.state,{idx:q}),""));return {get action(){return n},get location(){return l},createHref:g,push:w,replace:u,go:r,back:function(){r(-1);},forward:function(){r(1);},listen:function(a){return c.push(a)},block:function(a){var d=e.push(a);1===e.length&&h.addEventListener("beforeunload",A);return function(){d();e.length||h.removeEventListener("beforeunload",A);}}}}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

function f(){f=Object.assign||function(a){for(var b=1;b<arguments.length;b++){var c=arguments[b],d;for(d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d]);}return a};return f.apply(this,arguments)}var k=function(a){return a};function l(a,b){if(!a)throw Error(b);}var r=react.createContext({static:!1});var v=react.createContext({outlet:null,params:k({}),pathname:"",route:null});function B$1(){return C()}function D$1(a){a=a.element;return void 0===a?react.createElement(B$1,null):a}
function x$1(a){var b=a.children;b=void 0===b?null:b;var c=a.action;c=void 0===c?m.Pop:c;var d=a.location,e=a.navigator;a=a.static;a=void 0===a?!1:a;z()?l(!1):void 0;return react.createElement(r.Provider,{children:b,value:{action:c,location:d,navigator:e,static:a}})}
function E$1(a){var b=a.basename;b=void 0===b?"":b;a=F$1(a.children);return G(a,b)}
function z(){return null!=react.useContext(r).location}function H(){z()?void 0:l(!1);return react.useContext(r).location}
function A$1(){z()?void 0:l(!1);var a=react.useContext(r).navigator,b=react.useContext(v).pathname,c=react.useRef(!1);react.useEffect(function(){c.current=!0;});return react.useCallback(function(d,e){void 0===e&&(e={});c.current?"number"===typeof d?a.go(d):(d=J(d,b),(e.replace?a.replace:a.push)(d,e.state)):
void 0;},[a,b])}function C(){return react.useContext(v).outlet}function K(a){var b=react.useContext(v).pathname;return react.useMemo(function(){return J(a,b)},[a,b])}
function G(a,b){void 0===b&&(b="");var c=react.useContext(v),d=c.route,e=c.pathname,g=c.params;b=b?L([e,b]):e;var h=H();return (d=react.useMemo(function(){return M(a,h,b)},[h,a,b]))?d.reduceRight(function(a,c){var d=c.pathname,e=c.route;return react.createElement(v.Provider,{children:e.element,value:{outlet:a,params:k(f({},g,{},c.params)),pathname:L([b,d]),route:e}})},null):null}function F$1(a){var b=[];react.Children.forEach(a,function(a){if(react.isValidElement(a))if(a.type===react.Fragment)b.push.apply(b,F$1(a.props.children));else {var c={path:a.props.path||"/",caseSensitive:!0===a.props.caseSensitive,element:a};a.props.children&&(a=F$1(a.props.children),a.length&&(c.children=a));b.push(c);}});return b}
function M(a,b,c){void 0===c&&(c="");"string"===typeof b&&(b=F(b));b=b.pathname||"/";if(c)if(c=c.replace(/^\/*/,"/").replace(/\/+$/,""),b.startsWith(c))b=b===c?"/":b.slice(c.length);else return null;a=O(a);P(a);var d=null;for(c=0;null==d&&c<a.length;++c)a:{d=b;for(var e=a[c][1],g="/",h={},I=[],n=0;n<e.length;++n){var t=e[n],u="/"===g?d:d.slice(g.length)||"/";u=Q({path:t.path,caseSensitive:t.caseSensitive,end:n===e.length-1},u);if(!u){d=null;break a}g=L([g,u.pathname]);h=f({},h,{},u.params);
I.push({route:t,pathname:g,params:k(h)});}d=I;}return d}function O(a,b,c,d,e){void 0===b&&(b=[]);void 0===c&&(c="");void 0===d&&(d=[]);void 0===e&&(e=[]);a.forEach(function(a,h){var g=L([c,a.path]),n=d.concat(a);h=e.concat(h);a.children&&O(a.children,b,g,n,h);b.push([g,n,h]);});return b}function P(a){var b=a.reduce(function(a,b){b=b[0];a[b]=R(b);return a},{});S(a,function(a,d){var c=a[2];a=b[a[0]];var g=d[2];d=b[d[0]];return a!==d?d-a:T(c,g)});}var U=/^:\w+$/,V=2,W=1,X=10,Y=-2;
function Z(a){return "*"===a}function R(a){a=a.split("/");var b=a.length;a.some(Z)&&(b+=Y);return a.filter(function(a){return !Z(a)}).reduce(function(a,b){return a+(U.test(b)?V:""===b?W:X)},b)}function T(a,b){return a.length===b.length&&a.slice(0,-1).every(function(a,d){return a===b[d]})?a[a.length-1]-b[b.length-1]:0}function S(a,b){var c=a.slice(0);a.sort(function(a,e){return b(a,e)||c.indexOf(a)-c.indexOf(e)});}
function Q(a,b){"string"===typeof a&&(a={path:a});var c=a;a=c.path;var d=c.caseSensitive;c=c.end;c=aa(a,void 0===d?!1:d,void 0===c?!0:c);d=c[1];c=b.match(c[0]);if(!c)return null;b=c[1];var e=c.slice(2);d=d.reduce(function(a,b,c){c=e[c];try{var d=decodeURIComponent(c.replace(/\+/g," "));}catch(t){d=c;}a[b]=d;return a},{});return {path:a,pathname:b,params:d}}function aa(a,b,c){var d=[],e="^("+a.replace(/^\/*/,"/").replace(/\/?\*?$/,"").replace(/[\\.*+^$?{}|()[\]]/g,"\\$&").replace(/:(\w+)/g,function(a,b){d.push(b);return "([^\\/]+)"})+")";a.endsWith("*")?(a.endsWith("/*")&&(e+="\\/?"),d.push("*"),e+="(.*)"):c&&(e+="\\/?");c&&(e+="$");return [new RegExp(e,b?void 0:"i"),d]}
function J(a,b){void 0===b&&(b="/");var c="string"===typeof a?F(a):a;a=c.pathname;var d=c.search;d=void 0===d?"":d;c=c.hash;c=void 0===c?"":c;return {pathname:a?ba(a,a.startsWith("/")?"/":b):b,search:d,hash:c}}function L(a){return a.join("/").replace(/\/\/+/g,"/")}function ba(a,b){var c=b.replace(/\/+$/,"").replace(/\/\/+/g,"/").split("/");a.replace(/\/\/+/g,"/").split("/").forEach(function(a){".."===a?1<c.length&&c.pop():"."!==a&&c.push(a);});return 1<c.length?L(c):"/"}
function useHref(a){z()?void 0:l(!1);var b=react.useContext(r).navigator;a=K(a);return b.createHref(a)}

function n(){n=Object.assign||function(a){for(var d=1;d<arguments.length;d++){var b=arguments[d],c;for(c in b)Object.prototype.hasOwnProperty.call(b,c)&&(a[c]=b[c]);}return a};return n.apply(this,arguments)}function p(a,d){if(null==a)return {};var b={},c=Object.keys(a),e;for(e=0;e<c.length;e++){var f=c[e];0<=d.indexOf(f)||(b[f]=a[f]);}return b}
function w(a){var d=a.children;a=a.window;var b=react.useRef();null==b.current&&(b.current=createBrowserHistory({window:a}));var c=b.current;a=react.useReducer(function(a,b){return b},{action:c.action,location:c.location});b=a[0];var e=a[1];react.useLayoutEffect(function(){return c.listen(e)},[c]);return react.createElement(x$1,{children:d,action:b.action,location:b.location,navigator:c})}var y$1=react.forwardRef(function(a,d){var b=a.onClick,c=a.replace,e=void 0===c?!1:c,f=a.state,g=a.target,m=a.to;a=p(a,["onClick","replace","state","target","to"]);c=useHref(m);var k=A$1(),u=H(),h=K(m);return react.createElement("a",Object.assign({},a,{href:c,onClick:function(a){b&&b(a);a.defaultPrevented||0!==a.button||g&&"_self"!==g||a.metaKey||a.altKey||a.ctrlKey||a.shiftKey||(a.preventDefault(),a=!!e||E(u)===E(h),k(m,{replace:a,state:f}));},ref:d,target:g}))});
var z$1=react.forwardRef(function(a,d){var b=a["aria-current"],c=void 0===b?"page":b;b=a.activeClassName;var e=void 0===b?"active":b;b=a.activeStyle;var f=a.caseSensitive,g=void 0===f?!1:f;f=a.className;var m=void 0===f?"":f;f=a.end;var k=void 0===f?!1:f,u=a.style;f=a.to;a=p(a,"aria-current activeClassName activeStyle caseSensitive className end style to".split(" "));var h=H(),l=K(f);h=h.pathname;l=l.pathname;g||(h=h.toLowerCase(),l=l.toLowerCase());c=(g=k?h===l:h.startsWith(l))?c:
void 0;e=[m,g?e:null].filter(Boolean).join(" ");b=n({},u,{},g?b:null);return react.createElement(y$1,Object.assign({},a,{"aria-current":c,className:e,ref:d,style:b,to:f}))});

export { w as BrowserRouter, z$1 as NavLink, D$1 as Route, E$1 as Routes };
