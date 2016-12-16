var controller_index = angular.module('controller_index', ['ui.bootstrap']);

controller_index.controller('ctrlIndex', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {
  $http({method: 'GET', url: '/info/application'}).
    then(function(response) {
      $scope.applicationName = response.data.name;
    }, function(response) {
      $scope.data = response.data || "Request failed";
      $scope.status = response.status;
      console.log($scope.status);
  });

  $scope.class = "untoggled";
  $scope.toggleSideBar = function(){
    if ($scope.class === "untoggled")
      $scope.class = "toggled";
    else
      $scope.class = "untoggled";
  };

  $scope.user = $window.user.split(' ');
  $scope.user = $scope.user[0];

  $scope.logout = function(){
    $window.location.href = '/logout';
  };
}]);
