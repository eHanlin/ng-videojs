
Attribute
================

### sources

> load video source

```js
$scope.sources = [
  {src:"video.mp4",type:"video/mp4"}
]
```

### tracks

> load caption file

```js
$scope.tracks = [ 
  {kind:"captions",src:"video/2-1-3_atom.srt",srclang:"zh",label:"中文"}
];
```

### showTextTrackDisplay

> show or hide video caption

```js
$scope.showTextTrackDisplay = false;
```

### noteSrc

> mark some texts

```js
$scope.noteSrc = {
    index:"video/noteIndex.txt",
    note:"video/notes.txt"
};
```


### time-rate

> get current progress value

```html
{{timeRate}} %
```

### current-line

> get current caption line


### autoplay

> set video to autoplay
