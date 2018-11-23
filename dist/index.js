const ChildProcess = require("child_process");
const ServiceManagerBinary = "\"" + __dirname + "\\bin\\ServiceManager.exe\"";

function FormatArgs(...Args){
	return Args.join(" ");
}

module.exports = function(ServiceName = ""){
	this.ServiceName =  ServiceName;
	if(require("os").platform().indexOf("win32") == -1){
		throw "Service Manager is only supported on Microsoft Windows";
	}

	this.getInfo = ()=>{
		let Result = String.fromCharCode.apply(null, ChildProcess.execSync(FormatArgs(ServiceManagerBinary, "GetInfo", this.ServiceName)));
		Result = Result.replace("\"true\"", "true").replace("\"false\"", "false");
		return JSON.parse(Result);
	};

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

	this.changeStartupType = (StartupType)=>{
		ChildProcess.exec(FormatArgs(ServiceManagerBinary, "ChangeStartupType", this.ServiceName, StartupType), {}, (err, stdout, stderr)=>{
			if(err) throw err;
			if(stderr) throw stderr;
		});
	};

	this.waitForStatusCallback = (desiredStatus, Callback)=>{
		ChildProcess.exec(FormatArgs(ServiceManagerBinary, "WaitForStatus", this.ServiceName, desiredStatus), {}, (err, stdout, stderr)=>{
			if(err) throw err;
			if(stderr) throw stderr;
			Callback();
		});
	}

	this.waitForStatus = (desiredStatus)=>{
		ChildProcess.execSync(ServiceManagerBinary + " WaitForStatus " + this.ServiceName + " " + desiredStatus);
	}
};