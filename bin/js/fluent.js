const Fluent = require('./Fluent-UI-Tools');
console.log('Are titlebars and window borders accented?')
console.log(Fluent.appColorPrevalence())

console.log('Is the taskbar or action center accented?')
console.log(Fluent.systemColorPrevalence())

console.log('Are apps using light theme?')
console.log(Fluent.appUsesLightTheme())

console.log('Is the system using light theme?')
console.log(Fluent.systemUsesLightTheme())

console.log('Are transparency effects enabled?')
console.log(Fluent.enabledTransparency())

console.log('What is the system accent color?')
console.log(Fluent.getAccentColor())