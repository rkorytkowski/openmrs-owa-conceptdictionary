export default angular
	.module('ConceptDictionaryApp.classesList', [])
	.controller('ClassesListController', ClassesListController)
	.name;

	ClassesListController.$inject = 
	    ['loadClasses', '$location', '$route', '$routeParams', 'openmrsRest']
	
	function ClassesListController (loadClasses, $location, $route, $routeParams, openmrsRest) {
	
		var vm = this;
		//array of concept classes
        vm.classes = loadClasses;
        //map of selected classes
        vm.selected = {};
        //checks if any is selected
        vm.isSelected = false;
        //determines whether class has been added in previous view
        vm.classAdded = $routeParams.classAdded;

        vm.goTo = goTo;
        vm.deleteSelected = deleteSelected;
        vm.refreshButtonState = refreshButtonState;

        function refreshButtonState () {

            var foundSolution = false;
            //for iterator?
            var counter = 0;

            angular.forEach(vm.selected, function(key) {
                if (key) {
                    vm.isSelected = true;
                    foundSolution = true;
                    //break?
                }
                counter++;
            });
            if (!foundSolution && counter == Object.keys(vm.selected).length) {
                vm.isSelected = false;
            }
        }

        function deleteSelected (){
        	//deletes selected classes
            angular.forEach(vm.selected, function(key,value){
                if(key){
                    openmrsRest.remove('conceptclass', {uuid : value});
                }
            });
            //then updates classes list in scope after deletion
            openmrsRest.listFull('conceptclass').then(function(data) {
                vm.classes = data;
                $location.path("/class-list/").search({});
            });

        }
        //redirects to another location
		function goTo (hash){
			$location.path(hash);
		}


    }