var controller_login = angular.module('controller_login', ['ui.bootstrap',
 																													 'angular-md5']);

controller_login.controller('loginForm',['$scope', 'md5', '$http', '$location', '$window', function($scope, md5, $http, $location, $window) {
    $http({method: 'GET', url: '/info/application'}).
      then(function(response) {
        $scope.applicationName = response.data.name;
      }, function(response) {
        $scope.data = response.data || "Request failed";
        $scope.status = response.status;
        console.log($scope.status);
    });
    $scope.submitForm = function() {
			if ($scope.userForm.$valid) {
				console.log('Enviando formulário para registro...');
				$scope.user.passwd = md5.createHash($scope.user.passwd || '');
				$scope.user.passwd_ok = md5.createHash($scope.user.passwd_ok || '');
				$http({
		      url: '/signup',
		      method: 'POST',
		      data:$scope.user,
		      headers: {'Content-Type': 'application/json'}
		    }).then(function(response) {
          data = response.data;
          console.log('...formulário enviado!');
          if (data.length > 50){ // Se o retorno for muito grande significa que o express está retornando a própria paǵina de login, o que significa que temos que ser redirecionados
            $window.location.href = '/login';
          }
          else
            $scope.status_register = String(data.status);
		    }, function(response) {
		      $scope.data = response.data || "Request failed";
		      $scope.status = response.status;
		    });
			}
		};

    $scope.loginForm = function() {
      if ($scope.userForm.$valid) {
        console.log('Enviando informações para login...');
        $scope.user.passwd = md5.createHash($scope.user.passwd || '');
        $http({
          url: '/login',
          method: 'POST',
          data:$scope.user,
          headers: {'Content-Type': 'application/json'}
        }).then(function(response) {
          data = response.data;
          console.log('...formulário enviado!');
          if (data.length > 50){ // Se o retorno for muito grande significa que o express está retornando a própria paǵina de login, o que significa que temos que ser redirecionados
            $window.location.href = '/main';
          }
          else
            $scope.status_login = String(data.status);
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
        });
      }
    };

    $scope.recoverForm = function() {
      if ($scope.userForm.$valid) {
        console.log('Enviando informações para recuperação...');
        $http({
          url: '/recover',
          method: 'POST',
          data:$scope.user,
          headers: {'Content-Type': 'application/json'}
        }).then(function(response) {
          data = response.data;
          console.log('...formulário enviado!');
          console.log(data);
          $scope.userForm.$valid = false;
          $scope.sent = 'disabled';
          if (data.status == 'success'){
            $scope.status_recover_fail = '';
            $scope.status_recover_success = String(data.info);
          }
          else{
            $scope.status_recover_success = '';
            $scope.status_recover_fail = String(data.info);
          }
        }, function(response) {
          $scope.data = response.data || "Request failed";
          $scope.status = response.status;
        });
      }
    };
}]);
