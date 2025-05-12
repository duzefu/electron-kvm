const keyboardHook = require('./build/Release/keyboard_hook.node');

class KeyboardHookManager {
    constructor() {
        this.isHooked = false;
    }

    install() {
        if (!this.isHooked) {
            this.isHooked = keyboardHook.installHook();
            return this.isHooked;
        }
        return false;
    }

    uninstall() {
        if (this.isHooked) {
            keyboardHook.uninstallHook();
            this.isHooked = false;
            return true;
        }
        return false;
    }
}

module.exports = new KeyboardHookManager(); 