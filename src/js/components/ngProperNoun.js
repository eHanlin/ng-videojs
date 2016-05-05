
(function( angular, app ){

  app.directive( 'ngProperNoun', function(){

    var $tipWindow = $( '<div class="tip-window"></div>' ),
        $btn = $('<button type="button" class="close" aria-hidden="true">&times;</button>'),
        $h4 = $( '<h4></h4>' ),
        $content = $( '<div></div>' );



    $tipWindow.append( $btn )
              .append( $h4 )
              .append( $content );

    $tipWindow.on( 'click', '.close' ,function(){

      $tipWindow.detach();
    }).on( 'click', function( event ){

      event.stopPropagation();
    });

    return {

      link:function( scope, element, attr ){

        var $element = $( element ), $current;

        $element.on( 'click', '.proper-noun' , function( event ){

          event.preventDefault();

          var $this = $( this );

          if( $current ) $current.removeClass( 'active' );

          $current = $this;

          $this.addClass( 'active' );

          $h4.html( $this.text() )
          $content.html( $this.attr( 'alt' ) );

          var offset = $this.offset(), top;

          if ( $this.parent().hasClass( "video-caption" ) ) {

            $tipWindow.appendTo( $this.parent().parent() );
            top = offset.top - $this.height() - $tipWindow.height() - 10;

          } else {

            $tipWindow.appendTo( document.body );
            top = offset.top + $this.height();
          }

          $tipWindow.offset({

            top:top,
            left:offset.left - ( $tipWindow.width() / 2 )
          });
          
        });

        $element.on( 'click', function( event ){


          if ( event.target && !$( event.target ).hasClass( 'proper-noun' ) ) {

            $tipWindow.detach();

            if ( $current  ) {
 
              $current.removeClass( 'active' );
              $current = null;
            }
          }

        });

      }
    };

  });

})( angular, app );

