var conceptDictionary = angular.module('conceptDictionary', 
		['ngRoute', 'conceptDictControllers', 'conceptDictServices']);

conceptDictionary.config(['$routeProvider',
                    function($routeProvider) {
                      $routeProvider.
                        when('/class-list', {
                          templateUrl: 'partials/class-list.html',
                          controller: 'ClassesListCtrl'
                        }).
                        when('/class-list/:className*', {
                        	templateUrl: 'partials/class-edit.html',
                        	controller: 'ClassesEditCtrl'                        		
                        }).
                        when('/class-list/addClass', {
                        	templateUrl: 'partials/class-add.html'                      		
                        }).
                        otherwise({
                          redirectTo: '/class-list'
                        });
                    }]);