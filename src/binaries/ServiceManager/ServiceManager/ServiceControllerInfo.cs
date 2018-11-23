using System.Linq;
using System.ServiceProcess;

namespace ServiceManager {
	public class ServiceControllerInfo {
		public bool CanPauseAndContinue;
		public bool CanShutdown;
		public bool CanStop;
		public string[] DependentServices;
		public string DisplayName;
		public string MachineName;
		public string ServiceName;
		public string[] ServicesDependedOn;
		public string ServiceType;
		public string StartType;
		public string Status;

		public ServiceControllerInfo(ServiceController Sc) {
			CanPauseAndContinue = Sc.CanPauseAndContinue;
			CanShutdown = Sc.CanShutdown;
			CanStop = Sc.CanStop;
			DependentServices = Sc.DependentServices.Select(sc => sc.DisplayName).ToArray();
			DisplayName = Sc.DisplayName;
			MachineName = Sc.MachineName;
			ServiceName = Sc.ServiceName;
			ServicesDependedOn = Sc.ServicesDependedOn.Select(sc => sc.DisplayName).ToArray();
			ServiceType = Sc.ServiceType.ToString();
			StartType = Sc.StartType.ToString();
			Status = Sc.Status.ToString();
		}
	}
}
