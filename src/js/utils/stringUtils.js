
(function( angular, app ){

  app.factory( 'stringUtils', function(){

    return {

      replaceByIndex:function( str, replaceStr, start, end ){

        var len = str.length;

        var endStr = str.substring( end , len );
        var startStr = str.substring( 0 , start - 1 );

        return startStr + replaceStr + endStr;
      }
    };

  });

})( angular, app );

