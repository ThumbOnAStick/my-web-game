import { GlobalUIManager } from "../jsmanagers/globaluimanager.js";
export const changeSubtitleEvent = "change_subtitle";

/**
 * @type {GlobalUIManager}
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
 * @param {GlobalUIManager} uiManager_p
 */
export function initialize_ui(uiManager_p){
    uiManager = uiManager_p;
}
