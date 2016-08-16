/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

ClassEditController.$inject =
	['singleClass', '$routeParams', '$location', 'openmrsRest', 'openmrsNotification'];

export default function ClassEditController( singleClass, $routeParams, $location, openmrsRest, openmrsNotification){
	
	var vm = this;
	//holds class information
	vm.singleClass = singleClass;
	
    vm.links = {};
    vm.links["Concept.label"] = "";
    vm.links["ConceptClass.manage"] = "class";
    vm.links["Add/Edit"] = "class/"+vm.singleClass.uuid;
    
	vm.isError = false;
	
	vm.editClass = editClass;
	
	vm.cancel = cancel;

	vm.retire = retire;	
	vm.unretire = unretire;
	
	activate();
	
	function activate(){
    	if(angular.isUndefined(vm.retireReason)){
    			vm.retireReason = "";
    	}
    	openmrsNotification.routeNotification();
    }

    function editClass() {
        openmrsRest.update('conceptclass', vm.singleClass).then(handleSuccess, handleException);
    }

    function cancel() {
        $location.path('/class');
    }
    
    function retire() {
        openmrsRest.retire('conceptclass', vm.singleClass, vm.retireReason).then(handleSuccess, handleException);
    }
    
    function unretire() {
        openmrsRest.unretire('conceptclass', vm.singleClass).then(handleSuccess, handleException);
    }
    
    function handleSuccess(success){
    	$location.path('/class').search({successToast: vm.singleClass.name+" has been saved"});
    }
    function handleException(exception){
        openmrsNotification.error(exception.data.error.fieldErrors.name[0].message);
    }

    /**
     * Logic for openmrs-alert-dialog component
     */
    vm.deleteForever = deleteForever;
    vm.showAlert = showAlert;
    vm.updateDeleteConfirmation = updateDeleteConfirmation;

    vm.deleteClicked = false;

    function deleteForever() {
        openmrsRest.purge('conceptclass', vm.singleClass);
        $location.path('/class').search({successToast: vm.singleClass.name+" has been deleted"});
    }
    function showAlert() {
        vm.message = "Are you sure that you want to delete " + vm.singleClass.name + " forever?";
        vm.deleteClicked = true;
    }
    function updateDeleteConfirmation(isConfirmed) {
        if (isConfirmed) {
            deleteForever();
        }
        vm.deleteClicked = false;
    }
}
