var conceptDictControllers = angular.module('conceptDictControllers', []);

conceptDictControllers.controller('ClassesListCtrl', ['$scope', 'Classes', '$location', function($scope, Classes, $location) {
	  $scope.classes = Classes.getAll();	 
	  
	  $scope.go = function ( hash ) {
		  $location.path( hash );
		};
	}]);

conceptDictControllers.controller('ClassesEditCtrl', ['$scope', 'Classes', '$routeParams',  function($scope, Classes, $routeParams ) {
      $scope.singleClass = Classes.getClass({uuid : $routeParams.classUUID});
  }]);

conceptDictControllers.controller('ClassAddCtrl', ['$scope', function($scope){
	
}]);

