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
					if (Sc.CanPauseAndContinue && Sc.Status == ServiceControllerStatus.Paused) {
						Sc.Continue();
						Sc.WaitForStatus(ServiceControllerStatus.Running);
					}
				return;

				case "GetInfo":
					Console.WriteLine(JsonConvert.SerializeObject(new ServiceControllerInfo(Sc)));
				return;

				case "Pause":
					if (Sc.CanPauseAndContinue && Sc.Status == ServiceControllerStatus.Running) {
						Sc.Pause();
						Sc.WaitForStatus(ServiceControllerStatus.Paused);
					}
				return;

				case "Start":
					if (Sc.Status == ServiceControllerStatus.Stopped)
						Sc.Start();

					Sc.WaitForStatus(ServiceControllerStatus.Running);
				return;

				case "Stop":
					if (Sc.CanStop && Sc.Status == ServiceControllerStatus.Running)
						Sc.Stop();

					Sc.WaitForStatus(ServiceControllerStatus.Stopped);
				return;

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
					return;

				default:
					throw new Exception("Command is invalid");
			}
		}
	}
}