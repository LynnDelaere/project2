/* 
    Shelly core functions 
    DO NOT CHANGE THIS CODE  
*/

const authkey = "MTVlYzc3dWlkDB5E86A0F5E2BF8C58A65BAA50265BC161828E309AD1719A9750A4832485CAEDB9C23A960C935FC7";
const host = "https://shelly-58-eu.shelly.cloud";

/*
    Get plug information of all plugs
*/

async function getShellyPlugInfo(): Promise<any> {
    try{
        let response = await window.fetch(`${host}/device/all_status?show_info=true&no_shared=true&auth_key=${authkey}`, { method: "GET" });
        let json = await response.json();    
        return await json.data;
    } 
    catch{
        return undefined;
    }
};

/*
    Get the power information of a shelly plug
    id = number of the plug
    authkey = the authkey of your shelly cloud account
*/

async function GetPlugPower(id: string): Promise<any> {
    //console.log(`${host}/device/status?id=${id}&auth_key=${authkey}`);
    const response = await fetch(`${host}/device/status?id=${id}&auth_key=${authkey}`, { method: "GET" });
    const json = await response.json();    
    //console.log(json.data.device_status.meters[0].power);
    return json.data.device_status.meters[0].power;
};

/*
    Turn a specific plug on or off
    id = number of the plug
    state = true or false
*/

async function setPlugState(device: string, ip: string, state: string): Promise<any> {
    console.log('f(',device,',',ip,',',state,')');
    const response = await fetch(`http://${ip}/relay/0?turn=${state}`, { method: "POST", mode:'no-cors', headers: { 'Content-Type': 'application/json'}});
};

