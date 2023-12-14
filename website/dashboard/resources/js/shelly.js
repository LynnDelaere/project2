"use strict";
/*
    Shelly core functions
    DO NOT CHANGE THIS CODE
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const authkey = "MTVlYzc3dWlkDB5E86A0F5E2BF8C58A65BAA50265BC161828E309AD1719A9750A4832485CAEDB9C23A960C935FC7";
const host = "https://shelly-58-eu.shelly.cloud";
/*
    Get plug information of all plugs
*/
function getShellyPlugInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let response = yield window.fetch(`${host}/device/all_status?show_info=true&no_shared=true&auth_key=${authkey}`, { method: "GET" });
            let json = yield response.json();
            return yield json.data;
        }
        catch (_a) {
            return undefined;
        }
    });
}
;
/*
    Get the power information of a shelly plug
    id = number of the plug
    authkey = the authkey of your shelly cloud account
*/
function GetPlugPower(id) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log(`${host}/device/status?id=${id}&auth_key=${authkey}`);
        const response = yield fetch(`${host}/device/status?id=${id}&auth_key=${authkey}`, { method: "GET" });
        const json = yield response.json();
        //console.log(json.data.device_status.meters[0].power);
        return json.data.device_status.meters[0].power;
    });
}
;
/*
    Turn a specific plug on or off
    id = number of the plug
    state = true or false
*/
function setPlugState(device, ip, state) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('f(', device, ',', ip, ',', state, ')');
        const response = yield fetch(`http://${ip}/relay/0?turn=${state}`, { method: "POST", mode: 'no-cors', headers: { 'Content-Type': 'application/json' } });
    });
}
;
