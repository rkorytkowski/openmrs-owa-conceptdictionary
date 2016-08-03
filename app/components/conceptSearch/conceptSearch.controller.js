/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

ConceptSearchController.$inject = ['$scope', '$routeParams' ,'openmrsRest', '$timeout', 'openmrsNotification'];			

export default function ConceptSearchController($scope, $routeParams, openmrsRest, $timeout, openmrsNotification) {

    var vm = this;
    
    vm.links = {};
    vm.links["Concept.label"] = "";
    vm.links["Concept.manage"] = "concept";
    
    openmrsNotification.routeNotification();
    
    vm.type = "list";
    vm.resource = "concept";
    vm.limit = 10; //Default value
    vm.columns= [
        {
            "property": "name.name",
            "label": "Concept.name"
        },
        {
            "property": "conceptClass.name",
            "label":"class"
        },
        {
            "property": "uuid",
            "label":"uuid"
        }];
    vm.actions = [
        {
            "action":"view",
            "label":"View",
            "link" : "#/concept/{uuid}"
        },
        {
            "action":"retire"
        }
    ];
}
