
(function( angular, app ){

  app.factory( 'ControlBarCaptionBtn', function(){

    return videojs.ControlBarCaptionBtn = videojs.Component.extend({

      init:function( player, options, ready ){

        vjs.Component.prototype.init.call( this, player, options, ready );

        this.el().id = "abc";

        $( this.el() ).on( 'click', function(){

        })
        .addClass( "vjs-captions-button" )
        .addClass( "vjs-menu-button" )
        .addClass( "vjs-control " );

      },

      focus:function(){

        var $el = $( this.el() );
        $el.css('opacity','1');
        this.hasFocus_ = true;
      },

      hasFocus_:true,

      hasFocus:function(){
        return this.hasFocus_;
      },

      unfocus:function(){

        var $el = $( this.el() );
        $el.css('opacity','0.3');
        this.hasFocus_ = false;
      }
    });

  });

})( angular, app );

