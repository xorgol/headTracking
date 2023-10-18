import { Scene as u, WebGLRenderer as g, sRGBEncoding as w, PerspectiveCamera as y, Mesh as M, MeshStandardMaterial as x, Group as f, BufferGeometry as A, BufferAttribute as R } from "three";
import { CSS3DRenderer as b } from "three/addons/renderers/CSS3DRenderer.js";
import { C as S } from "./controller-c792144c.js";
import { U as I } from "./ui-85e81035.js";
const E = { BufferGeometry: A, BufferAttribute: R };
class C {
  constructor({
    container: n,
    uiLoading: t = "yes",
    uiScanning: o = "yes",
    uiError: r = "yes",
    filterMinCF: s = null,
    filterBeta: i = null,
    userDeviceId: a = null,
    environmentDeviceId: d = null
  }) {
    this.container = n, this.ui = new I({ uiLoading: t, uiScanning: o, uiError: r }), this.controller = new S({
      filterMinCF: s,
      filterBeta: i
    }), this.scene = new u(), this.cssScene = new u(), this.renderer = new g({ antialias: !0, alpha: !0 }), this.cssRenderer = new b({ antialias: !0 }), this.renderer.outputEncoding = w, this.renderer.setPixelRatio(window.devicePixelRatio), this.camera = new y(), this.userDeviceId = a, this.environmentDeviceId = d, this.anchors = [], this.faceMeshes = [], this.container.appendChild(this.renderer.domElement), this.container.appendChild(this.cssRenderer.domElement), this.shouldFaceUser = !0, window.addEventListener("resize", this._resize.bind(this));
  }
  async start() {
    this.ui.showLoading(), await this._startVideo(), await this._startAR(), this.ui.hideLoading();
  }
  stop() {
    this.video.srcObject.getTracks().forEach(function(t) {
      t.stop();
    }), this.video.remove(), this.controller.stopProcessVideo();
  }
  switchCamera() {
    this.shouldFaceUser = !this.shouldFaceUser, this.stop(), this.start();
  }
  addFaceMesh() {
    const n = this.controller.createThreeFaceGeometry(E), t = new M(n, new x({ color: 16777215 }));
    return t.visible = !1, t.matrixAutoUpdate = !1, this.faceMeshes.push(t), t;
  }
  addAnchor(n) {
    const t = new f();
    t.matrixAutoUpdate = !1;
    const o = { group: t, landmarkIndex: n, css: !1 };
    return this.anchors.push(o), this.scene.add(t), o;
  }
  addCSSAnchor(n) {
    const t = new f();
    t.matrixAutoUpdate = !1;
    const o = { group: t, landmarkIndex: n, css: !0 };
    return this.anchors.push(o), this.cssScene.add(t), o;
  }
  _startVideo() {
    return new Promise((n, t) => {
      if (this.video = document.createElement("video"), this.video.setAttribute("autoplay", ""), this.video.setAttribute("muted", ""), this.video.setAttribute("playsinline", ""), this.video.style.position = "absolute", this.video.style.top = "0px", this.video.style.left = "0px", this.video.style.zIndex = "-2", this.container.appendChild(this.video), !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.ui.showCompatibility(), t();
        return;
      }
      const o = {
        audio: !1,
        video: {}
      };
      this.shouldFaceUser ? this.userDeviceId ? o.video.deviceId = { exact: this.userDeviceId } : o.video.facingMode = "user" : this.environmentDeviceId ? o.video.deviceId = { exact: this.environmentDeviceId } : o.video.facingMode = "environment", navigator.mediaDevices.getUserMedia(o).then((r) => {
        this.video.addEventListener("loadedmetadata", () => {
          this.video.setAttribute("width", this.video.videoWidth), this.video.setAttribute("height", this.video.videoHeight), n();
        }), this.video.srcObject = r;
      }).catch((r) => {
        console.log("getUserMedia error", r), t();
      });
    });
  }
  _startAR() {
    return new Promise(async (n, t) => {
      const o = this.video;
      this.container, this.controller.onUpdate = ({ hasFace: r, estimateResult: s }) => {
        for (let i = 0; i < this.anchors.length; i++)
          this.anchors[i].css ? this.anchors[i].group.children.forEach((a) => {
            a.element.style.visibility = r ? "visible" : "hidden";
          }) : this.anchors[i].group.visible = r;
        for (let i = 0; i < this.faceMeshes.length; i++)
          this.faceMeshes[i].visible = r;
        if (r) {
          const { metricLandmarks: i, faceMatrix: a, faceScale: d } = s;
          for (let h = 0; h < this.anchors.length; h++) {
            const c = this.anchors[h].landmarkIndex, e = this.controller.getLandmarkMatrix(c);
            if (this.anchors[h].css) {
              const l = [
                1e-3 * e[0],
                1e-3 * e[1],
                e[2],
                e[3],
                1e-3 * e[4],
                1e-3 * e[5],
                e[6],
                e[7],
                1e-3 * e[8],
                1e-3 * e[9],
                e[10],
                e[11],
                1e-3 * e[12],
                1e-3 * e[13],
                e[14],
                e[15]
              ];
              this.anchors[h].group.matrix.set(...l);
            } else
              this.anchors[h].group.matrix.set(...e);
          }
          for (let h = 0; h < this.faceMeshes.length; h++)
            this.faceMeshes[h].matrix.set(...a);
        }
      }, this._resize(), await this.controller.setup(), await this.controller.dummyRun(o), this._resize(), this.controller.processVideo(o), n();
    });
  }
  _resize() {
    const { renderer: n, cssRenderer: t, camera: o, container: r, video: s } = this;
    if (!s)
      return;
    {
      this.video.setAttribute("width", this.video.videoWidth), this.video.setAttribute("height", this.video.videoHeight), this.controller.onInputResized(s);
      const { fov: v, aspect: l, near: m, far: p } = this.controller.getCameraParams();
      this.camera.fov = v, this.camera.aspect = l, this.camera.near = m, this.camera.far = p, this.camera.updateProjectionMatrix(), this.renderer.setSize(this.video.videoWidth, this.video.videoHeight), this.cssRenderer.setSize(this.video.videoWidth, this.video.videoHeight);
    }
    let i, a;
    const d = s.videoWidth / s.videoHeight, h = r.clientWidth / r.clientHeight;
    d > h ? (a = r.clientHeight, i = a * d) : (i = r.clientWidth, a = i / d), s.style.top = -(a - r.clientHeight) / 2 + "px", s.style.left = -(i - r.clientWidth) / 2 + "px", s.style.width = i + "px", s.style.height = a + "px";
    const c = n.domElement, e = t.domElement;
    c.style.position = "absolute", c.style.top = s.style.top, c.style.left = s.style.left, c.style.width = s.style.width, c.style.height = s.style.height, e.style.position = "absolute", e.style.top = s.style.top, e.style.left = s.style.left, e.style.transformOrigin = "top left", e.style.transform = "scale(" + i / parseFloat(e.style.width) + "," + a / parseFloat(e.style.height) + ")";
  }
}
window.MINDAR || (window.MINDAR = {});
window.MINDAR.FACE || (window.MINDAR.FACE = {});
window.MINDAR.FACE.MindARThree = C;
export {
  C as MindARThree
};
