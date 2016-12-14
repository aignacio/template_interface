var controller_index = angular.module('controller_index', ['ui.bootstrap']);

controller_index.controller('MainController', ['$scope', function($scope) {
    $scope.tagline = 'Teste @aignacio!';
}]);
