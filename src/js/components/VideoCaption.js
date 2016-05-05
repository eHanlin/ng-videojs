
(function( angular, app ){

  app.factory( 'VideoCaption', function(){

    return videojs.VideoCaption = videojs.Component.extend({

      init:function( player, options, ready ){

        vjs.Component.prototype.init.call( this, player,options, ready );

        var $videoCaption = this.$content = $( "<div class='video-caption'></div>" );

        player.on( 'fullscreenchange', function(){

          if ( this.isFullScreen() ) {

            $videoCaption.css( 'font-size', 'xx-large' );

          } else {

            $videoCaption.css( 'font-size', 'medium' );
          }
        });

        $videoCaption.css({
          "text-align": "center",
          "bottom": "36px",
          "position": "absolute",
          "color": "white",
          "font-size": "large",
          "left": "0px",
          "right": "0px"
        });


        $( this.el() ).css({
          "position":"absolute",
          "left":"0px",
          "right":"0px",
          "bottom":"0px"
        });

        $videoCaption.appendTo( this.el() );

      },

      setContent:function( content ){

        if ( content != this.lastContent_ ) {

          this.$content.html( content );
          this.lastContent_ = content;

        }
      }

    });

  });

})( angular, app );

