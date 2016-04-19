<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>

# Concept Dictionary
[![Build Status](https://travis-ci.org/rkorytkowski/openmrs-owa-conceptdictionary.svg?branch=master)](https://travis-ci.org/rkorytkowski/openmrs-owa-conceptdictionary) [![Codacy Badge](https://api.codacy.com/project/badge/grade/a7b282f69c44458297ec61d65d4b3baf)](https://www.codacy.com/app/openmrs/openmrs-owa-conceptdictionary) [![Codacy Badge](https://api.codacy.com/project/badge/coverage/a7b282f69c44458297ec61d65d4b3baf)](https://www.codacy.com/app/openmrs/openmrs-owa-conceptdictionary) [ ![Download](https://api.bintray.com/packages/openmrs/owa/openmrs-owa-conceptdictionary/images/download.svg) ](https://bintray.com/openmrs/owa/openmrs-owa-conceptdictionary/_latestVersion) [![Demo](https://img.shields.io/badge/demo-master-brightgreen.svg)](http://rkorytkowski.github.io/openmrs-owa-conceptdictionary)

This repository contains the Concept Dictionary OpenMRS Open Web App.

# Installing Concepts OWA

First, you need to [![Download](https://api.bintray.com/packages/openmrs/owa/openmrs-owa-conceptdictionary/images/download.svg) ](https://bintray.com/openmrs/owa/openmrs-owa-conceptdictionary/_latestVersion) the zip package with Concept Dictionary OWA.
To add this package to Reference App, enter advanced administration panel (default at: `openmrs/admin/index.htm`), then go to `Manage Apps` in `Open Web Apps Module` menu, click "Browse", find the `zip` file and then upload it via button.
When application is installed, it can be accessed under `owa/conceptdictionary/index.html`.

<p><b>Adding Application link to "Configure Metadata" menu:</b> </p>
When on Reference Application Menu, enter `System Administration` -> `Manage Apps` -> `Add App Definition` and input following text inside:

````sh
{
    "id": "owa.conceptdictionary",
    "description": "Concept OWA Dictionary",
    "order": 0,
    "extensions": [
        {
            "id": "owa.conceptdictionary.adminGroup",
            "extensionPointId": "org.openmrs.module.adminui.adminGroups",
            "type": "group",
            "label": "Concepts",
            "icon": "icon-book"
        },
        {
            "id": "owa.conceptdictionary.adminLink",
            "extensionPointId": "org.openmrs.module.adminui.adminLinks",
            "type": "link",
            "label": "Manage Concept Dictionary",
            "url": "owa/conceptdictionary/index.html",
            "extensionParams": {
                "group": "owa.conceptdictionary.adminGroup"
            }
        }
    ]
}
````
Save changes, now Concept OWA is visible at `adminui/metadata/configureMetadata.page`

For further documentation about OpenMRS Open Web Apps see [the wiki page](https://wiki.openmrs.org/display/docs/Open+Web+Apps+Module).

## Development

Please follow [the style guide](https://github.com/rkorytkowski/angular-styleguide/blob/master/a1/README.md) for AngularJS development.

### Setup OpenMRS server

You will need JDK 1.7, maven and OpenMRS SDK. Please refer to [the wiki page] (https://wiki.openmrs.org/display/docs/OpenMRS+SDK#OpenMRSSDK-Installation) for installation instructions.

You need to setup a server (first time only) as follows:

````sh
mvn openmrs-sdk:setup-platform -DserverId=conceptdictionary
mvn openmrs-sdk:install -DartifactId=owa -Dversion=1.4-SNAPSHOT -DserverId=conceptdictionary
mvn openmrs-sdk:install -DartifactId=uiframework -Dversion=3.6 -DserverId=conceptdictionary
mvn openmrs-sdk:install -DartifactId=uicommons -Dversion=1.7 -DserverId=conceptdictionary
````

You need to install latest version of REST webservices module
````sh
mvn openmrs-sdk:install -DartifactId=webservices.rest -Dversion=2.14-SNAPSHOT -DserverId=conceptdictionary
# You can also add "-U" atribute to maven command to ensure that module is downloaded from Maven repository
````

Now you can run the server:
````sh
mvn openmrs-sdk:run -DserverId=conceptdictionary
````
Once it says "Started Jetty Server", visit http://localhost:8080/openmrs in your browser.

### Production Build

You will need NodeJS 4+ installed to do this. See the install instructions [here](https://nodejs.org/en/download/package-manager/).

Once you have NodeJS installed, install the dependencies (first time only):

```sh
npm install
```

Build the distributable using [Webpack](https://webpack.github.io/) as follows:

````sh
npm run build
````

This will create a `dist` directory, which content can be uploaded to the OpenMRS Open Web Apps module.

### Releasing

To release the app set the version property in bintray.json and package.json to the version you want to release. 

Next create a new tag named after the version or create a release from [GitHub Releases](https://github.com/rkorytkowski/openmrs-owa-conceptdictionary/releases). 

The tag will be built by Travis-ci and the release pushed to Bintray automatically. 

Finally set the property version in bintray.json and package.json to the next development version.

### Local Deploy

To deploy directly to your local Open Web Apps directory, run:

````sh
npm run build:deploy
````

This will build and deploy the app to directory specified in `LOCAL_OWA_FOLDER` value in `./config.json`, created by dev. If `config.json` is absent, app will be deployed to `/dist` directory. You can find your deploy directory running:

````sh
 mvn openmrs-sdk:run -DserverId=conceptdictionary
````
Look at the tmp directory location. The tmp directory is created in your deploy directory so just skip \tmp.
````
[INFO] --- openmrs-sdk-maven-plugin:2.1.2:run (default-cli) @ standalone-pom ---
[INFO] Configuring Jetty for project: Maven Stub Project (No POM)
[INFO] Context path = /openmrs
[INFO] Tmp directory = C:\Users\Rafal\openmrs\conceptdictionary\tmp
````

It is also possible to configure the project so that whenever a file is changed it is deployed to a server and a
browser is refreshed. First please make sure the APP_ENTRY_POINT is set in config.json as follows:

````js
{
  "LOCAL_OWA_FOLDER": "C:\\\\Users\\\\rafal\\\\openmrs\\\\conceptdictionary\\\\owa\\\\",
  "APP_ENTRY_POINT":"http://localhost:8080/openmrs/owa/conceptdictionary/index.html"
}
````

Next run:
````sh
npm run watch
````

While it runs, it watches all files for changes and automatically updates your browser.

###UI elements

Styles css, fonts and some UI components like openmrs-header and openmrs-breadcrums come from the [openmrs-contrib-uicommons](https://github.com/PawelGutkowski/openmrs-contrib-uicommons) dependency. Please refer to the other project, if you want to contribute to them.

###Deplyoing to GitHub Pages

The master branch of this repo is being deployed to http://rkorytkowski.github.io/openmrs-owa-conceptdictionary with every commit. If you want to have the same behavior in your fork you need to make sure deploy.sh has the execution bit set using: 

````sh
git update-index --chmod=+x deploy.sh
````

You will also need to change the url to point to your fork in deploy.sh line 27 and set the GITHUB_PAGES_TOKEN variable in travis-ci to your token generated from https://github.com/settings/tokens

### Extending

Install [npm](http://npmjs.com/) packages dependencies as follows:

````sh
npm install --save <package>
````

Be sure to include the loading statement in your `.js` files at the modules you want your dependencies injected:

````js
//import module
require('package')
//import and assign to variable
import variableName from 'package';
````

Any files that you add manually must be added in the `app` directory.

## Community

[![OpenMRS Talk](https://omrs-shields.psbrandt.io/custom/openmrs/talk/F26522?logo=openmrs)](http://talk.openmrs.org)
[![OpenMRS IRC](https://img.shields.io/badge/openmrs-irc-EEA616.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MTIiIGhlaWdodD0iNjEyIiB2aWV3Qm94PSIwIDAgNjEyIDYxMiI%2BPHBhdGggZD0iTTE1MyAyMjkuNWMtMjEuMTMzIDAtMzguMjUgMTcuMTE3LTM4LjI1IDM4LjI1UzEzMS44NjcgMzA2IDE1MyAzMDZjMjEuMTE0IDAgMzguMjUtMTcuMTE3IDM4LjI1LTM4LjI1UzE3NC4xMzMgMjI5LjUgMTUzIDIyOS41em0xNTMgMGMtMjEuMTMzIDAtMzguMjUgMTcuMTE3LTM4LjI1IDM4LjI1UzI4NC44NjcgMzA2IDMwNiAzMDZjMjEuMTE0IDAgMzguMjUtMTcuMTE3IDM4LjI1LTM4LjI1UzMyNy4xMzMgMjI5LjUgMzA2IDIyOS41em0xNTMgMGMtMjEuMTMzIDAtMzguMjUgMTcuMTE3LTM4LjI1IDM4LjI1UzQzNy44NjcgMzA2IDQ1OSAzMDZzMzguMjUtMTcuMTE3IDM4LjI1LTM4LjI1UzQ4MC4xMzMgMjI5LjUgNDU5IDIyOS41ek0zMDYgMEMxMzcuMDEyIDAgMCAxMTkuODc1IDAgMjY3Ljc1YzAgODQuNTE0IDQ0Ljg0OCAxNTkuNzUgMTE0Ljc1IDIwOC44MjZWNjEybDEzNC4wNDctODEuMzRjMTguNTUyIDMuMDYyIDM3LjYzOCA0Ljg0IDU3LjIwMyA0Ljg0IDE2OS4wMDggMCAzMDYtMTE5Ljg3NSAzMDYtMjY3Ljc1UzQ3NS4wMDggMCAzMDYgMHptMCA0OTcuMjVjLTIyLjMzOCAwLTQzLjkxLTIuNi02NC42NDMtNy4wMmwtOTAuMDQgNTQuMTI0IDEuMjA0LTg4LjdDODMuNSA0MTQuMTMzIDM4LjI1IDM0NS41MTMgMzguMjUgMjY3Ljc1YzAtMTI2Ljc0IDExOS44NzUtMjI5LjUgMjY3Ljc1LTIyOS41czI2Ny43NSAxMDIuNzYgMjY3Ljc1IDIyOS41UzQ1My44NzUgNDk3LjI1IDMwNiA0OTcuMjV6IiBmaWxsPSIjZmZmIi8%2BPC9zdmc%2B)](http://irc.openmrs.org)
[![OpenMRS Telegram](https://img.shields.io/badge/openmrs-telegram-009384.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgMjQwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIuNjY3IiB5MT0iLjE2NyIgeDI9Ii40MTciIHkyPSIuNzUiPjxzdG9wIHN0b3AtY29sb3I9IiMzN2FlZTIiIG9mZnNldD0iMCIvPjxzdG9wIHN0b3AtY29sb3I9IiMxZTk2YzgiIG9mZnNldD0iMSIvPjwvbGluZWFyR3JhZGllbnQ%2BPGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iLjY2IiB5MT0iLjQzNyIgeDI9Ii44NTEiIHkyPSIuODAyIj48c3RvcCBzdG9wLWNvbG9yPSIjZWZmN2ZjIiBvZmZzZXQ9IjAiLz48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIiBvZmZzZXQ9IjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxMjAiIHI9IjEyMCIgZmlsbD0idXJsKCNhKSIvPjxwYXRoIGZpbGw9IiNjOGRhZWEiIGQ9Ik05OCAxNzVjLTMuODg4IDAtMy4yMjctMS40NjgtNC41NjgtNS4xN0w4MiAxMzIuMjA3IDE3MCA4MCIvPjxwYXRoIGZpbGw9IiNhOWM5ZGQiIGQ9Ik05OCAxNzVjMyAwIDQuMzI1LTEuMzcyIDYtM2wxNi0xNS41NTgtMTkuOTU4LTEyLjAzNSIvPjxwYXRoIGZpbGw9InVybCgjYikiIGQ9Ik0xMDAuMDQgMTQ0LjQxbDQ4LjM2IDM1LjczYzUuNTIgMy4wNDQgOS41IDEuNDY3IDEwLjg3Ni01LjEyNGwxOS42ODUtOTIuNzYzYzIuMDE2LTguMDgtMy4wOC0xMS43NDYtOC4zNTgtOS4zNWwtMTE1LjU5IDQ0LjU3MmMtNy44OSAzLjE2NS03Ljg0NCA3LjU2Ny0xLjQ0IDkuNTI4bDI5LjY2NCA5LjI2IDY4LjY3My00My4zMjZjMy4yNC0xLjk2NiA2LjIxNy0uOTEgMy43NzUgMS4yNTgiLz48L3N2Zz4%3D)](https://telegram.me/openmrs)
[![OpenMRS Wiki](https://img.shields.io/badge/openmrs-wiki-5B57A6.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjAiIGhlaWdodD0iMTQyIiB2aWV3Qm94PSIwIDAgMTYwIDE0MiI%2BPHBhdGggY2xhc3M9InN0MCIgZD0iTTExMy42MTUgOTQuNDk0Yy0yLjAxNi0zLjk3NC00LjQwNS03Ljk5LTcuMi0xMi4wNzctMi0yLjkzLTQuMTQ1LTUuNzc4LTYuMzg3LTguNTY3LS45MS0xLjEzNi0uNTMtMi41NDguMTY3LTMuMjUuNjg4LS43MDUgMS4zOC0xLjQxIDIuMDc2LTIuMTIgOS41OC05Ljc3IDE5LjQ5LTE5Ljg3MyAyNy4wOS0zMC43ODcgOC4wOC0xMS42MSAxMi41Ni0yMi42MjQgMTMuNjktMzMuOTU0LjEyLTEuMTQtLjQtMi4zNS0xLjMyLTMuMDUtLjYtLjQ2LTEuMzMtLjctMi4wNy0uNy0uNDEgMC0uODIuMDctMS4yMS4yMi03LjM3IDIuODItMTQuODUgNC45Ni0yMS42OCA2LjU1LTEuMzkuMzItMi41MSAxLjM2LTIuOTggMi42LTQuOTggMTMuNjMtMTcuNjggMjYuNjEtMzEuMDEgNDAuMi0uNTMuNTEtMS4yOCAxLjE4LTIuNSAxLjE4cy0xLjk2LS42NS0yLjUtMS4xOGMtMTMuMzMtMTMuNTktMjYuMDMtMjYuNTItMzEtNDAuMTUtLjQ2LTEuMjQtMS41OS0yLjI4LTIuOTgtMi42QzM2Ljk0IDUuMjIgMjkuNDUgMi45IDIyLjEuMDhjLS4zOTgtLjE1LS44MS0uMjI1LTEuMjItLjIyNS0uNzQgMC0xLjQ3LjI0LTIuMDcuNy0uOTQuNzE4LTEuNDQgMS44NzItMS4zMiAzLjA0OCAxLjEzIDExLjMzMiA1LjYgMjIuNDggMTMuNjg0IDM0LjA5IDcuNiAxMC45MTUgMTcuNTEgMjEuMDE3IDI3LjA5IDMwLjc4NyAxNy42NSAxNy45OTQgMzQuMzMgMzQuOTk3IDM1Ljc5IDU0LjcxMy4xMyAxLjc4IDEuNjIgMy4xNTggMy40IDMuMTU4aDIwLjc0Yy45NCAwIDEuODMtLjM4IDIuNDctMS4wNi42NS0uNjcuOTktMS41OC45NC0yLjUyLS4xOC0zLjcxLS43Mi03LjQyLTEuNTktMTEuMTZoLjAxYy0uMDI4LS4xMS0uMDQ3LS4yMi0uMDQ3LS4zMyAwLS43NS41ODgtMS4zOCAxLjM1Ny0xLjM4LjA3IDAgLjEzLjAyLjIuMDMgMTYuOTMgMi40OCAyNy42MzYgNi40NCAyNy42NSAxMC44di4wMWMwIDQuMTEtOS42MjMgMTAuMzEtMjUuMjY2IDE0Ljg1bC0uMDA1LjAxYy0xLjM5LjQtMi40MDYgMS42Ni0yLjQwNiAzLjE1IDAgMS44MSAxLjQ5MyAzLjI4IDMuMzQgMy4yOC4yNTUgMCAuNS0uMDMuNzQtLjA4IDIxLjAyNi00Ljg2IDM0Ljk2NS0xMy4wMzQgMzQuOTY1LTIyLjI2MiAwLTEwLjk1NC0xOC44NC0yMC43NC00Ni45LTI1LjE1MnpNNTguMDEgODMuODA2Yy0uNDI1LS40NDQtMS4yNzctMS4wMzgtMi40MjItMS4wMzgtMS41NDcgMC0yLjQ2NiAxLTIuODEyIDEuNTMtMi4yNjQgMy40NDQtNC4yNCA2Ljg0My01Ljk0NiAxMC4yMDhDMTguODEgOTguOTI0IDAgMTA4LjcgMCAxMTkuNjVjMCA5LjIzNyAxMy44NCAxNy4zOTQgMzQuOTA1IDIyLjI1NS4wMDMuMDAyLjAyMyAwIC4wMyAwIC4yNS4wNTguNTA0LjA5NS43Ny4wOTUgMS44NDYgMCAzLjM0LTEuNDcgMy4zNC0zLjI4IDAtMS40ODctMS4wMTctMi43My0yLjQtMy4xM2wtLjAxLS4wMjJjLTE1LjY0NS00LjU0LTI1LjI3LTEwLjc0NC0yNS4yNy0xNC44NTJ2LS4wMWMuMDE3LTQuMzUzIDEwLjY5My04LjMwNiAyNy41OC0xMC43ODcuMDYyLS4wMS4xMi0uMDIuMTgyLS4wMi43NzUgMCAxLjM2OC42MyAxLjM2OCAxLjM5IDAgLjExLS4wMi4yMy0uMDQ2LjMzbC4wMS4wMWMtLjg3IDMuNzEtMS40IDcuNDEtMS41OCAxMS4xMS0uMDUuOTMuMjkgMS44NS45NCAyLjUzLjY0LjY3IDEuNTQgMS4wNiAyLjQ4IDEuMDZoMjAuNzRjMS43OCAwIDMuMjgtMS40IDMuNDEtMy4xNy40NS02LjA3IDIuMzUtMTIuMTUgNS43OC0xOC41NCAxLjE5LTIuMjEuMjYtNC4yOS0uNDItNS4xOC0zLjQyLTQuNDMtNy41OS05LjE2LTEzLjgxLTE1LjY1eiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03Ny44NjggMzIuNTc4Yy44Mi43OTggMS43NS45NDcgMi4zOS45NDdoLjAwNmMuNjQyIDAgMS41Ny0uMTQ4IDIuMzktLjk0NiA3LjMxMy03LjExIDExLjI0Mi0xNS40IDEyLjEwMy0xNy43MS4xMjUtLjM0LjI1Mi0uNzMuMjUyLTEuMjYgMC0xLjg0LTEuNTQtMy4xNi0zLjE0LTMuMTYtMS4zMyAwLTUuMS4zOS0xMS41OS4zOWgtLjA1Yy02LjUgMC0xMC4yNy0uMzktMTEuNTktLjM5LTEuNjEgMC0zLjE0IDEuMzEtMy4xNCAzLjE1IDAgLjUzLjEzLjkyLjI1IDEuMjYuODYgMi4zIDQuNzkgMTAuNTkgMTIuMSAxNy43eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg%3D%3D)](http://wiki.openmrs.org)

## Support

Ask questions on [OpenMRS Talk](https://talk.openmrs.org/).

## License

[MPL 2.0 w/ HD](http://openmrs.org/license/) © [OpenMRS Inc.](http://www.openmrs.org/)
