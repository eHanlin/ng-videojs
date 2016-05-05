
(function( angular, app ){

  var parser = {

    keyAndVal:function( line ){

      return line.match( /[ ]*([^ ]*)[ ]*=[ ]*(.*)[ ]*/ );
    },

    note:function( line ){

      // key = val
      var results = this.keyAndVal( line ), note = false;

      if ( results && results.length >= 3 ) note = { key:results[1], value:results[2] };

      return note;

    },

    rNotSpaceLine:/^.+=.+$/,

    notes:function( doc ){

      var result = {}, _this = this;

      angular.forEach( doc.split( "\n" ), function( line ){

        if ( _this.rNotSpaceLine.test( line ) ) {

          var note = _this.note( line );
          note && ( result[ note.key ] = note );

        }
      });

      return result;

    },

    index:function( line ){

      var results = this.keyAndVal( line ), number, values, result = null;

      if ( results && results.length >= 3 ) {

        number = results[1];

        //[3,4,key2] [9,10,key1]
        values =  results[2].match(/\[[ ]*\d+[ ]*,[ ]*\d+[ ]*,[^\]]+\]/g);

        var result = {
          lineNumber:parseInt( number ),
          data:[]
        }

        angular.forEach( values, function( str ){

          //[3,4,key2]
          var vals = /\[[ ]*(\d+)[ ]*,[ ]*(\d+)[ ]*,[ ]*([^\]]+)[ ]*\]/.exec( str );

          if ( vals.length >= 4 )
            result.data.push({
              startIndex:parseInt( vals[1] ),
              endIndex:parseInt( vals[2] ),
              key:vals[3]
            });

        });

      }

      return result;
    },

    indexes:function( doc, notes ){

      var results = {}, _this = this;

      angular.forEach( doc.split( '\n' ), function( line ){

        if ( _this.rNotSpaceLine.test( line ) ){

          var index = _this.index( line );
          results[ index.lineNumber ] = index;

          if ( notes ) {

            angular.forEach( index.data, function( indexData ){

              indexData.data = notes[indexData.key];

            });


            index.data.sort(function( current, next ){
              return current.endIndex > next.endIndex;
            });
          }
        }
        
      });

      return results;
    }
  };


  app.factory( 'properNoun', [ '$http', '$q', function( $http, $q ){

    /*
    var deferr = $http.get( "video/notes.txt" );

    deferr.success(function( data ){

      console.log( parser.notes( data ) );
    });

    var deferr1 = $http.get( "video/noteIndex.txt" );

    deferr1.success(function( data ){

      console.log( parser.indexes( data ) );
    });*/


    return {

      load:function( noteFile, indexFile ){

        var deferred = $q.defer();

        $q.all( [ $http.get( noteFile ), $http.get( indexFile ) ] )
          .then(function( data ){

            var notes = parser.notes( data[0].data );
            var indexes = parser.indexes( data[1].data, notes );


            deferred.resolve( indexes );
            //deferred.resolve( [notes, indexes] );

          },function(){

             deferred.reject();
          });

        return deferred.promise;

      }
    
    };

  }]);

})( angular, app );

