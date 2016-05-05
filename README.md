
ngVideoJs
====================


## Dependency

* angularjs
* ngSanitize
* videojs

## Install

```
bower install ng-videojs
```

## Run Server

Install some Dependencies.

```
bower install
```

The server need support `Range` header.( http-server or nginx or apache ... )

## Usage

html

```html
<div ng-video-js style="width:100%;height:350px;" sources="sources"></div>
```

js

```js
var app = angular.module( 'myApp',['ngVideoJs']);

app.controller('videoCtrl', function( $scope ){
  $scope.sources = [
      {src:"video/2-1-3_atom.mp4",type:"video/mp4"},
      {src:"video/2-1-3_atom.ogv",type:"video/ogg"}
  ];
});
angular.bootstrap( document, [app.name] );
```

## doc

* [attribute](../blob/master/doc/attribute.md)
* [event](../blob/master/doc/event.md)
* [method](../blob/master/doc/method.md)


## Build Production

```bash
gulp
```
