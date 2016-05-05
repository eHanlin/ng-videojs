
(function( angular, app ){

  var bindClickedChapter = function( chapterProgress , $div, chapter ){

    $div.on( 'click', function(){

      chapterProgress.clickedLastChapter = chapter;
      chapterProgress.trigger( 'clickChapter' );
    });
  };

  var setupStyle = function( $div, left ){

    $div.css({
      left:left + "%",
      cursor:"pointer",
      width:"12px",
      //bottom:"3.9em",
      borderRadius:"5px",
      //bottom:"3.0em",
      bottom:"0px",
      background:"white",
      position:"absolute",
      height:"8px",
      border:"1px solid black"
    });

  };

  var fixInaccuracy = function( player, left ){

    var playerElem = player.el(),

    $playerElem = $( playerElem ),
    $handle = $playerElem.find( ".vjs-seek-handle" ),
    $controlBar = $playerElem.find( ".vjs-progress-control" );

    return ( $controlBar.width() - $handle.width() ) / $controlBar.width() * left;
    
  };

  var createTooltip = function(){

    var $div = $( $.parseHTML( '<div></div>' ) );

    $div.css({
      'position':'absolute',
      'bottom':'20px',
      'width':'100px',
      'left':'-50px',
      'text-align':'center',
      'color':'white',
      'background':'black',
      'padding':'5px',
      'border-radius':"4px"
    });

    return $div;
  };

  app.factory( 'ChapterProgress', function(){

     return videojs.ChapterProgress = videojs.Component.extend({

      init:function( player, options, ready ){

        vjs.Component.prototype.init.call( this, player, options, ready );

        var $tip = createTooltip();

        $( this.el() ).on( 'mouseover', 'div.chapter-hover', function(){
          
          $tip.html( $(this).attr('alt') );
          $tip.appendTo( $(this) );

        }).on( 'mouseout', 'div.chapter-hover', function(){

          $tip.detach();

        }).css({
          "position":"absolute",
          "left":"0px",
          "right":"18px"
        });

      },

      addChapters:function( chapters ){

        //console.log( chapters );

        this.chapters_ = chapters;

      },

      refresh:function(){

        var chapters = this.chapters_, _this = this,

        player = this.player();


        $( this.el() ).empty();

        if ( !chapters ) return;

        for ( var i = 0; i< chapters.length; i++ ) {

          var $div = $($.parseHTML( "<div class='chapter-hover'></div>" ));

          var chapter = chapters[i];


          var left = ( chapter.startTime / 1000 ) / player.duration() * 100;

          //left = fixInaccuracy( player, left );

          $div.attr( "alt", chapter.data );

          setupStyle( $div, left );
 
          this.el().appendChild( $div.get( 0 ) );

          bindClickedChapter( this, $div, chapter );
        }

      }
    });
  

  });

})( angular, app);

