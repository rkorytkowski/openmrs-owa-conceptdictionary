export default angular
	.module('stuff')
	.controller('DataTypesListController', DataTypesListController)
	.name;
	
	DataTypesListController.$inject = 
		['$scope', 'loadDataTypes', '$routeParams', 'openmrsRest'];
		
	function DataTypesListController($scope, loadDataTypes, $routeParams, openmrsRest){
		var vm = this;
		
		vm.dataTypes = loadDataTypes;		
	}