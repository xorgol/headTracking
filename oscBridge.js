const OSC = require('osc-js')

DEFAULT_PORT = 9129;

// print process.argv
//process.argv.forEach(function (val, index, array) {
 //   console.log(index + ': ' + val);
 // });

 if ( process.argv.length > 2 )
 {
    if ( isNaN( parseInt( process.argv[ 2 ] ) ) )
    {
        throw "Port: not a number"
    }
    else
    {
        userInputPort = parseInt( process.argv[ 2 ] );
        console.log( "Port: " + userInputPort ); // returns "number"
        //console.log( process.argv[2] );
    }
 }
 else
 {
    userInputPort = DEFAULT_PORT;
 }

 if ( process.argv.length > 3 )
 {
    console.log( process.argv[ 3 ] );
 }

const config = { udpClient: { port: userInputPort } }
const oscBridge = new OSC( { plugin: new OSC.BridgePlugin( config ) } )

oscBridge.open();
console.log("OSC Bridge opened");