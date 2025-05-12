#include <windows.h>
#include <node_api.h>

HHOOK keyboardHook = NULL;
bool isHooked = false;

// Keyboard hook callback function
LRESULT CALLBACK KeyboardProc(int nCode, WPARAM wParam, LPARAM lParam) {
    if (nCode >= 0) {
        KBDLLHOOKSTRUCT* kbStruct = (KBDLLHOOKSTRUCT*)lParam;
        
        // Check system hotkeys
        if ((kbStruct->vkCode == VK_TAB && (GetAsyncKeyState(VK_MENU) & 0x8000)) ||    // Alt+Tab
            (kbStruct->vkCode == VK_ESCAPE && (GetAsyncKeyState(VK_MENU) & 0x8000)) ||  // Alt+Esc
            (kbStruct->vkCode == VK_LWIN || kbStruct->vkCode == VK_RWIN))               // Windows key
        {
            return 1; // Block event
        }
    }
    return CallNextHookEx(keyboardHook, nCode, wParam, lParam);
}

// Install hook
napi_value InstallHook(napi_env env, napi_callback_info info) {
    if (!isHooked) {
        keyboardHook = SetWindowsHookEx(WH_KEYBOARD_LL, KeyboardProc, NULL, 0);
        isHooked = true;
    }
    
    napi_value result;
    napi_get_boolean(env, keyboardHook != NULL, &result);
    return result;
}

// Uninstall hook
napi_value UninstallHook(napi_env env, napi_callback_info info) {
    if (isHooked && keyboardHook != NULL) {
        UnhookWindowsHookEx(keyboardHook);
        keyboardHook = NULL;
        isHooked = false;
    }
    
    napi_value result;
    napi_get_boolean(env, true, &result);
    return result;
}

// Initialize module
napi_value Init(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
        { "installHook", NULL, InstallHook, NULL, NULL, NULL, napi_default, NULL },
        { "uninstallHook", NULL, UninstallHook, NULL, NULL, NULL, napi_default, NULL }
    };
    
    napi_define_properties(env, exports, 2, desc);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init) 