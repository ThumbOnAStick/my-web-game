import { UIManager } from "../jsmanagers/uimanager.js";
export const changeSubtitleEvent = "change_subtitle";

/**
 * @type {UIManager}
 */
export let uiManager = null;

/**
 * @param {String} data
 */
export function changeSubtitle(data) {
    if(uiManager){
        uiManager.changeSubtitle(data);
    }
}


/**
 * @param {UIManager} uiManager_p
 */
export function initialize_ui(uiManager_p){
    uiManager = uiManager_p;
}
