# NodeJS Windows Services Controller
# Installation
___
Install the module
```
npm i nodejs-windows-service-controller
```

Include the module in your script:
```javascript
const ServiceController = require("nodejs-windows-service-controller");
```
&nbsp;
# Usage
___
Create a new instance of the service:
```javascript
const Superfetch = new ServiceController("Superfetch");
```

You can then use that instance for any of the following methods;

### ServiceController.changeStartupType(desiredStartupType)
```javscript
Superfetch.changeStartupType("Automatic");
````
Changes the startup type of the service to the desiredStartupType which can be any of the following;
* Automatic
* Boot
* Disabled
* Manual
* System

&nbsp;
### ServiceController.getInfo()
```javascript
Superfetch.getInfo();
```
Returns an object detailing the information surrounding the service with the below properties;
* #### <Bool> CanPauseAndContinue
  True if the service can be paused, otherwise false.

* #### <Bool> CanShutdown
  True if the service should be notified when the system is shutting down; otherwise, false.

* #### <Bool> CanStop
  True if the service can be stopped; otherwise, false.

* #### <String[]> DependentServices
  An array of the names of services which are dependent on this service.

* #### <String> DisplayName
  The friendly name of the service, which can be used to identify the service.

* #### <String> MachineName
  The name of the computer that is running the service.

* #### <String> ServiceName
  The name that identifies the service.

* #### <String[]> ServicesDependedOn
  An array of Services, each of which must be running for this service to run.

* #### <String> ServiceType
  The type of service that this object references.

* #### <String> StartType
  A value that indicates how the service starts.

* #### <String> Status
  Indicates whether the service is running, stopped, or paused, or whether a start, stop, pause, or continue command is pending.

&nbsp;
### ServiceController.start()
```javascript
Superfetch.start();
```
Starts the service if it is not already running


&nbsp;
### ServiceController.stop()
```javascript
Superfetch.stop();
```
Stops the service if it is running

&nbsp;
### ServiceController.waitForStatus(desiredStatus)
```javascript
Superfetch.waitForStatus("Running");
```
Blocks the process until the desired status is reached, the desired status can be any of the following:
* ContinuePending
* Paused
* PausePending
* Running
* StartPending
* Stopped
* StopPending

&nbsp;
### ServiceController.waitForStatusCallback(desiredStatus, callback)
```javascript
Superfetch.waitForStatusCallback("Running", ()=>{
    console.log("The service is running");
});
```
Wait until the desired status is reached and then execute the callback, the desired status can be any of the following
* ContinuePending
* Paused
* PausePending
* Running
* StartPending
* Stopped
* StopPending