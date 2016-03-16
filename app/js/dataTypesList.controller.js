export default angular
	.module('ConceptDictionaryApp.dataTypesList', [])
	.controller('DataTypesListController', DataTypesListController)
	.name;

	DataTypesListController.$inject = 
		['$scope', 'loadDataTypes', '$routeParams', 'openmrsRest'];
		
	function DataTypesListController($scope, loadDataTypes, $routeParams, openmrsRest){
		var vm = this;
		
		vm.dataTypes = loadDataTypes;		
	}