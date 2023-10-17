import * as THREE from "three";
import { MindARThree } from "mindar-face-three";
var osc = new OSC();
osc.open({ port: document.querySelector("#port").value });


const mindarThree = new MindARThree({
  container: document.querySelector("#container"),
});
const { renderer, scene, camera } = mindarThree;
const anchor = mindarThree.addAnchor(1);
const geometry = new THREE.SphereGeometry(0.1, 32, 16);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.5,
});
const sphere = new THREE.Mesh(geometry, material);
anchor.group.add(sphere);
const rotationQuaternion = new THREE.Quaternion();
const positionVector = new THREE.Vector3();
const axesHelper = new THREE.AxesHelper(1);
sphere.add(axesHelper);
const start = async () => {
  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
    positionVector.setFromMatrixPosition(sphere.modelViewMatrix);
    rotationQuaternion.setFromRotationMatrix(sphere.modelViewMatrix);
    if (!document.querySelector("#position").checked) {
      document
        .querySelector("#posLabels")
        .setAttribute("style", "display:none");
    } else {
      document
        .querySelector("#posLabels")
        .setAttribute("style", "display:block");
      document.querySelector("#posX").innerHTML =
        "X: " + positionVector["x"].toString();
      document.querySelector("#posY").innerHTML =
        "Y: " + positionVector["y"].toString();
      document.querySelector("#posZ").innerHTML =
        "Z: " + positionVector["z"].toString();
    }
    if (!document.querySelector("#rotation").checked) {
      document
        .querySelector("#rotLabels")
        .setAttribute("style", "display:none");
    } else {
      document
        .querySelector("#rotLabels")
        .setAttribute("style", "display:block");
      document.querySelector("#rotW").innerHTML =
        "W: " + rotationQuaternion["_w"].toString();
      document.querySelector("#rotX").innerHTML =
        "X: " + rotationQuaternion["_x"].toString();
      document.querySelector("#rotY").innerHTML =
        "Y: " + rotationQuaternion["_y"].toString();
      document.querySelector("#rotZ").innerHTML =
        "Z: " + rotationQuaternion["_z"].toString();
      const message = new OSC.Message(
        "SceneRotator/quaternions",
        rotationQuaternion["_w"].toString(),
        rotationQuaternion["_x"].toString(),
        rotationQuaternion["_y"].toString(),
        rotationQuaternion["_z"].toString()
      );
      osc.send(message);
    }
    // console.log(rotationQuaternion.setFromRotationMatrix(sphere.modelViewMatrix));
    // console.log(positionVector.setFromMatrixPosition(sphere.modelViewMatrix));
  });
};
const startButton = document.querySelector("#startButton");
startButton.addEventListener("click", () => {
  start();
});
stopButton.addEventListener("click", () => {
  mindarThree.stop();
  mindarThree.renderer.setAnimationLoop(null);
});
