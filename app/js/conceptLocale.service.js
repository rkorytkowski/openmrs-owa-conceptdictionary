export default angular
	.module('ConceptDictionaryApp.conceptLocale', [])
	.factory('conceptLocaleService', conceptLocaleService)
	.name;


		function conceptLocaleService(){
					return{
						getLocales: getLocales,
						getLocaleNames: getLocaleNames,
						getLocaleDescr: getLocaleDescr
					}
		}
		/**
		 * @descriptions array of descriptions objects of concept
		 * @names array of names objects of concept
		 * @serverLocales array of available locales
		 * @returns array of locales of names and descriptions
		 */
		function getLocales (names, descriptions, serverLocales){
			var locales = {};
			//check names
			for(var index=0;index<names.length;index++){
				checkLocale(names[index]);
			}
			//check descriptions
			for(var index=0;index<descriptions.length;index++){
				checkLocale(descriptions[index]);
			}
			//check if input locale is contained by serverLocales
			function checkLocale (input){
				for(var index=0; index<serverLocales.length ;index++){
					if(input.locale === serverLocales[index]) locales[serverLocales[index]] = true;
				}
			}
			return Object.keys(locales);
		}
		/**
		 * @names array of names objects of concept
		 * @locale string of locale abbreviation, e.g. "en"
		 * @returns object, which holds full, short name and synonyms for specified locale
		 */
		function getLocaleNames (names, locale){
			//flags for types of locale prefered names
			var shortFlag = "SHORT";
			var fullFlag = "FULLY_SPECIFIED";
			var searchFlag = "INDEX_TERM";
			//holds full, short names and synonyms array
			var localNames = {};
			localNames.synonyms = [];
			localNames.searchTerms = [];
			
			for (var index=0;index<names.length;index++){
				if(names[index].locale === locale){
					if(names[index].conceptNameType === shortFlag) localNames.short = names[index].display;
					else if(names[index].conceptNameType === fullFlag) localNames.full = names[index].display;
					else if(names[index].conceptNameType === searchFlag) localNames.searchTerms.push(names[index].display);
					else localNames.synonyms.push(names[index].display);
				}
			}
			return localNames;
		}
		/**
		 * @descriptions array of descriptions objects of concept
		 * @locale string of locale abbreviation
		 * @returns string - description of concept for specified locale
		 */
		function getLocaleDescr(descriptions, locale){
			for (var index=0;index<descriptions.length;index++){
				if(descriptions[index].locale === locale){
					return descriptions[index].display;
				}
			}
		}