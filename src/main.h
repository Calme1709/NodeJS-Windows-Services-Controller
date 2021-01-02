#include "ServiceController.h"
#include "ServiceEnumerator.h"
#include <napi.h>

using namespace std;

class NodeJSWindowsServiceManager : public Napi::ObjectWrap<NodeJSWindowsServiceManager> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  static Napi::Value GetServices(const Napi::CallbackInfo& info);
  NodeJSWindowsServiceManager(const Napi::CallbackInfo& info);

 private:
  ServiceController* service;

  Napi::Value ChangeStartupType(const Napi::CallbackInfo& info);
  Napi::Value Continue(const Napi::CallbackInfo& info);
  Napi::Value GetInfo(const Napi::CallbackInfo& info);
  Napi::Value Pause(const Napi::CallbackInfo& info);
  Napi::Value Start(const Napi::CallbackInfo& info);
  Napi::Value Stop(const Napi::CallbackInfo& info);
  Napi::Value WaitForStatus(const Napi::CallbackInfo& info);
};