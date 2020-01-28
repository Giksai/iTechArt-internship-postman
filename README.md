# iTechArt-internship-wdio
## Goal
Create a set of automated tests for dev.by using webdriverIO, node js and jasmine framework.
## General info
* This project uses test framework jasmine, allowing to check parts of the given website. </br>
* WebdriverIO is used to interact with elements of the given website. </br>
* Logger configuration files are stored in loggerConfig folder, which consists of log4js.json and loggerConfigurator.js files. </br>
* All log files are stored in logs folder, which will be created automatically at first launch. </br>
* .gitignore file contain files excluded from git repository. </br> 
* Package.json specify project's info, like included packages, version, git path, name and launch scripts. </br>
* WebdriverIO configuration is stored in wdio.conf.js file in project's root folder. </br>
## To launch:
First, run 'npm i' in project's folder to install all necessary node packages, then run 'npm test'.
Upon running 'npm test' command, start.js file is executed, which automatically starts webdriverIO with current config (wdio.conf.js).


