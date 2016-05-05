
(function( app ){

  app.config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
  }]);

})( app );

