/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

ClassListController.$inject =
	    ['$routeParams'];
	
export default function ClassListController ($routeParams) {
	var vm = this;
    
    //Properties for list component
    vm.resource = "conceptclass";
    vm.redirectionParam = "class";
    vm.limit = 10; //Default value
    vm.columns= [
        {
            "property": "name",
            "label": "Name"
        },
        {
            "property": "description",
            "label":"Description"
        }];
    vm.actions = [
        {
            "action":"edit",
            "label":"Edit"
        },
        {
            "action":"retire",
            "label":"Retire"
        },
        {
            "action":"unretire",
            "label":"unretire"
        }
    ];

    //Breadcrumbs properties
    vm.links = {};
    vm.links["Concept Dictionary"] = "";
    vm.links["Concept Class Management"] = "class";

    //determines whether class has been added in previous view
    vm.classAdded = $routeParams.classAdded;
}