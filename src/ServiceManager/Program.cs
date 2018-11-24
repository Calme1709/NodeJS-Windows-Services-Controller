using System;
using System.Collections.Generic;
using System.ServiceProcess;
using Newtonsoft.Json;

namespace ServiceManager {
	class Program {
		static void Main(string[] args) {
			if (args.Length < 2)
				throw new Exception("Command or Service Name was not set");

			ServiceController Sc = new ServiceController(args[1]);

			switch (args[0]) {
				case "Continue":
					Sc.Continue();
				break;

				case "GetInfo":
					Console.WriteLine(JsonConvert.SerializeObject(new ServiceControllerInfo(Sc)));
				break;

				case "Pause":
					Sc.Pause();
				break;

				case "Start":
					if (Sc.Status != ServiceControllerStatus.Running)
						Sc.Start();
				break;

				case "Stop":
					if(Sc.Status != ServiceControllerStatus.Stopped)
						Sc.Stop();
				break;

				case "WaitForStatus":
					if(Array.IndexOf(new string[] { "ContinuePending", "Paused", "PausePending", "Running", "StartPending", "Stopped", "StopPending" }, args[2]) == -1)
						throw new Exception("Status is not valid");

					Sc.WaitForStatus(new Dictionary<string, ServiceControllerStatus>() {
						{ "ContinuePending", ServiceControllerStatus.ContinuePending },
						{ "Paused", ServiceControllerStatus.Paused },
						{ "PausePending", ServiceControllerStatus.PausePending },
						{ "Running", ServiceControllerStatus.Running },
						{ "StartPending", ServiceControllerStatus.StartPending },
						{ "Stopped", ServiceControllerStatus.Stopped },
						{ "StopPending", ServiceControllerStatus.StopPending }
					}[args[2]]);
				break;

				default:
					throw new Exception("Command is invalid");
			}
		}
	}
}