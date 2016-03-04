var conceptDictServices = angular.module('conceptDictServices', ['ngResource']);


conceptDictServices.factory('Classes', ['$resource',
                                   function($resource){
                                     return $resource(
                                    		 'http://'+ location.host +'/openmrs/ws/rest/v1/conceptclass?v=full', {}, {
                                       query: {method:'GET', isArray:false}
                                     });
                                   }]);