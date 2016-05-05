
(function( angular, app ){

  app.factory( "srt", [ '$http', '$q', function ( $http, $q ) {

    var strToTimeSec = function( timeStr ){

      var time = timeStr.split( /[:,]/ );

      var hour = Number( time[0] ) * 3600000;
      var min = Number( time[1] ) * 60000;
      var sec = Number( time[2] ) * 1000 + Number( time[3] );

      return hour  + min  + sec;
    };

    var parseTimeLine = function( timeStr ){

      var timeArray = timeStr.split( /\ +-->\ +/ );

      var startTime = strToTimeSec( timeArray[0] );
      var endTime = strToTimeSec( timeArray[1] );

      if ( startTime > endTime ) {
        var tmp = endTime;
        endTime = startTime;
        startTime = tmp;
      }

      return {
        startTime:startTime,
        endTime:endTime
      };
    };

    var parse = function( lines ){

      var data = [];
      var titles = [];


      for ( var i = 0; i< lines.length ; i++ ) {


        var content = lines[i].split( "\n" );

        var srt_info = angular.extend( {data:content[1],index:Number(i)}, parseTimeLine( content[0] ) );

        if ( /\[[^\]]+\]/g.test( content ) ) titles.push( srt_info );

        srt_info.parentId = titles.length;

        data.push( srt_info );


      }

      return {data:data,titles:titles};
    };

    var search = function( number, des ) { 
     
      var low = 0;
      var upper = number.length - 1;
     
      while ( low <= upper ) { 
     
        var mid;

        if ( (number[upper].startTime - number[low].startTime) != 0 )

          mid = parseInt((upper - low) * (des - number[low].startTime) / (number[upper].startTime - number[low].startTime)) + low;
        else
          mid = low;

        //console.log( number[upper].startTime , number[low].startTime );
        //console.log(number[upper].startTime - number[low].startTime);
     
        if (( mid < low ) || ( mid > upper )) break;

        if (  des >= number[mid].startTime && des <= number[mid].endTime ) return mid;
     
        else if ( des < number[mid].startTime ) upper = mid - 1;
     
        else if ( des > number[mid].startTime ) low = mid + 1;
     
        //else return mid;
     
      }
     
      return -1; 
    };


  	return {

      createJsonpFun_:function( callbackName, callback ){

        var layers = callbackName.split( "." );

        var current = window;

        for ( var i = 0 ; i < layers.length ;  i++ ) {

          if ( ( layers.length - 1 ) <= i ) {

            (function( layer ){

              current[ layer ] = function(){

                var result = [];

                for ( var index = 0; index < arguments.length; index++ ) result.push( arguments[index] );

                callback && callback( result );
                delete current[ layer ];
              };

            })( layers[i] );

          } else {

            current[ layers[i] ] = current[ layers[i] ] ? current[ layers[i] ]: {};
            current = current[ layers[i] ];
          }
        }

      },

      get:function( src, jsonp ){

        var srt, _this = this;

        if ( jsonp ) {

          //$http.jsonp( src + "?callback=" + jsonp );
          var scriptDefer = $q.defer();
          srt = scriptDefer.promise;

          _this.createJsonpFun_( jsonp, function( result ){

            scriptDefer.resolve( result );
          });

          $.getScript( src + "?callback=" + jsonp ).fail(function(){scriptDefer.reject();});

        } else {

          srt = $http.get( src );
        }
        
        var deferred = $q.defer();

        //ehanlin.srt = function(){console.log( arguments );};

        srt.then(function( data ){

          if ( $.isArray( data ) ) data = data[0].join( '\n' );

          else data = data.data;

          var filter_data = data.replace( /\r/g, "" );

          var lines = filter_data.split( /\n\d+\n/ );

          if ( lines.length ) lines[0] = lines[0].replace( /^\d+\n/,"" );

          //console.log( data );

          var srt_data = parse( lines );

          //console.log(srt_data);
          //window.data = data;
          deferred.resolve( srt_data );

        },function(){

          deferred.reject("");
        });

        return deferred.promise;
      },

      findOne:function( srt_info, currentTime ){

        var index = search( srt_info, currentTime );

        return index < 0 ? null: srt_info[ index ];
      }
    };
  }]);


})( angular, app );

