const ChildProcess = require("child_process");
const ServiceManagerBinary = "\"" + __dirname + "\\binaries\\ServiceManager.exe\"";

module.exports = function(serviceName = ""){
	if(require("os").platform().indexOf("win32") == -1){
		throw "Service Manager is only supported on Microsoft Windows";
	}

	this.ServiceName = serviceName;

	this.execute = (Command, JsonEncoded = false)=>{
		return new Promise((resolve, reject)=>{
			ChildProcess.exec(Command, {}, (err, stdout, stderr)=>{
				if(err)
					reject(err);

				if(stderr)
					reject(stderr);

				resolve(JsonEncoded ? JSON.parse(stdout) : stdout);
			});
		});
	};

	this.changeStartupType = (desiredStartupType)=>{
		if(["auto", "boot", "disabled", "demand", "system"].indexOf(desiredStartupType.toLowerCase()) == - 1)
			console.log("Invalid Startup Type");

		return this.execute(["\"" + __dirname + "\\binaries\\SetStartupType.bat\"", this.ServiceName, desiredStartupType.toLowerCase()].join(" "));
	};

	this.continue = ()=>{
		return this.execute([ServiceManagerBinary, "Continue", this.ServiceName].join(" "));
	};

	this.getInfo = ()=>{
		return this.execute([ServiceManagerBinary, "GetInfo", this.ServiceName].join(" "), true);
	};

	this.pause = ()=>{
		return this.execute([ServiceManagerBinary, "Pause", this.ServiceName].join(" "));
	};

	this.start = ()=>{
		return this.execute([ServiceManagerBinary, "Start", this.ServiceName].join(" "));
	};

	this.stop = ()=>{
		return this.execute([ServiceManagerBinary, "Stop", this.ServiceName].join(" "));
	};

	this.waitForStatus = (desiredStatus, Callback)=>{
		if(["ContinuePending", "Paused", "PausePending", "Running", "StartPending", "Stopped", "StopPending"].indexOf(desiredStatus) == -1)
			throw "Invalid Status";
		
		return this.execute([ServiceManagerBinary, "WaitForStatus", this.ServiceName, desiredStatus].join(" "));
	};
};