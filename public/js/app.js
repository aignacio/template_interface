var hero_aignacio = angular.module('superhero', ['ui.bootstrap',
                                                 'ngRoute',
                                                 'controller_index',
                                                 'controller_login',
                                                 'directive_index',
                                                 'ui.validate']);

hero_aignacio.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
  when('/dash', {
    templateUrl: 'views/pages/main.ejs',
    controller: ''
  }).
  when('/users', {
    templateUrl: 'views/pages/users.ejs',
    controller: ''
  }).
  otherwise({
    redirectTo: '/dash',
    controller: ''
  });
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);
