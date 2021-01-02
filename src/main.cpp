#define ServiceString std::string

#include "main.h"

#include <codecvt>
#include <locale>
#include <sstream>

#include <iostream>

string GetLastErrorString() {
	//Get the error message, if any.
    DWORD errorMessageID = GetLastError();
    if(errorMessageID == 0){
        return std::string(); //No error message has been recorded
	}

    LPSTR messageBuffer = nullptr;
    size_t size = FormatMessageA(FORMAT_MESSAGE_ALLOCATE_BUFFER | FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_IGNORE_INSERTS,
								NULL, errorMessageID, MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT), (LPSTR)&messageBuffer, 0, NULL);

    std::string message(messageBuffer, size);

    //Free the buffer.
    LocalFree(messageBuffer);

    return message;
}

ServiceStartType StringToServiceStartType(wstring startType) {
	if(startType == L"Boot") return ServiceStartType::Boot;
	if(startType == L"System") return ServiceStartType::System;
	if(startType == L"Auto") return ServiceStartType::Auto;
	if(startType == L"Demand") return ServiceStartType::Demand;
	
	return ServiceStartType::Disabled;
}

wstring StringToWString(string str) {
	return std::wstring_convert<std::codecvt_utf8<wchar_t>>().from_bytes(str);
}

string WStringToString(wstring wstr) {
	std::wstring_convert<std::codecvt_utf8<wchar_t>, wchar_t> converter;

	return converter.to_bytes(wstr);
}

Napi::Object NodeJSWindowsServiceManager::Init(Napi::Env env, Napi::Object exports) {

	Napi::Function func = DefineClass(env, "NodeJSWindowsServiceManager", {
		InstanceMethod(
			"changeStartupType",
			&NodeJSWindowsServiceManager::ChangeStartupType
		),
		StaticMethod(
			"getServices",
			&NodeJSWindowsServiceManager::GetServices
		)
	});

	Napi::FunctionReference* constructor = new Napi::FunctionReference();
	*constructor = Napi::Persistent(func);
	env.SetInstanceData(constructor);

	exports.Set("default", func);
	return exports;
}

NodeJSWindowsServiceManager::NodeJSWindowsServiceManager(const Napi::CallbackInfo& info) : Napi::ObjectWrap<NodeJSWindowsServiceManager>(info) {
	#ifndef _WIN32
		Napi::Error::New(info.Env(), "This library is only supported on windows machines").ThrowAsJavaScriptException();

		return;
	#endif
	
	if (info.Length() <= 0 || !info[0].IsString()) {
		Napi::TypeError::New(info.Env(), "Expected a string for service name").ThrowAsJavaScriptException();

		return;
	}

	string serviceName = info[0].As<Napi::String>().Utf8Value();

	this->service = new ServiceController(serviceName);
}

Napi::Value NodeJSWindowsServiceManager::GetServices(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	auto promise = Napi::Promise::Deferred::New(env);

	Napi::Array array = Napi::Array::New(env);

	auto services = ServiceEnumerator::EnumerateServices();

	for(int i = 0; i < services.size(); i++) {
		Napi::Object serviceInfo = Napi::Object::New(env);

		Napi::Object serviceStatus = Napi::Object::New(env);

		serviceStatus.Set("serviceType", Napi::Number::New(env, services[i].Status.dwServiceType));
		serviceStatus.Set("currentState", Napi::Number::New(env, services[i].Status.dwCurrentState));
		serviceStatus.Set("controlsAccepted", Napi::Number::New(env, services[i].Status.dwControlsAccepted));
		serviceStatus.Set("win32ExitCode", Napi::Number::New(env, services[i].Status.dwWin32ExitCode));
		serviceStatus.Set("serviceSpecificExitCode", Napi::Number::New(env, services[i].Status.dwServiceSpecificExitCode));
		serviceStatus.Set("checkPoint", Napi::Number::New(env, services[i].Status.dwCheckPoint));
		serviceStatus.Set("waitHint", Napi::Number::New(env, services[i].Status.dwWaitHint));

		serviceInfo.Set("displayName", Napi::String::New(env, services[i].DisplayName));
		serviceInfo.Set("serviceName", Napi::String::New(env, services[i].ServiceName));
		serviceInfo.Set("status", serviceStatus);

		array.Set(i, serviceInfo);
	}

	promise.Resolve(array);

	return promise.Promise();
}

Napi::Value NodeJSWindowsServiceManager::ChangeStartupType(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	auto promise = Napi::Promise::Deferred::New(env);

	if(info.Length() <= 0 || !info[0].IsString()) {
		promise.Reject(Napi::TypeError::New(env, "Expected a string for the first argument").Value());
	} else {
		std::vector<string> startTypes {
			"Boot",
			"Boot",
			"System",
			"Auto",
			"Demand",
			"Disabled"
		};

		string startType = info[0].As<Napi::String>().Utf8Value();

		if(std::find(startTypes.begin(), startTypes.end(), startType) == startTypes.end()) {
			promise.Reject(Napi::TypeError::New(env, "Expected the first argument to be one of Auto, Boot, Disabled, Demand or System").Value());
		}

		ServiceStartType ServiceStartType = StringToServiceStartType(StringToWString(info[0].As<Napi::String>().Utf8Value()));

		boolean result = this->service->GetServiceConfig().ChangeStartType(ServiceStartType);

		if(result) {
			promise.Resolve(env.Undefined());
		} else {
			promise.Reject(Napi::Error::New(env, GetLastErrorString()).Value());
		}

	}

	return promise.Promise();
}

Napi::Object initAll(Napi::Env env, Napi::Object exports) {
	NodeJSWindowsServiceManager::Init(env, exports);

	return exports;
}

NODE_API_MODULE(addon, initAll)