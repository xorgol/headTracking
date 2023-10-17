const OSC = require('osc-js')

const config = { udpClient: { port: 9129 } }
const oscBridge = new OSC({ plugin: new OSC.BridgePlugin(config) })

oscBridge.open();
console.log("OSC Bridge opened");