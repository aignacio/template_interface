var hero_aignacio = angular.module('superhero', ['ui.bootstrap',
                                                 'ngRoute',
                                                 'controller_index',
                                                 'controller_login']);

hero_aignacio.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: '/public/views/index.html',
      controller: ''
    }).
    when('/about', {
      templateUrl: '/public/views/index.html',
      controller: ''
    }).
    when('/log', {
      templateUrl: '/public/views/index.html',
      controller: ''
    }).
    otherwise({
      redirectTo: '/dash',
      controller: ''
    });
}]);
