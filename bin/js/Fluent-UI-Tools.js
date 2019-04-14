//Fluent UI Tools for Node.js
//Written 03/14/2019 by Chris Yates

//This Node.js module defines a couple of simple
//methods for checking system-wide UI prefs in
//Windows 10. This allows for a graphical 
//app to comply with the user's Windows UI. 

//The 'windows-registy' module is required, use
//npm to install it by name in your project, along
//with npm's windows-build-tools. (see readme.md)

const reg = require('windows-registry');

//Honey, where are my keys? 😂
var PrsnReg = new reg.Key(reg.windef.HKEY.HKEY_CURRENT_USER, 'Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize', reg.windef.KEY_ACCESS.KEY_ALL_ACCESS)
var DWMReg = new reg.Key(reg.windef.HKEY.HKEY_CURRENT_USER, 'Software\\Microsoft\\Windows\\DWM', reg.windef.KEY_ACCESS.KEY_ALL_ACCESS)

function appUsesLightTheme(){
    //Will check to see if the user's preference is a light or dark window theme
    return PrsnReg.getValue('AppsUseLightTheme').toJSON().data[0];
}
function systemUsesLightTheme(){
    //Will check to see if the system panels and elements use a light or dark theme
    return PrsnReg.getValue('SystemUsesLightTheme').toJSON().data[0];
}
function enabledTransparency(){
    //Will check to see if the user has transparency effects enabled
    return PrsnReg.getValue('EnableTransparency').toJSON().data[0];
}
function systemColorPrevalence(){
    //Will check to see if the user has the accent color enabled on system UI elements like the Taskbar and Action Center
    return PrsnReg.getValue('ColorPrevalence').toJSON().data[0];
}
function appColorPrevalence(){
    //Will check to see if the user has the accent color enabled for app UI elements like title bars and window borders
    return DWMReg.getValue('ColorPrevalence').toJSON().data[0];
}
function getAccentColor(){
    //Will get the hexadecimal value of the current accent color Windows is using
    //The first byte is the transparency factor in hex. the rest is RGB.
    return DWMReg.getValue('ColorizationColor').toJSON().data.toString();
}
module.exports = { appUsesLightTheme, systemUsesLightTheme, enabledTransparency, systemColorPrevalence, appColorPrevalence, getAccentColor }