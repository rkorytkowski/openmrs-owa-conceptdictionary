/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
SourceEditController.$inject = ['sources','openmrsRest', '$location', 'openmrsNotification'];

export default function SourceEditController (sources ,openmrsRest, $location, openmrsNotification){

    var vm = this;
    
    vm.links = {};
    vm.links["Concept.label"] = "";
    vm.links["ConceptSource.manage"] = "source/";
    vm.links["Add/Edit"] = "source/"+sources.uuid;
    
    vm.responseMessage = '';

    vm.cancel = cancel;
    vm.save = save;
    vm.retire = retire;
    vm.unretire = unretire;
    vm.deleteForever = deleteForever;
    vm.showAlert = showAlert;
    vm.updateDeleteConfirmation = updateDeleteConfirmation;
    
    activate();
    
    function activate(){
        vm.source = sources;
    	if(angular.isUndefined(vm.retireReason)){
    			vm.retireReason = "";
    	}
    }

    function cancel () {
        $location.path('/source');
    }

    //Method used to add class with current class params
    function save() {
        vm.json = angular.toJson(vm.source);
        openmrsRest.update('conceptsource', vm.source).then(handleSuccess, handleException);
    }

    function retire() {
        openmrsRest.retire('conceptsource', vm.source, vm.retireReason).then(handleSuccess, handleException);
    }
    function unretire() {
        openmrsRest.unretire('conceptsource', vm.source).then(handleSuccess, handleException);
    }
    
    
    /**
     * Logic for openmrs-alert-dialog component
     */
    vm.deleteClicked = false;
    function deleteForever() {
        openmrsRest.purge('conceptsource', vm.source).then(
            	function(success)  {$location.path('/source').search({successToast: vm.source.name+" has been purged"});}, 
            	handleException);
    }
    function showAlert(item) {
        vm.message = "Are you sure that you want to delete " + vm.source.name + " forever?";
        vm.deleteClicked = true;
    }
    function updateDeleteConfirmation(isConfirmed) {
        if (isConfirmed) {
        	deleteForever();
        }
        vm.deleteClicked = false;
    }
    function handleSuccess(success){
    	$location.path('/source').search({successToast: vm.source.name+" has been saved"});
    }
    function handleException(exception){
        openmrsNotification.error(exception.data.error.message);
    }
}