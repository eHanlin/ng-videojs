
(function( angular, app ) {

  app.directive( 'ngCaption', function(){

    return {

      scope:{
        'caption':'=ngCaption',
        'current':'=current',
        'onLineClick':"&"
      },

      template:[
          '<table>' +
          '<tr  ng-repeat="line in caption" ng-click="onLineClick()">' +
            '<td class="first"><i class="glyphicon glyphicon-play-circle"></i></td>' +
            '<td><span ng-bind-html="line.data"></span></td>'  +
          '</tr>' +
          '</table>'].join(''),

      link:function( scope, element, attrs, ctrl ){

        var $element = $( element );

        scope.$watch( 'ready', function () {
        	
          var clear = scope.$watch( 'current', function( current, prev ){

            var $p = element.find( 'tr' );

            if ( prev ) {
              $p.
              eq( prev.index ).
              removeClass( 'active' );
            }

            if ( current ) {
              var currentElem = $p.
                             eq( current.index ).
                             addClass( 'active' );

              var top = $( currentElem ).offset().top - $element.offset().top - 30;
              //console.log( top, $element.scrollTop() );
              $element.scrollTop( top + $element.scrollTop() );
              
            }
          });

          scope.$watch( '$destroy', function(){

            //console.log( 'des' );
            //clear();
          });
        });

      }
    };

  });

})( angular, app );

