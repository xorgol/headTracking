# Architecture
In index.html we import mind_ar and three.js. Mind_ar accesses the webcam, and uses a pre-trained Tensorflow network compiled to WASM to track the user's face, mapping a mesh with 468 anchor points to the face itself. We take anchor point 1, which is the tip of the nose, and attach a sphere and an axes helper in three.js.
We extract the modelViewMatrix of the sphere, which is the uniform matrix transform between the camera and the sphere itself. From this we extract translation and rotation.

Using osc-js we send translation and rotation messages through WebSockets, using the default port.

oscBridge.js receives those messages on the default port, and re-transmits them on port 9129 as proper OSC messages (UDP). oscBridge.js should already be running when the web part of the system is loaded, so that binding on the default port can take place.

Start oscBridge.js with `node oscBridge.js`
Start the web component using the Live Server extension in Visual Studio Code.