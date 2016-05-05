
(function ( angular, app ) {

  app.directive( 'ngVideoJs', [ '$timeout', 'srt', 'ControlBarCaptionBtn', 'ChapterProgress', 'VideoCaption', 'properNoun', 'stringUtils', '$q', function( $timeout, srt, ControlBarCaptionBtn, ChapterProgress, VideoCaption, properNoun, stringUtils, $q ){


    return {

      template:[
        '<video id="example_video_1" class="video-js vjs-default-skin" controls preload="auto" width="100%" height="100%" poster="{{poster}}" >',
          //'<source src="{{source.src}}" type="{{source.type}}" ng-repeat="source in sources" />',
          //'<track kind="captions" src="{{track.src}}" srclang="{{track.srclang}}" label="{{track.label}}" ng-repeat="track in tracks"/>',
        '</video>'
      ].join(''),

      scope:{
        autoplay:"@",
        sources:"=",
        tracks:"=",
        caption:"=?",
        currentLine:"=?",
        timeRate:"=?",
        showTextTrackDisplay:"=?",
        showCaptionBtn:"=",
        noteSrc:"=noteSrc",
        onFullScreen:"&",
        onCancelFullScreen:"&",
        onCaptionButtonClicked:"&",
        onPlay:"&",
        onFirstPlay:"&",
        onTimeupdate:"&",
        onEnded:"&",
        onTrackLoaded:"&",
        onTrackFail:"&",
        onChapterProgressClicked:"&",
        jsonp:"@",
        poster:"=",
        setFns:"&"
      },

      link:function( scope, element, attrs ){

        var caption, myPlayer, chapterProgress, controlBar, textTrackDisplay, videoCaption, hasFirstPlay = false,readyBeforeMoveTo;

        var events = {

          timeupdate:function(){

            var isAvailable = false;

            if ( caption ) {
              var currentLine = srt.findOne( caption.data, myPlayer.currentTime() * 1000 )
              scope.currentLine = currentLine;
            }

            if ( scope.currentLine ) {
              currentLine && videoCaption.setContent( currentLine.data );
            } else {

              videoCaption.setContent( "" );
            }

            /*if ( currentLine ) {

              isAvailable = true;
            }

            if ( !isAvailable ) scope.currentLine = {};*/

            scope.timeRate = ( myPlayer.currentTime() / myPlayer.duration() * 100 ).toFixed( 2 );

            scope.onTimeupdate();

            if ( scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest' )

              scope.$apply();

          },

          ended:function(){

            videoCaption.setContent( "" );
            scope.currentLine = null;
            scope.onEnded();
            scope.$apply();
          },

          firstplay:function(){


            $timeout(function(){

              if ( chapterProgress )

                chapterProgress.refresh();

            }, 200);

            scope.onFirstPlay();

          },

          fullscreenchange:function(){
           // console.log( myPlayer.isFullScreen() );
           //
            if ( angular.isFunction( scope.onFullScreen ) && myPlayer.isFullScreen() ) {

              scope.onFullScreen();

            } else if ( angular.isFunction( scope.onCancelFullScreen ) && !myPlayer.isFullScreen() ) {

              scope.onCancelFullScreen();
            }

            scope.$apply();
          },

          loadedmetadata:function(){

            //events.firstplay();
            $timeout(function(){

              if ( chapterProgress )

                chapterProgress.refresh();

            }, 200);

          },

          play:function(){

            scope.onPlay();
            scope.$apply();
          }
        };

        scope.$on( '$destroy', function(){
          if (myPlayer) {
            myPlayer.dispose();
          }
        });

        scope.$watch( 'sources', function( currentSources ){

          if ( !currentSources ) return ;

          if ( typeof scope.showTextTrackDisplay == 'undefined' ) scope.showTextTrackDisplay = true

          var $video = $( element.find( 'video' ) );

          $video.find('source').remove();
          if (scope.autoplay) $video.prop('autoplay', true);

          for ( var i in scope.sources ) {
            var source = document.createElement( 'source' );
            source.type = scope.sources[i].type;
            source.src = scope.sources[i].src;
            $video.append( source );
          }

          $timeout(function(){

            if (myPlayer)
              $video.get(0).load();
            else
              myPlayer = videojs( element.find('video').attr( 'id' ) );
            //myPlayer = videojs( element.find('video').attr( 'id' ) );

            textTrackDisplay = myPlayer.getChild("textTrackDisplay");

            controlBar = myPlayer.getChild( 'controlBar' );

            chapterProgress = controlBar.addChild( 'ChapterProgress' );

            videoCaption = textTrackDisplay.addChild( 'VideoCaption' );

            var captionBtn = controlBar.addChild( 'ControlBarCaptionBtn' );

            captionBtn.on( 'click', function(){


              if ( !this.hasFocus() )
                this.focus();
              else
                this.unfocus();

              scope.onCaptionButtonClicked({showTextTrackDisplay:scope.showTextTrackDisplay});
              scope.$apply();
            });



            if ( scope.tracks && scope.tracks.length ) {

              //var deferred = properNoun.load( scope.noteSrc.note, scope.noteSrc.index );
              //var promise = srt.get( scope.tracks[0].src );

              var promises = [ srt.get( scope.tracks[0].src, scope.jsonp ) ];

              if ( scope.noteSrc ) {
                promises.push( properNoun.load( scope.noteSrc.note, scope.noteSrc.index ) );
              }

              $q.all( promises )
                .then(function( params ){

                  var cap = params[0];

                  scope.caption = caption = cap;

                  chapterProgress.addChapters( cap.titles );

                  if ( params.length > 1 ) {

                    var srtIndexes = params[1];

                    angular.forEach( cap.data, function( val, index ){

                      var lineNum = index + 1;

                      if( srtIndexes[ lineNum ] ) {

                        var data = srtIndexes[ lineNum ].data;
                        //console.log( val );

                        for ( var i = data.length - 1; i >= 0 ; i--) {

                          var text = $( "<div></div>" ).text( data[i].data.value ).html();

                          var html = "<span href='' style='position:relative;' class='proper-noun' alt='" + text + "'>" + val.data.substring( data[i].startIndex - 1, data[i].endIndex ) + "</span>";

                          val.data = stringUtils.replaceByIndex( val.data, html, data[i].startIndex, data[i].endIndex );
                          //console.log( data[i] );
                        }
                       // console.log( val );
                      }

                      //scope.$apply();
                    });  
                  }

                  if ( scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest' ) 

                    scope.$apply();

                  scope.onTrackLoaded({caption:caption});

              }, function(){
                scope.onTrackFail();
              });

              /*promise.then(function( cap ){

                scope.caption = caption = cap;

                chapterProgress.addChapters( cap.titles );

                deferred.then(function( srtIndexes ){

                  //console.log( srtIndexes );


                  angular.forEach( cap.data, function( val, index ){

                    var lineNum = index + 1;

                    if( srtIndexes[ lineNum ] ) {

                      var data = srtIndexes[ lineNum ].data;
                      //console.log( val );

                      for ( var i = data.length - 1; i >= 0 ; i--) {

                        val.data = stringUtils.replaceByIndex( val.data, "<a href=''>" + val.data.substring( data[i].startIndex - 1, data[i].endIndex ) + "</a>", data[i].startIndex, data[i].endIndex );
                        //console.log( data[i] );
                      }
                     // console.log( val );
                    }
                    
                  });


                    //scope.$apply();
                });  

                if ( scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest' ) 

                  scope.$apply();

              });*/

            }

            var moveTo = function( line ){

              if ( !hasFirstPlay ) {

                myPlayer.play();
                readyBeforeMoveTo = line;
                return ;
              }

              var moveTime = /(ipad)|(android)/i.test( navigator.userAgent )? line.startTime/1000 + 0.01 : line.startTime/1000;

              myPlayer.currentTime( moveTime.toFixed(1) );
              scope.timeRate = ( myPlayer.currentTime() / myPlayer.duration() * 100  ).toFixed( 2 );

              var content = "";

              if( line ) {

                content = line.data;
              }

              videoCaption.setContent( content );
            };

            //myPlayer = videojs( element[0] );
            //myPlayer = videojs( 'example_video_1' );

            chapterProgress.on( 'clickChapter', function(){

              moveTo( this.clickedLastChapter );

              scope.onChapterProgressClicked();

              if ( scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest' )
                scope.$apply();
            });

            scope.$watch( 'showCaptionBtn', function( showCaptionBtn ){
              if ( showCaptionBtn ) captionBtn.show(); else captionBtn.hide();
            });

            scope.$watch( 'showTextTrackDisplay', function( showTextTrackDisplay ){

              if ( showTextTrackDisplay ) textTrackDisplay.show(); else textTrackDisplay.hide();
            });

            myPlayer.on( 'timeupdate', events.timeupdate );
            myPlayer.on( 'firstplay', events.firstplay );
            myPlayer.on( 'loadedmetadata', events.loadedmetadata );
            myPlayer.on( 'fullscreenchange', events.fullscreenchange );
            myPlayer.on( 'ended', events.ended );
            myPlayer.on( 'play', events.play );
            myPlayer.on( 'firstplay', function(){

              hasFirstPlay = true;
  
              if ( readyBeforeMoveTo ) {
 
                //support video?
                if ( !!document.createElement('video').canPlayType ) {
                  moveTo( readyBeforeMoveTo );
                  readyBeforeMoveTo = null;
                } else {

                  $timeout(function(){

                    moveTo( readyBeforeMoveTo );
                    readyBeforeMoveTo = null;
                  },1000);
                }
              }

            });
            myPlayer.dimensions( "100%", "100%" );
            $( element ).find(".vjs-menu-item").eq(2).trigger("click");

            scope.setFns({
              fns:{
                moveTo:moveTo,
                currentTime:function(){
                  return myPlayer.currentTime();
                },
                duration:function(){
                  return myPlayer.duration();
                }
              }
            });

          },200);
        });

      }
    };

  }]);

})( angular, app );

