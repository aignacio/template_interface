var controller_login = angular.module('controller_login', ['ui.bootstrap']);

controller_login.controller('loginForm',['$scope', function($scope) {
    // function to submit the form after all validation has occurred
		$scope.submitForm = function() {
			// check to make sure the form is completely valid
			if ($scope.userForm.$valid) {
				alert('Dados cadastrados');
			}
		};
}]);
