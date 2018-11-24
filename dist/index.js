const ChildProcess = require("child_process");
const ServiceManagerBinary = "\"" + __dirname + "\\binaries\\ServiceManager.exe\"";

function FormatArgs(...Args){
	return Args.join(" ");
}

module.exports = function(serviceName = ""){
	if(require("os").platform().indexOf("win32") == -1){
		throw "Service Manager is only supported on Microsoft Windows";
	}

	this.ServiceName = serviceName;

	this.changeStartupType = (desiredStartupType)=>{
		if(["auto", "boot", "disabled", "demand", "system"].indexOf(desiredStartupType.toLowerCase()) == - 1)
			throw "Invalid Startup Type";

		ChildProcess.exec(FormatArgs("\"" + __dirname + "\\binaries\\SetStartupType.bat\"", this.ServiceName, desiredStartupType.toLowerCase()), {}, (err, stdout, stderr)=>{
			if(err) throw err;
			if(stderr) throw stderr;
		});
	};

	this.continue = ()=>{
		ChildProcess.exec(FormatArgs(ServiceManagerBinary, "Continue", this.ServiceName), {}, (err, stdout, stderr)=>{
			if(err) throw err;
			if(stderr) throw stderr;
		});
	}

	this.getInfo = ()=>{
		let Result = String.fromCharCode.apply(null, ChildProcess.execSync(FormatArgs(ServiceManagerBinary, "GetInfo", this.ServiceName)));
		Result = Result.replace("\"true\"", "true").replace("\"false\"", "false");
		return JSON.parse(Result);
	};

	this.pause = ()=>{
		ChildProcess.exec(FormatArgs(ServiceManagerBinary, "Pause", this.ServiceName), {}, (err, stdout, stderr)=>{
			if(err) throw err;
			if(stderr) throw stderr;
		});
	}

	this.start = ()=>{
		ChildProcess.exec(FormatArgs(ServiceManagerBinary, "Start", this.ServiceName), {}, (err, stdout, stderr)=>{
			if(err) throw err;
			if(stderr) throw stderr;
		});
	};

	this.stop = ()=>{
		ChildProcess.exec(FormatArgs(ServiceManagerBinary, "Stop", this.ServiceName), {}, (err, stdout, stderr)=>{
			if(err) throw err;
			if(stderr) throw stderr;
		});
	};

	this.waitForStatus = (desiredStatus)=>{
		if(["ContinuePending", "Paused", "PausePending", "Running", "StartPending", "Stopped", "StopPending"].indexOf(desiredStatus) == -1)
			throw "Invalid Status";

		ChildProcess.execSync(ServiceManagerBinary + " WaitForStatus " + this.ServiceName + " " + desiredStatus);
	}

	this.waitForStatusCallback = (desiredStatus, Callback)=>{
		if(["ContinuePending", "Paused", "PausePending", "Running", "StartPending", "Stopped", "StopPending"].indexOf(desiredStatus) == -1)
			throw "Invalid Status";

		ChildProcess.exec(FormatArgs(ServiceManagerBinary, "WaitForStatus", this.ServiceName, desiredStatus), {}, (err, stdout, stderr)=>{
			if(err) throw err;
			if(stderr) throw stderr;
			Callback();
		});
	}
};