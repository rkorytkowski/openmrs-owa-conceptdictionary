export default angular
	.module('stuff')
	.controller('DataTypesDetailsController', DataTypesDetailsController)
	.name;
		
	DataTypesDetailsController.$inject = 
		['$scope', 'loadDataType', '$routeParams', 'openmrsRest']
	
	function DataTypesDetailsController($scope, loadDataType, $routeParams, openmrsRest){
		
		var vm = this;
		
		vm.singleDataType = loadDataType;
	}