import angular from 'angular';
import ngRoute from 'angular-route'

import openmrsRest from './openmrs.js';

import ClassesEditController from './classesEdit.controller.js';
import ClassAddController from './classAdd.controller.js';
import ClassesListController from './classesList.controller.js';
import ConceptAddController from './conceptAdd.controller.js';
import ConceptSearchController from './conceptSearch.controller.js';
import ConceptViewController from './conceptView.controller.js';
import DataTypesDetailsController from './dataTypesDetails.controller.js';
import DataTypesListController from './dataTypesList.controller.js';

import conceptLocaleService from './conceptLocale.service.js'

export default angular
    .module('conceptDictionaryApp',
		['ngRoute', 'openmrs',
		 'ConceptDictionaryApp.classesEdit',
		 'ConceptDictionaryApp.classAdd',
		 'ConceptDictionaryApp.classesList',
		 'ConceptDictionaryApp.conceptAdd',
		 'ConceptDictionaryApp.conceptSearch',
		 'ConceptDictionaryApp.conceptView',
		 'ConceptDictionaryApp.dataTypesDetails',
		 'ConceptDictionaryApp.dataTypesList',
		 'ConceptDictionaryApp.conceptLocale'])

	.config(['$routeProvider',
                    function($routeProvider, openmrsRest) {
                      $routeProvider.
                        when('/concept-search', {
                            templateUrl: 'partials/concept-search.html',
                            controller: 'ConceptSearchController',
                            controllerAs: 'vm'
                      }).
                        when('/class-list', {
                          templateUrl: 'partials/class-list.html',
                          controller: 'ClassesListController',
                          controllerAs: 'vm',
                          resolve: {
                        	  loadClasses : loadClasses
                          }
                        }).
                        when('/class-list/add-class', {
                        	templateUrl: 'partials/class-add.html',
                            controller: 'ClassAddController',
                            controllerAs: 'vm'
                      }).
                        when('/class-list/:classUUID', {
                        	templateUrl: 'partials/class-edit.html',
                        	controller: 'ClassesEditController',
                        	controllerAs: 'vm',
                        	resolve: {
                        		singleClass : loadClass
                        	}
                        }).
                        when('/datatype-list', {
                        	templateUrl: 'partials/datatype-list.html',
                            controller: 'DataTypesListController',
                        	controllerAs: 'vm',
                            resolve: {
                              	 loadDataTypes : loadDataTypes
                            }
                        }).
                        when('/datatype-list/:dataTypeUUID', {
                        	templateUrl: 'partials/datatype-details.html',
                        	controller: 'DataTypesDetailsController',
                        	controllerAs: 'vm',
                        	resolve: {
                        		loadDataType : loadDataType
                        	}
                        }).
                        when('/concept/add/', {
                        	templateUrl: 'partials/concept-add.html',
                        	controller: 'ConceptAddController',
                        	controllerAs: 'vm',
                        	resolve: {
                        		serverLocales: serverLocales,
                        		loadClasses : loadClasses,
                        		loadDataTypes : loadDataTypes
                        	}
                        }).
                        when('/concept/:conceptUUID/', {
                        	templateUrl: 'partials/concept.html',
                        	controller: 'ConceptViewController',
                        	controllerAs: 'vm',
                        	resolve: {
                        		concept : loadConcept,
                        		serverLocales: serverLocales
                        	}
                        }).
                        otherwise({
                          redirectTo: '/class-list'
                        });
                    }]);

function loadConcept ($route, openmrsRest){
	return openmrsRest.getFull('concept',
			{uuid : $route.current.params.conceptUUID});
};
function serverLocales(openmrsRest){
	return openmrsRest.getFull('systemsetting',{q : 'locale.allowed.list'})
					  .then(function(response){
						  return response.results[0].value.split(", ");
					  });
};
function loadClasses(openmrsRest){
	  return openmrsRest.listFull('conceptclass');
};
function loadDataTypes (openmrsRest){
	  return openmrsRest.listFull('conceptdatatype');
};
function loadClass ($route, openmrsRest){
	return openmrsRest.getFull('conceptclass',
			{uuid: $route.current.params.classUUID});
};
function loadDataType ($route, openmrsRest){
	return openmrsRest.getFull('conceptdatatype', 
			{uuid: $route.current.params.dataTypeUUID});
};




