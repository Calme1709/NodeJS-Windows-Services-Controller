using System;
using System.ServiceProcess;
using System.ComponentModel;
using System.Runtime.InteropServices;

namespace ServiceManager {
	public static class ServiceControllerExtensions {
		[DllImport("advapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
		public static extern Boolean ChangeServiceConfig(IntPtr hService, UInt32 nServiceType, UInt32 nStartType, UInt32 nErrorControl, String lpBinaryPathName, String lpLoadOrderGroup, IntPtr lpdwTagId, [In] char[] lpDependencies, String lpServiceStartName, String lpPassword, String lpDisplayName);

		[DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Auto)]
		static extern IntPtr OpenService(IntPtr hSCManager, string lpServiceName, uint dwDesiredAccess);

		[DllImport("advapi32.dll", EntryPoint = "OpenSCManagerW", ExactSpelling = true, CharSet = CharSet.Unicode, SetLastError = true)]
		public static extern IntPtr OpenSCManager(string machineName, string databaseName, uint dwAccess);

		[DllImport("advapi32.dll", EntryPoint = "CloseServiceHandle")]
		public static extern int CloseServiceHandle(IntPtr hSCObject);

		public static void ChangeStartMode(this ServiceController svc, ServiceStartMode mode) {
			var scManagerHandle = OpenSCManager(null, null, 0x000F003F);
			if (scManagerHandle == IntPtr.Zero)
				throw new ExternalException("Open Service Manager Error");

			IntPtr serviceHandle = OpenService(scManagerHandle, svc.ServiceName, 0x00000001 | 0x00000002);

			if (serviceHandle == IntPtr.Zero)
				throw new ExternalException("Open Service Error");

			if (!ChangeServiceConfig(serviceHandle, 0xFFFFFFFF, (uint)mode, 0xFFFFFFFF, null, null, IntPtr.Zero, null, null, null, null))
				throw new ExternalException("Could not change service start type: " + new Win32Exception(Marshal.GetLastWin32Error()).Message);

			CloseServiceHandle(serviceHandle);
			CloseServiceHandle(scManagerHandle);
		}
	}
}
