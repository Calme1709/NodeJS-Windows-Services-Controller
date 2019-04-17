const ChildProcess = require("child_process");
const ServiceManagerBinary = "\"" + __dirname + "\\binaries\\ServiceManager.exe\"";

module.exports = class ServiceManager{
	constructor(ServiceName){
		if(require("os").platform().indexOf("win32") == -1){
			throw "Service Manager is only supported on Microsoft Windows";
		}

		this.ServiceName = ServiceName;
	}

	execute(Command, JsonEncoded = false){
		return new Promise((resolve, reject)=>{
			ChildProcess.exec(Command, {}, (err, stdout, stderr)=>{
				if(err) {
					reject(err);
					return;
				}
					
				if(stderr) {
					reject(stderr);
					return;
				}

				resolve(JsonEncoded ? JSON.parse(stdout) : stdout);
			});
		});
	}

	changeStartupType(desiredStartupType){
		if(["auto", "boot", "disabled", "demand", "system"].indexOf(desiredStartupType.toLowerCase()) == - 1)
			throw "Invalid Startup Type";

		return this.execute(["\"" + __dirname + "\\binaries\\SetStartupType.bat\"", this.ServiceName, desiredStartupType.toLowerCase()].join(" "));
	}

	continue(){
		return this.execute([ServiceManagerBinary, "Continue", this.ServiceName].join(" "));
	}

	getInfo(){
		return this.execute([ServiceManagerBinary, "GetInfo", this.ServiceName].join(" "), true);
	}

	pause(){
		return this.execute([ServiceManagerBinary, "Pause", this.ServiceName].join(" "));
	}

	start(){
		return this.execute([ServiceManagerBinary, "Start", this.ServiceName].join(" "));
	}

	stop(){
		return this.execute([ServiceManagerBinary, "Stop", this.ServiceName].join(" "));
	}

	waitForStatus(desiredStatus){
		if(["ContinuePending", "Paused", "PausePending", "Running", "StartPending", "Stopped", "StopPending"].indexOf(desiredStatus) == -1)
			throw "Invalid Status";

		return this.execute([ServiceManagerBinary, "WaitForStatus", this.ServiceName, desiredStatus].join(" "));
	}
}