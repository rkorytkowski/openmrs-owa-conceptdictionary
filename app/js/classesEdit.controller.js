export default angular
    	.module('ConceptDictionaryApp.classesEdit', [])
    	.controller('ClassesEditController', ClassesEditController)
        .name;

    ClassesEditController.$inject =
    	['$scope', 'singleClass', '$routeParams', '$location', 'openmrsRest']

	function ClassesEditController($scope, singleClass, $routeParams, $location, openmrsRest ){
		
		var vm = this;
		//holds class information
		vm.singleClass = singleClass;
		
		vm.class = {
            name : '',
            description : ''
        };
		
		vm.responseMessage = '';
		
		vm.redirectToList = redirectToList;
		
		vm.editClass = editClass;
		
		vm.cancel = cancel;
		

        function redirectToList() {
            $location.path('/class-list').search({classAdded: vm.class.name});
        }

        function editClass() {
            vm.class.name = vm.singleClass.name;
            vm.class.description = vm.singleClass.description;
            vm.json = angular.toJson(vm.class);

            openmrsRest.update('conceptclass', {uuid: vm.singleClass.uuid}, vm.json).then(function(success) {
            	vm.responseMessage = success;
                vm.redirectToList();
            }, function(exception) {
                vm.responseMessage = exception.data.error.fieldErrors.name[0].message;
            });
        }

        function cancel() {
            vm.class.name = '';
            $location.path('/class-list').search({classAdded: ''});
        }
	}
