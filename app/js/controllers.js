var conceptDictControllers = angular.module('conceptDictControllers', []);

conceptDictControllers.controller('ClassesListCtrl', ['$scope', 'Classes', function($scope, Classes) {
	  $scope.classes = Classes.query();	 
	  
	}]);

conceptDictControllers.controller('ClassesEditCtrl', ['$scope', '$routeParams',  function($scope, $routeParams) {
    $scope.className = $routeParams.className;
    $scope.classUUID = $routeParams.classUUID;
    $scope.classDesc = $routeParams.classDesc;
  }]);

