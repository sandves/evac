function beaconDirective(a){return{scope:{distance:"=",name:"@",x:"="},restrict:"AE",templateUrl:"app/beacons/directives/beacon.html",link:function(b,c,d){var e=angular.element(a);b.getWindowDimensions=function(){return{h:e.height(),w:e.width()}},b.$watch(b.getWindowDimensions,function(a,c){b.windowHeight=a.h},!0),b.windowHeight=500,b.$watch("distance",function(a){var d=d3.scale.linear().domain([0,12]).range([0,b.windowHeight])(a),e=new TimelineLite;e.add(TweenLite.to(c.find(".beacon"),2,{y:d,x:b.x,ease:"easeOutExpo"})),e.play()})}}}!function(){"use strict";function a(a){a.otherwise({redirectTo:"/"})}function b(a,b){a.$on("$routeChangeError",function(a,c,d,e){if("AUTH_REQUIRED"===e){var f=c.$$route.originalPath;b.path("/login"+f)}})}angular.module("app",["ngRoute","firebase","app.auth","app.core","app.landing","app.layout","app.beacons","app.floorplan"]).config(a).run(b),a.$inject=["$routeProvider"],b.$inject=["$rootScope","$location"]}(),function(){"use strict";angular.module("app.auth",[])}(),function(){"use strict";angular.module("app.beacons",["beacon","btford.socket-io","angularMoment"])}(),function(){"use strict";angular.module("app.core",[])}(),function(){"use strict";angular.module("app.floorplan",[])}(),function(){"use strict";angular.module("app.landing",[])}(),function(){"use strict";angular.module("app.layout",[])}(),function(){"use strict";function a(a,b,c){function d(a){return b.register(a).then(function(){return f.login(a)}).then(function(){return b.sendWelcomeEmail(a.email)})["catch"](function(a){f.error=a})}function e(d){return b.login(d).then(function(){c.fallback?a.path("/"+c.fallback):a.path("/floorplan")})["catch"](function(a){f.error=a})}var f=this;f.error=null,f.register=d,f.login=e}angular.module("app.auth").controller("AuthController",a),a.$inject=["$location","authService","$routeParams"]}(),function(){"use strict";function a(a,b){function c(a){return h.$createUser(a)}function d(a){return h.$authWithPassword(a)}function e(){h.$unauth()}function f(){return h.$getAuth()}function g(a){b.emails.push({emailAddress:a})}var h=a(b.root),i={firebaseAuthObject:h,register:c,login:d,logout:e,isLoggedIn:f,sendWelcomeEmail:g};return i}angular.module("app.auth").factory("authService",a),a.$inject=["$firebaseAuth","firebaseDataService"]}(),function(){"use strict";function a(){return{templateUrl:"app/auth/authForm.html",restrict:"E",controller:b,controllerAs:"vm",bindToController:!0,scope:{error:"=",formTitle:"@",submitAction:"&"}}}function b(){var a=this;a.user={email:"",password:""}}angular.module("app.auth").directive("gzAuthForm",a)}(),function(){"use strict";function a(a){a.when("/login/:fallback?",{templateUrl:"app/auth/login.html",controller:"AuthController",controllerAs:"vm"})}function b(a,b,c,d){function e(a){return-1!==d.indexOf(a)}c.root.onAuth(function(c){!c&&e(a.path())&&(b.logout(),a.path("/login"))})}angular.module("app.auth").config(a).run(b),a.$inject=["$routeProvider"],b.$inject=["$location","authService","firebaseDataService","PROTECTED_PATHS"]}(),function(){"use strict";function a(a,b,c){var d=this;d.debug=!1,d.rssi=null,d.distance=null,d.connected=!1,d.lastUpdate=null,d.connectionState="closed",d.url="",d.dist=0,d.prediction=0,b.on("beacon-updated",function(a){d.rssi=a.rssi+"dBm";var b="unknown";"undefined"!=typeof a.distance&&(d.dist=a.distance<10?a.distance:10,d.prediction=a.prediction<10?a.prediction:10,b=a.distance.toFixed(3)+"m");var e=c.getRange(a.txPower,a.rssi);isNaN(e)?e="unknown":e+="m",d.distance=b+" ("+e+")",d.lastUpdate=new Date,d.url=a.url}),b.on("connected",function(){d.connected=!0,d.connectionState="open"}),b.on("disconnect",function(){d.connected=!1,d.connectionState="closed",d.rssi=null,d.distance=null}),a.$on("$destroy",function(){b.disconnect()})}angular.module("app.beacons").controller("BeaconsController",a),a.$inject=["$scope","socket","beaconService"]}(),function(){"use strict";function a(){function a(a,b){if(0===b)return-1;var c=1*b/a;if(1>c)return Math.pow(c,10);var d=.89976*Math.pow(c,7.7095)+.111;return d}function b(a,b){var c=a-b,d=Math.pow(10,c/10),e=Math.sqrt(d)/100;return parseFloat(e.toFixed(3))}var c={calculateAccuracy:a,getRange:b};return c}angular.module("app.beacons").factory("beaconService",a)}(),function(){"use strict";function a(a){a.when("/beacons",{templateUrl:"app/beacons/beacons.html",controller:"BeaconsController",controllerAs:"vm",resolve:{user:b}})}function b(a){return a.firebaseAuthObject.$requireAuth()}angular.module("app.beacons").config(a),a.$inject=["$routeProvider"],b.$inject=["authService"]}();var app=angular.module("beacon",[]);beaconDirective.$inject=["$window"],app.directive("beacon",beaconDirective),function(){"use strict";angular.module("app.core").constant("FIREBASE_URL","https://burning-inferno-9647.firebaseio.com/").constant("SOCKET_URL","http://192.168.5.120:3000").constant("PROTECTED_PATHS",["/beacons","/floorplan"])}(),function(){"use strict";function a(a){var b=new Firebase(a),c={root:b,users:b.child("users"),emails:b.child("emails")};return c}angular.module("app.core").factory("firebaseDataService",a),a.$inject=["FIREBASE_URL"]}(),function(){"use strict";function a(a,b){var c=io.connect(b);return a({ioSocket:c})}angular.module("app.core").factory("socket",a),a.$inject=["socketFactory","SOCKET_URL"]}(),function(){"use strict";function a(a){a.when("/floorplan",{templateUrl:"app/floorplan/floorplan.html",controller:"FloorplanController",controllerAs:"vm",resolve:{user:b}})}function b(a){return a.firebaseAuthObject.$requireAuth()}angular.module("app.floorplan").config(a),a.$inject=["$routeProvider"],b.$inject=["authService"]}(),function(){"use strict";function a(){var a={bindToController:!0,templateUrl:"app/floorplan/directives/room.html",controller:b,controllerAs:"vm",restrict:"EA",scope:{room:"="}};return a}function b(){var a=this,b=a.room;b.beacons.length>0?a.roomStyle={width:b.width+"px",height:b.height+"px",top:b.top+"px",left:b.left+"px","line-height":b.height+"px",background:"#000000"}:a.roomStyle={width:b.width+"px",height:b.height+"px",top:b.top+"px",left:b.left+"px","line-height":b.height+"px"}}angular.module("app.floorplan").directive("evacRoom",a)}(),function(){"use strict";function a(a,b){function c(){d.rooms[3].name="stian"}var d=this;d.rooms=[{name:"Foo",address:"192.168.5.111",width:100,height:50,top:20,left:20,beacons:[]},{name:"Bar",address:"192.168.5.112",width:100,height:100,top:100,left:20,beacons:[]}],d.test=c;b.on("beacon",function(a){for(var b=a,c=0;c<d.rooms.length;c++)d.rooms[c].address in b&&(d.rooms[c].beacons=b[d.rooms[c].address])}),b.on("connected",function(){console.log("connected")}),b.on("disconnect",function(){console.log("disconnected")}),a.$on("$destroy",function(){b.disconnect()})}angular.module("app.floorplan").controller("FloorplanController",a),a.$inject=["$scope","socket"]}(),function(){"use strict";function a(a){a.when("/",{templateUrl:"app/landing/landing.html"})}angular.module("app.landing").config(a),a.$inject=["$routeProvider"]}(),function(){"use strict";function a(){var a={templateUrl:"app/layout/footer.html",restrict:"E",scope:{}};return a}angular.module("app.layout").directive("gzFooter",a)}(),function(){"use strict";function a(){return{templateUrl:"app/layout/navbar.html",restrict:"E",scope:{},controller:b,controllerAs:"vm"}}function b(a,b){function c(){b.logout(),a.path("/")}function d(b){return b===a.path()}var e=this;e.isLoggedIn=b.isLoggedIn,e.logout=c,e.isActive=d}angular.module("app.layout").directive("gzNavbar",a),b.$inject=["$location","authService"]}();