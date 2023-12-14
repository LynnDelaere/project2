"use strict";
/*
    Interfaces
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
/*
    Variables
*/
let colorRGB;
let colorPicker = -1;
let lampen = [];
let plugs = [];
/*
    Constants
    DO NOT CHANGE THIS CODE
*/
const colors = [
    { r: 0xe4, g: 0x3f, b: 0x00 },
    { r: 0xfa, g: 0xe4, b: 0x10 },
    { r: 0x55, g: 0xcc, b: 0x3b },
    { r: 0x09, g: 0xad, b: 0xff },
    { r: 0x6b, g: 0x0e, b: 0xfd },
    { r: 0xe7, g: 0x0d, b: 0x86 },
    { r: 0xe4, g: 0x3f, b: 0x00 }
];
/*
    Place information on DOM when loaded
*/
document.addEventListener('DOMContentLoaded', (event) => {
    let colorPickerElement = document.getElementById('choosecolor');
    colorPickerElement.style.display = "none";
    setColorListeners();
    placeShellyOnDom();
    placeHueOnDom();
    if (typeof plugs !== 'undefined' && plugs !== null) {
        setInterval(RefreshShellyInfo, 10000);
    }
});
/*
    Place Shelly information on the DOM and add eventlisteners
*/
function placeShellyOnDom() {
    return __awaiter(this, void 0, void 0, function* () {
        const shellyPlugInfo = yield getShellyPlugInfo();
        console.log(shellyPlugInfo);
        if (shellyPlugInfo) {
            for (const key in shellyPlugInfo.devices_status) {
                if (shellyPlugInfo.devices_status[key]._dev_info.code === "SHPLG-S") {
                    const plug = {
                        ip: shellyPlugInfo.devices_status[key].wifi_sta.ip,
                        id: shellyPlugInfo.devices_status[key]._dev_info.id,
                        device: key,
                        state: shellyPlugInfo.devices_status[key].relays[0].ison,
                        power: shellyPlugInfo.devices_status[key].meters[0].power
                    };
                    plugs.push(plug);
                }
            }
        }
        console.log("array plugs", plugs);
        if (plugs.length > 0) {
            const container = document.getElementById("container");
            plugs.forEach((plug, index) => {
                const item = document.createElement("div");
                item.classList.add("item");
                const itemBody = document.createElement("div");
                itemBody.classList.add("itembody");
                item.appendChild(itemBody);
                const plugIcon = document.createElement("i");
                plugIcon.classList.add("fa-solid", "fa-plug", "fa-2xl");
                plugIcon.id = `plug${plug.id}`;
                itemBody.appendChild(plugIcon);
                const deviceName = document.createElement("h5");
                deviceName.textContent = `${index}`;
                itemBody.appendChild(deviceName);
                const itemFooter = document.createElement("div");
                itemFooter.classList.add("itemfooter");
                item.appendChild(itemFooter);
                const footerInfo = document.createElement("div");
                footerInfo.classList.add("footerinfo");
                itemFooter.appendChild(footerInfo);
                const powerInfo = document.createElement("p");
                powerInfo.textContent = "Power";
                footerInfo.appendChild(powerInfo);
                const shellyPower = document.createElement("p");
                shellyPower.id = `shellypower${index}`;
                shellyPower.textContent = `${plug.power}W`;
                footerInfo.appendChild(shellyPower);
                itemFooter.appendChild(document.createElement("div"));
                const powerOffIcon = document.createElement("i");
                powerOffIcon.classList.add("fa-solid", "fa-power-off");
                powerOffIcon.id = `onoff${index}`;
                powerOffIcon.style.color = plug.state ? "green" : "red";
                itemFooter.appendChild(powerOffIcon);
                powerOffIcon.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    plug.state = !plug.state;
                    powerOffIcon.style.color = plug.state ? "green" : "red";
                    yield setPlugState(plug.device, plug.ip, plug.state ? "on" : "off");
                    console.log(plug.state);
                    const updatedPower = yield GetPlugPower(plug.id);
                    if (updatedPower != null) {
                        plug.power = updatedPower;
                        document.getElementById("shellypower" + index).textContent = updatedPower + "W";
                    }
                }));
                container.appendChild(item);
            });
        }
    });
}
/*
    Refresh the info of the shelly plugs
*/
function RefreshShellyInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        if (plugs.length > 0) {
            for (let i = 0; i < plugs.length; i++) {
                const plug = plugs[i];
                const power = yield GetPlugPower(plug.id);
                if (power != null) {
                    plug.power = power;
                    document.getElementById("shellypower" + i).textContent = power + "W";
                }
            }
        }
    });
}
/*
   Place the Philips Hue information on the DOM and add eventlisteners
*/
function placeHueOnDom() {
    return __awaiter(this, void 0, void 0, function* () {
        const lampInfo = yield getLampsInfo();
        console.log("lampinfo", lampInfo);
        if (!lampInfo) {
            console.log("No hue info");
            return;
        }
        for (const lampId in lampInfo) {
            const lamp = lampInfo[lampId];
            const dataLamp = {
                id: lampId,
                name: lamp.name,
                state: lamp.state.on,
                bri: lamp.state.bri,
                hue: lamp.state.hue,
                sat: lamp.state.sat
            };
            lampen.push(dataLamp);
            const container = document.getElementById("container");
            const item = document.createElement("div");
            item.classList.add("item");
            const itemBody = document.createElement("div");
            itemBody.classList.add("itembody");
            item.appendChild(itemBody);
            const lampIcon = document.createElement("i");
            lampIcon.classList.add("fa-solid", "fa-lightbulb", "fa-2xl");
            lampIcon.id = `bulb${dataLamp.id}`;
            lampIcon.style.color = `hsl(${(360 * dataLamp.hue) / 65535},${(100 * dataLamp.sat) / 254}%,${(100 * dataLamp.bri) / 254}%)`;
            itemBody.appendChild(lampIcon);
            const lampName = document.createElement("h5");
            lampName.textContent = `${dataLamp.name}`;
            itemBody.appendChild(lampName);
            const itemFooter = document.createElement("div");
            itemFooter.classList.add("itemfooter");
            item.appendChild(itemFooter);
            const paletteIcon = document.createElement("i");
            paletteIcon.classList.add("fa-solid", "fa-palette");
            paletteIcon.id = `color${dataLamp.id}`;
            itemFooter.appendChild(paletteIcon);
            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = "0";
            slider.max = "255";
            slider.classList.add("slider");
            slider.id = `dimming${dataLamp.id}`;
            slider.value = `${dataLamp.bri}`;
            itemFooter.appendChild(slider);
            const powerIcon = document.createElement("i");
            powerIcon.classList.add("fa-solid", "fa-power-off");
            powerIcon.id = `power${dataLamp.id}`;
            powerIcon.style.color = dataLamp.state ? "green" : "red";
            itemFooter.appendChild(powerIcon);
            powerIcon.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                const newState = !dataLamp.state;
                const result = yield setLightState(Number(dataLamp.id), newState);
                if (result) {
                    dataLamp.state = newState;
                    powerIcon.style.color = newState ? "green" : "red";
                }
            }));
            paletteIcon.addEventListener("click", () => {
                colorPicker = lampen.indexOf(dataLamp);
                const colorPickerElement = document.getElementById('choosecolor');
                if (colorPickerElement.style.display === "block") {
                    colorPickerElement.style.display = "none";
                }
                else {
                    colorPickerElement.style.display = "block";
                }
            });
            slider.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () {
                console.log("slider value", slider.value);
                dataLamp.bri = parseInt(slider.value);
                yield setLightBri(Number(dataLamp.id), dataLamp.bri);
            }));
            container.appendChild(item);
        }
    });
}
/*
    Add Eventlisteners to the colorwheel to calculate the RGB values when moving the cursor
    Add Eventlisteners when color is picked by clicking on it.
    DO NOT CHANGE THIS CODE
*/
function setColorListeners() {
    document.getElementById('color-wheel').addEventListener('mousemove', function (e) {
        var rect = e.target.getBoundingClientRect();
        // Calculate Cartesian coordinates as if the circle radius were 1
        var x = 2 * (e.clientX - rect.left) / (rect.right - rect.left) - 1;
        var y = 1 - 2 * (e.clientY - rect.top) / (rect.bottom - rect.top);
        // Calculate the angle in degrees with 0 at the top and rotate clockwise as expected by css conical gradient
        var a = ((Math.PI / 2 - Math.atan2(y, x)) / Math.PI * 180);
        if (a < 0)
            a += 360;
        // Draw the angle between 0 and the number of colors in the gradient minus one
        a = a / 360 * (colors.length - 1); // minus one because the last item is at 360°, which is the same as 0°
        // Calculate the colors to interpolate
        var a0 = Math.floor(a) % colors.length;
        var a1 = (a0 + 1) % colors.length;
        var c0 = colors[a0];
        var c1 = colors[a1];
        // Calculate the weights and interpolate colors
        var a1w = a - Math.floor(a);
        var a0w = 1 - a1w;
        colorRGB = {
            r: c0.r * a0w + c1.r * a1w,
            g: c0.g * a0w + c1.g * a1w,
            b: c0.b * a0w + c1.b * a1w
        };
        // Calculate the radius
        var r = Math.sqrt(x * x + y * y);
        if (r > 1)
            r = 1;
        // Calculate the white weight, interpolate, and round to a whole number
        var cw = r < 0.8 ? (r / 0.8) : 1;
        var ww = 1 - cw;
        colorRGB.r = Math.round(colorRGB.r * cw + 255 * ww);
        colorRGB.g = Math.round(colorRGB.g * cw + 255 * ww);
        colorRGB.b = Math.round(colorRGB.b * cw + 255 * ww);
    });
    document.getElementById('color-wheel').addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        // Convert the chosen RGB color to HSL
        let hsl = rgbToHSB(colorRGB.r, colorRGB.g, colorRGB.b);
        console.log(lampen, colorPicker, hsl);
        lampen[colorPicker].hue = hsl.hue;
        lampen[colorPicker].bri = hsl.bri;
        lampen[colorPicker].sat = hsl.sat;
        // Setting the color on the lamp
        yield setLightColor(Number(lampen[colorPicker].id), lampen[colorPicker].hue, lampen[colorPicker].bri, lampen[colorPicker].sat);
        // Adjust the information on the DOM
        document.getElementById("bulb" + lampen[colorPicker].id).style.color = "hsl(" + (360 * lampen[colorPicker].hue / 65535) + "," + (100 * lampen[colorPicker].sat / 254) + "%," + (100 * lampen[colorPicker].bri / 254) + "%)";
        document.getElementById("dimming" + lampen[colorPicker].id).value = lampen[colorPicker].bri;
        // deactivate colorpicker again
        colorPicker = -1;
        document.getElementById('choosecolor').style.display = "none";
    }));
}
