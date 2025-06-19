// Keyboard input handling
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function isKeyPressed(keyCode) {
    return !!keys[keyCode];
}

// Gamepad (joystick) input handling
let gamepadState = {};

function pollGamepads() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (gamepads[0]) {
        const gp = gamepads[0];
        gamepadState = {
            up: gp.axes[1] < -0.5,
            down: gp.axes[1] > 0.5,
            left: gp.axes[0] < -0.5,
            right: gp.axes[0] > 0.5,
            buttonA: gp.buttons[0]?.pressed,
            buttonB: gp.buttons[1]?.pressed,
            // Add more buttons as needed
        };
    } else {
        gamepadState = {};
    }
}

function isGamepadPressed(action) {
    return !!gamepadState[action];
}

// Call this in your game loop to update gamepad state
function updateInput() {
    pollGamepads();
}

export { isKeyPressed, isGamepadPressed, updateInput };