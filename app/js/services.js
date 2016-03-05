var conceptDictServices = angular.module('conceptDictServices', ['ngResource']);

var OPENMRS_CONTEXT_PATH = "openmrs"

conceptDictServices.factory('Classes',['$resource', function($resource){
     					return $resource(
     							'/'+OPENMRS_CONTEXT_PATH+'/ws/rest/v1/conceptclass/:uuid?:mode', {}, 
     							//Returns all classes
     								{getAll: {method:'GET', params:{mode :'v=full'}, isArray:false},
     							//Returns single class
     								 getClass: {method: 'GET', isArray:false }});
				}])
//I know this is not exactly what You meant Rafał