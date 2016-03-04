var conceptDictControllers = angular.module('conceptDictControllers', []);

conceptDictControllers.controller('ClassesListCtrl', ['$scope', 'Classes', '$location', function($scope, Classes, $location) {
	  $scope.classes = Classes.query();	 
	  
	  $scope.go = function ( hash ) {
		  $location.path( hash );
		};
	  
	}]);

conceptDictControllers.controller('ClassesEditCtrl', ['$scope', '$routeParams',  function($scope, $routeParams) {
    $scope.className = $routeParams.className;
    $scope.classUUID = $routeParams.classUUID;
    $scope.classDesc = $routeParams.classDesc;
  }]);

conceptDictControllers.controller('ClassAddCtrl', ['$scope', function($scope){
	
}]);

