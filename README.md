# iTechArt-internship-wdio
## Goal
Test postman's authorization section by logging in with existing accounts and creating new ones.
## General info
* This project uses test framework jasmine for no reason. </br>
* WebdriverIO is used to interact with elements of the given website. </br>
* Logger configuration files are stored in loggerConfig folder, which consists of log4js.json and loggerConfigurator.js files. </br>
* All log files are stored in logs folder, which will be created automatically at first launch. </br>
* .gitignore file contain files excluded from git repository. </br> 
* Package.json specify project's info, like included packages, version, git path, name and launch scripts. </br>
* WebdriverIO configuration is stored in wdio.conf.js file in project's root folder. </br>
* Accounts are stored in accountData.js file in project's root.
## Algorithm
1 (logging in) try to log in with given account:</br>
  1.1 if logged in, add current account to the spreadsheet, log out and continue to the next account.</br>
  1.2 if error occured, check it:</br>
    1.2.1 if account does not exist, register it in section 2.</br>
    1.2.2 if program cannot continue due to a timeout, wait 40s and repeat.</br>
2 (registering) enter account details into corresponding fields and submit:</br>
  2.1 if registered, continue through tutorial and log out while checking for message with confirmation link in background. When message arrives, append account and link and continue to the next account.</br>
  2.2 if error occured, check it:</br>
    2.2.1: if email or username are already taken, continue to the next account.</br>
## To launch:
First, run 'npm i' in project's folder to install all necessary node packages, then run 'npm test'.
Upon running 'npm test' command, start.js file is executed, which automatically starts webdriverIO with current config (wdio.conf.js).


