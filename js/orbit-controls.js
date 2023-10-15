!(function (t) {
  function e(i) {
    if (s[i]) return s[i].exports;
    var a = (s[i] = { exports: {}, id: i, loaded: !1 });
    return t[i].call(a.exports, a, a.exports, e), (a.loaded = !0), a.exports;
  }
  var s = {};
  return (e.m = t), (e.c = s), (e.p = ""), e(0);
})([
  function (t, e) {
    if ("undefined" == typeof AFRAME)
      throw new Error(
        "Component attempted to register before AFRAME was available."
      );
    var s = THREE.Math.radToDeg;
    AFRAME.registerComponent("orbit-controls", {
      dependencies: ["position", "rotation"],
      schema: {
        enabled: { default: !0 },
        target: { default: "" },
        distance: { default: 1 },
        enableRotate: { default: !0 },
        rotateSpeed: { default: 1 },
        enableZoom: { default: !0 },
        zoomSpeed: { default: 1 },
        enablePan: { default: !0 },
        keyPanSpeed: { default: 7 },
        enableDamping: { default: !1 },
        dampingFactor: { default: 0.25 },
        autoRotate: { default: !1 },
        autoRotateSpeed: { default: 2 },
        enableKeys: { default: !0 },
        minAzimuthAngle: { default: -(1 / 0) },
        maxAzimuthAngle: { default: 1 / 0 },
        minPolarAngle: { default: 0 },
        maxPolarAngle: { default: Math.PI },
        minZoom: { default: 0 },
        maxZoom: { default: 1 / 0 },
        invertZoom: { default: !1 },
        minDistance: { default: 0 },
        maxDistance: { default: 1 / 0 },
        rotateTo: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
        rotateToSpeed: { type: "number", default: 0.05 },
        logPosition: { type: "boolean", default: !1 },
        autoVRLookCam: { type: "boolean", default: !0 },
      },
      multiple: !1,
      init: function () {
        (this.sceneEl = this.el.sceneEl),
          (this.object = this.el.object3D),
          (this.target = this.sceneEl.querySelector(
            this.data.target
          ).object3D.position),
          console.log("enabled: ", this.data.enabled),
          (this.isRunning = !1),
          (this.lookControls = null),
          this.data.autoVRLookCam &&
            (this.el.components["look-controls"]
              ? (this.lookControls = this.el.components["look-controls"])
              : (this.el.setAttribute("look-controls", ""),
                (this.lookControls = this.el.components["look-controls"])),
            this.lookControls.pause(),
            this.el.sceneEl.addEventListener(
              "enter-vr",
              this.onEnterVR.bind(this),
              !1
            ),
            this.el.sceneEl.addEventListener(
              "exit-vr",
              this.onExitVR.bind(this),
              !1
            )),
          (this.dolly = new THREE.Object3D()),
          this.dolly.position.copy(this.object.position),
          (this.savedPose = null),
          (this.STATE = {
            NONE: -1,
            ROTATE: 0,
            DOLLY: 1,
            PAN: 2,
            TOUCH_ROTATE: 3,
            TOUCH_DOLLY: 4,
            TOUCH_PAN: 5,
            ROTATE_TO: 6,
          }),
          (this.state = this.STATE.NONE),
          (this.EPS = 1e-6),
          (this.lastPosition = new THREE.Vector3()),
          (this.lastQuaternion = new THREE.Quaternion()),
          (this.spherical = new THREE.Spherical()),
          (this.sphericalDelta = new THREE.Spherical()),
          (this.scale = 1),
          (this.zoomChanged = !1),
          (this.rotateStart = new THREE.Vector2()),
          (this.rotateEnd = new THREE.Vector2()),
          (this.rotateDelta = new THREE.Vector2()),
          (this.panStart = new THREE.Vector2()),
          (this.panEnd = new THREE.Vector2()),
          (this.panDelta = new THREE.Vector2()),
          (this.panOffset = new THREE.Vector3()),
          (this.dollyStart = new THREE.Vector2()),
          (this.dollyEnd = new THREE.Vector2()),
          (this.dollyDelta = new THREE.Vector2()),
          (this.vector = new THREE.Vector3()),
          (this.desiredPosition = new THREE.Vector3()),
          (this.mouseButtons = {
            ORBIT: THREE.MOUSE.LEFT,
            ZOOM: THREE.MOUSE.MIDDLE,
            PAN: THREE.MOUSE.RIGHT,
          }),
          (this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 }),
          this.bindMethods();
      },
      update: function (t) {
        if ((console.log("component update"), this.data.rotateTo)) {
          var e = new THREE.Vector3(
            this.data.rotateTo.x,
            this.data.rotateTo.y,
            this.data.rotateTo.z
          );
          this.desiredPosition.equals(e) ||
            (this.desiredPosition.copy(e), this.rotateTo(this.desiredPosition));
        }
        this.dolly.position.copy(this.object.position), this.updateView(!0);
      },
      remove: function () {
        (this.isRunning = !1),
          this.removeEventListeners(),
          this.el.sceneEl.removeEventListener("enter-vr", this.onEnterVR, !1),
          this.el.sceneEl.removeEventListener("exit-vr", this.onExitVR, !1);
      },
      tick: function (t) {
        var e = !(!this.data.enabled || !this.isRunning) && this.updateView();
        e === !0 &&
          this.data.logPosition === !0 &&
          console.log(this.el.object3D.position);
      },
      onEnterVR: function (t) {
        this.saveCameraPose(),
          this.el.setAttribute("position", { x: 0, y: 2, z: 5 }),
          this.el.setAttribute("rotation", { x: 0, y: 0, z: 0 }),
          this.pause(),
          this.lookControls.play(),
          this.data.autoRotate &&
            console.warn(
              "orbit-controls: Sorry, autoRotate is not implemented in VR mode"
            );
      },
      onExitVR: function (t) {
        this.lookControls.pause(),
          this.play(),
          this.restoreCameraPose(),
          this.updateView(!0);
      },
      pause: function () {
        (this.isRunning = !1), this.removeEventListeners();
      },
      play: function () {
        this.isRunning = !0;
        var t, e;
        this.object.traverse(function (s) {
          s instanceof THREE.PerspectiveCamera
            ? ((t = s), (e = "PerspectiveCamera"))
            : s instanceof THREE.OrthographicCamera &&
              ((t = s), (e = "OrthographicCamera"));
        }),
          (this.camera = t),
          (this.cameraType = e),
          this.sceneEl.addEventListener(
            "renderstart",
            this.onRenderTargetLoaded,
            !1
          ),
          this.lookControls && this.lookControls.pause(),
          this.canvasEl && this.addEventListeners();
      },
      onRenderTargetLoaded: function () {
        this.sceneEl.removeEventListener(
          "renderstart",
          this.onRenderTargetLoaded,
          !1
        ),
          (this.canvasEl = this.sceneEl.canvas),
          this.addEventListeners();
      },
      bindMethods: function () {
        (this.onRenderTargetLoaded = this.onRenderTargetLoaded.bind(this)),
          (this.onContextMenu = this.onContextMenu.bind(this)),
          (this.onMouseDown = this.onMouseDown.bind(this)),
          (this.onMouseWheel = this.onMouseWheel.bind(this)),
          (this.onMouseMove = this.onMouseMove.bind(this)),
          (this.onMouseUp = this.onMouseUp.bind(this)),
          (this.onTouchStart = this.onTouchStart.bind(this)),
          (this.onTouchMove = this.onTouchMove.bind(this)),
          (this.onTouchEnd = this.onTouchEnd.bind(this)),
          (this.onKeyDown = this.onKeyDown.bind(this));
      },
      addEventListeners: function () {
        this.canvasEl.addEventListener("contextmenu", this.onContextMenu, !1),
          this.canvasEl.addEventListener("mousedown", this.onMouseDown, !1),
          this.canvasEl.addEventListener("mousewheel", this.onMouseWheel, !1),
          this.canvasEl.addEventListener(
            "MozMousePixelScroll",
            this.onMouseWheel,
            !1
          ),
          this.canvasEl.addEventListener("touchstart", this.onTouchStart, !1),
          this.canvasEl.addEventListener("touchend", this.onTouchEnd, !1),
          this.canvasEl.addEventListener("touchmove", this.onTouchMove, !1),
          window.addEventListener("keydown", this.onKeyDown, !1);
      },
      removeEventListeners: function () {
        this.canvasEl &&
          (this.canvasEl.removeEventListener(
            "contextmenu",
            this.onContextMenu,
            !1
          ),
          this.canvasEl.removeEventListener("mousedown", this.onMouseDown, !1),
          this.canvasEl.removeEventListener(
            "mousewheel",
            this.onMouseWheel,
            !1
          ),
          this.canvasEl.removeEventListener(
            "MozMousePixelScroll",
            this.onMouseWheel,
            !1
          ),
          this.canvasEl.removeEventListener(
            "touchstart",
            this.onTouchStart,
            !1
          ),
          this.canvasEl.removeEventListener("touchend", this.onTouchEnd, !1),
          this.canvasEl.removeEventListener("touchmove", this.onTouchMove, !1),
          this.canvasEl.removeEventListener("mousemove", this.onMouseMove, !1),
          this.canvasEl.removeEventListener("mouseup", this.onMouseUp, !1),
          this.canvasEl.removeEventListener("mouseout", this.onMouseUp, !1)),
          window.removeEventListener("keydown", this.onKeyDown, !1);
      },
      onContextMenu: function (t) {
        t.preventDefault();
      },
      onMouseDown: function (t) {
        if (this.data.enabled && this.isRunning) {
          if (
            t.button === this.mouseButtons.ORBIT &&
            (t.shiftKey || t.ctrlKey)
          ) {
            if (this.data.enablePan === !1) return;
            this.handleMouseDownPan(t), (this.state = this.STATE.PAN);
          } else if (t.button === this.mouseButtons.ORBIT) {
            if ((this.panOffset.set(0, 0, 0), this.data.enableRotate === !1))
              return;
            this.handleMouseDownRotate(t), (this.state = this.STATE.ROTATE);
          } else if (t.button === this.mouseButtons.ZOOM) {
            if ((this.panOffset.set(0, 0, 0), this.data.enableZoom === !1))
              return;
            this.handleMouseDownDolly(t), (this.state = this.STATE.DOLLY);
          } else if (t.button === this.mouseButtons.PAN) {
            if (this.data.enablePan === !1) return;
            this.handleMouseDownPan(t), (this.state = this.STATE.PAN);
          }
          this.state !== this.STATE.NONE &&
            (this.canvasEl.addEventListener("mousemove", this.onMouseMove, !1),
            this.canvasEl.addEventListener("mouseup", this.onMouseUp, !1),
            this.canvasEl.addEventListener("mouseout", this.onMouseUp, !1),
            this.el.emit("start-drag-orbit-controls", null, !1));
        }
      },
      onMouseMove: function (t) {
        if (this.data.enabled && this.isRunning)
          if ((t.preventDefault(), this.state === this.STATE.ROTATE)) {
            if (this.data.enableRotate === !1) return;
            this.handleMouseMoveRotate(t);
          } else if (this.state === this.STATE.DOLLY) {
            if (this.data.enableZoom === !1) return;
            this.handleMouseMoveDolly(t);
          } else if (this.state === this.STATE.PAN) {
            if (this.data.enablePan === !1) return;
            this.handleMouseMovePan(t);
          }
      },
      onMouseUp: function (t) {
        this.data.enabled &&
          this.isRunning &&
          this.state !== this.STATE.ROTATE_TO &&
          (t.preventDefault(),
          t.stopPropagation(),
          this.handleMouseUp(t),
          this.canvasEl.removeEventListener("mousemove", this.onMouseMove, !1),
          this.canvasEl.removeEventListener("mouseup", this.onMouseUp, !1),
          this.canvasEl.removeEventListener("mouseout", this.onMouseUp, !1),
          (this.state = this.STATE.NONE),
          this.el.emit("end-drag-orbit-controls", null, !1));
      },
      onMouseWheel: function (t) {
        this.data.enabled &&
          this.isRunning &&
          this.data.enableZoom !== !1 &&
          (this.state === this.STATE.NONE ||
            this.state === this.STATE.ROTATE) &&
          (t.preventDefault(), t.stopPropagation(), this.handleMouseWheel(t));
      },
      onTouchStart: function (t) {
        if (this.data.enabled && this.isRunning) {
          switch (t.touches.length) {
            case 1:
              if (this.data.enableRotate === !1) return;
              this.handleTouchStartRotate(t),
                (this.state = this.STATE.TOUCH_ROTATE);
              break;
            case 2:
              if (this.data.enableZoom === !1) return;
              this.handleTouchStartDolly(t),
                (this.state = this.STATE.TOUCH_DOLLY);
              break;
            case 3:
              if (this.data.enablePan === !1) return;
              this.handleTouchStartPan(t), (this.state = this.STATE.TOUCH_PAN);
              break;
            default:
              this.state = this.STATE.NONE;
          }
          this.state !== this.STATE.NONE &&
            this.el.emit("start-drag-orbit-controls", null, !1);
        }
      },
      onTouchMove: function (t) {
        if (this.data.enabled && this.isRunning)
          switch ((t.preventDefault(), t.stopPropagation(), t.touches.length)) {
            case 1:
              if (this.enableRotate === !1) return;
              if (this.state !== this.STATE.TOUCH_ROTATE) return;
              this.handleTouchMoveRotate(t);
              break;
            case 2:
              if (this.data.enableZoom === !1) return;
              if (this.state !== this.STATE.TOUCH_DOLLY) return;
              this.handleTouchMoveDolly(t);
              break;
            case 3:
              if (this.data.enablePan === !1) return;
              if (this.state !== this.STATE.TOUCH_PAN) return;
              this.handleTouchMovePan(t);
              break;
            default:
              this.state = this.STATE.NONE;
          }
      },
      onTouchEnd: function (t) {
        this.data.enabled &&
          this.isRunning &&
          (this.handleTouchEnd(t),
          this.el.emit("end-drag-orbit-controls", null, !1),
          (this.state = this.STATE.NONE));
      },
      onKeyDown: function (t) {
        this.data.enabled &&
          this.isRunning &&
          this.data.enableKeys !== !1 &&
          this.data.enablePan !== !1 &&
          this.handleKeyDown(t);
      },
      handleMouseDownRotate: function (t) {
        this.rotateStart.set(t.clientX, t.clientY);
      },
      handleMouseDownDolly: function (t) {
        this.dollyStart.set(t.clientX, t.clientY);
      },
      handleMouseDownPan: function (t) {
        this.panStart.set(t.clientX, t.clientY);
      },
      handleMouseMoveRotate: function (t) {
        this.rotateEnd.set(t.clientX, t.clientY),
          this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
        var e = this.canvasEl === document ? this.canvasEl.body : this.canvasEl;
        this.rotateLeft(
          ((2 * Math.PI * this.rotateDelta.x) / e.clientWidth) *
            this.data.rotateSpeed
        ),
          this.rotateUp(
            ((2 * Math.PI * this.rotateDelta.y) / e.clientHeight) *
              this.data.rotateSpeed
          ),
          this.rotateStart.copy(this.rotateEnd),
          this.updateView();
      },
      handleMouseMoveDolly: function (t) {
        this.dollyEnd.set(t.clientX, t.clientY),
          this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart),
          this.dollyDelta.y > 0
            ? this.data.invertZoom
              ? this.dollyOut(this.getZoomScale())
              : this.dollyIn(this.getZoomScale())
            : this.dollyDelta.y < 0 &&
              (this.data.invertZoom
                ? this.dollyIn(this.getZoomScale())
                : this.dollyOut(this.getZoomScale())),
          this.dollyStart.copy(this.dollyEnd),
          this.updateView();
      },
      handleMouseMovePan: function (t) {
        this.panEnd.set(t.clientX, t.clientY),
          this.panDelta.subVectors(this.panEnd, this.panStart),
          this.pan(this.panDelta.x, this.panDelta.y),
          this.panStart.copy(this.panEnd),
          this.updateView();
      },
      handleMouseUp: function (t) {},
      handleMouseWheel: function (t) {
        var e = 0;
        void 0 !== t.wheelDelta
          ? (e = t.wheelDelta)
          : void 0 !== t.detail && (e = -t.detail),
          e > 0
            ? this.data.invertZoom
              ? this.dollyIn(this.getZoomScale())
              : this.dollyOut(this.getZoomScale())
            : e < 0 &&
              (this.data.invertZoom
                ? this.dollyOut(this.getZoomScale())
                : this.dollyIn(this.getZoomScale())),
          this.updateView();
      },
      handleTouchStartRotate: function (t) {
        this.rotateStart.set(t.touches[0].pageX, t.touches[0].pageY);
      },
      handleTouchStartDolly: function (t) {
        var e = t.touches[0].pageX - t.touches[1].pageX,
          s = t.touches[0].pageY - t.touches[1].pageY,
          i = Math.sqrt(e * e + s * s);
        this.dollyStart.set(0, i);
      },
      handleTouchStartPan: function (t) {
        this.panStart.set(t.touches[0].pageX, t.touches[0].pageY);
      },
      handleTouchMoveRotate: function (t) {
        this.rotateEnd.set(t.touches[0].pageX, t.touches[0].pageY),
          this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
        var e = this.canvasEl === document ? this.canvasEl.body : this.canvasEl;
        this.rotateLeft(
          ((2 * Math.PI * this.rotateDelta.x) / e.clientWidth) *
            this.data.rotateSpeed
        ),
          this.rotateUp(
            ((2 * Math.PI * this.rotateDelta.y) / e.clientHeight) *
              this.data.rotateSpeed
          ),
          this.rotateStart.copy(this.rotateEnd),
          this.updateView();
      },
      handleTouchMoveDolly: function (t) {
        var e = t.touches[0].pageX - t.touches[1].pageX,
          s = t.touches[0].pageY - t.touches[1].pageY,
          i = Math.sqrt(e * e + s * s);
        this.dollyEnd.set(0, i),
          this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart),
          this.dollyDelta.y > 0
            ? this.dollyIn(this.getZoomScale())
            : this.dollyDelta.y < 0 && this.dollyOut(this.getZoomScale()),
          this.dollyStart.copy(this.dollyEnd),
          this.updateView();
      },
      handleTouchMovePan: function (t) {
        this.panEnd.set(t.touches[0].pageX, t.touches[0].pageY),
          this.panDelta.subVectors(this.panEnd, this.panStart),
          this.pan(this.panDelta.x, this.panDelta.y),
          this.panStart.copy(this.panEnd),
          this.updateView();
      },
      handleTouchEnd: function (t) {},
      handleKeyDown: function (t) {
        switch (t.keyCode) {
          case this.keys.UP:
            this.pan(0, this.data.keyPanSpeed), this.updateView();
            break;
          case this.keys.BOTTOM:
            this.pan(0, -this.data.keyPanSpeed), this.updateView();
            break;
          case this.keys.LEFT:
            this.pan(this.data.keyPanSpeed, 0), this.updateView();
            break;
          case this.keys.RIGHT:
            this.pan(-this.data.keyPanSpeed, 0), this.updateView();
        }
      },
      getAutoRotationAngle: function () {
        return ((2 * Math.PI) / 60 / 60) * this.data.autoRotateSpeed;
      },
      getZoomScale: function () {
        return Math.pow(0.95, this.data.zoomSpeed);
      },
      rotateLeft: function (t) {
        this.sphericalDelta.theta -= t;
      },
      rotateUp: function (t) {
        this.sphericalDelta.phi -= t;
      },
      rotateTo: function (t) {
        (this.state = this.STATE.ROTATE_TO), this.desiredPosition.copy(t);
      },
      panHorizontally: function (t, e) {
        var s = new THREE.Vector3();
        s.setFromMatrixColumn(e, 0),
          s.multiplyScalar(-t),
          this.panOffset.add(s);
      },
      panVertically: function (t, e) {
        var s = new THREE.Vector3();
        s.setFromMatrixColumn(e, 1), s.multiplyScalar(t), this.panOffset.add(s);
      },
      pan: function (t, e) {
        var s = new THREE.Vector3(),
          i = this.canvasEl === document ? this.canvasEl.body : this.canvasEl;
        if ("PerspectiveCamera" === this.cameraType) {
          var a = this.dolly.position;
          s.copy(a).sub(this.target);
          var o = s.length();
          (o *= Math.tan(((this.camera.fov / 2) * Math.PI) / 180)),
            this.panHorizontally(
              (2 * t * o) / i.clientHeight,
              this.object.matrix
            ),
            this.panVertically(
              (2 * e * o) / i.clientHeight,
              this.object.matrix
            );
        } else
          "OrthographicCamera" === this.cameraType
            ? (this.panHorizontally(
                (t * (this.dolly.right - this.dolly.left)) /
                  this.camera.zoom /
                  i.clientWidth,
                this.object.matrix
              ),
              this.panVertically(
                (e * (this.dolly.top - this.dolly.bottom)) /
                  this.camera.zoom /
                  i.clientHeight,
                this.object.matrix
              ))
            : (console.warn(
                "Trying to pan: WARNING: Orbit Controls encountered an unknown camera type - pan disabled."
              ),
              (this.data.enablePan = !1));
      },
      dollyIn: function (t) {
        "PerspectiveCamera" === this.cameraType
          ? (this.scale *= t)
          : "OrthographicCamera" === this.cameraType
          ? ((this.camera.zoom = Math.max(
              this.data.minZoom,
              Math.min(this.data.maxZoom, this.camera.zoom * t)
            )),
            this.camera.updateProjectionMatrix(),
            (this.zoomChanged = !0))
          : (console.warn(
              "Trying to dolly in: WARNING: Orbit Controls encountered an unknown camera type - dolly/zoom disabled."
            ),
            (this.data.enableZoom = !1));
      },
      dollyOut: function (t) {
        "PerspectiveCamera" === this.cameraType
          ? (this.scale /= t)
          : "OrthographicCamera" === this.cameraType
          ? ((this.camera.zoom = Math.max(
              this.data.minZoom,
              Math.min(this.data.maxZoom, this.camera.zoom / t)
            )),
            this.camera.updateProjectionMatrix(),
            (this.zoomChanged = !0))
          : (console.warn(
              "Trying to dolly out: WARNING: Orbit Controls encountered an unknown camera type - dolly/zoom disabled."
            ),
            (this.data.enableZoom = !1));
      },
      lookAtTarget: function (t, e) {
        var s = new THREE.Vector3();
        s.subVectors(t.position, e).add(t.position), t.lookAt(s);
      },
      saveCameraPose: function () {
        this.savedPose ||
          (this.savedPose = {
            position: this.dolly.position,
            rotation: this.dolly.rotation,
          });
      },
      restoreCameraPose: function () {
        this.savedPose &&
          (this.dolly.position.copy(this.savedPose.position),
          this.dolly.rotation.copy(this.savedPose.rotation),
          (this.savedPose = null));
      },
      updateView: function (t) {
        if (this.desiredPosition && this.state === this.STATE.ROTATE_TO) {
          var e = new THREE.Spherical();
          e.setFromVector3(this.desiredPosition);
          var i = e.phi - this.spherical.phi,
            a = e.theta - this.spherical.theta;
          this.sphericalDelta.set(
            this.spherical.radius,
            i * this.data.rotateToSpeed,
            a * this.data.rotateToSpeed
          );
        }
        var o = new THREE.Vector3(),
          n = new THREE.Quaternion().setFromUnitVectors(
            this.dolly.up,
            new THREE.Vector3(0, 1, 0)
          ),
          h = n.clone().invert();
        if (
          (o.copy(this.dolly.position).sub(this.target),
          o.applyQuaternion(n),
          this.spherical.setFromVector3(o),
          this.data.autoRotate &&
            this.state === this.STATE.NONE &&
            this.rotateLeft(this.getAutoRotationAngle()),
          (this.spherical.theta += this.sphericalDelta.theta),
          (this.spherical.phi += this.sphericalDelta.phi),
          (this.spherical.theta = Math.max(
            this.data.minAzimuthAngle,
            Math.min(this.data.maxAzimuthAngle, this.spherical.theta)
          )),
          (this.spherical.phi = Math.max(
            this.data.minPolarAngle,
            Math.min(this.data.maxPolarAngle, this.spherical.phi)
          )),
          this.spherical.makeSafe(),
          (this.spherical.radius *= this.scale),
          (this.spherical.radius = Math.max(
            this.data.minDistance,
            Math.min(this.data.maxDistance, this.spherical.radius)
          )),
          this.target.add(this.panOffset),
          o.setFromSpherical(this.spherical),
          o.applyQuaternion(h),
          this.dolly.position.copy(this.target).add(o),
          this.target && this.lookAtTarget(this.dolly, this.target),
          this.data.enableDamping === !0
            ? ((this.sphericalDelta.theta *= 1 - this.data.dampingFactor),
              (this.sphericalDelta.phi *= 1 - this.data.dampingFactor))
            : this.sphericalDelta.set(0, 0, 0),
          (this.scale = 1),
          this.panOffset.set(0, 0, 0),
          t === !0 ||
            this.zoomChanged ||
            this.lastPosition.distanceToSquared(this.dolly.position) >
              this.EPS ||
            8 * (1 - this.lastQuaternion.dot(this.dolly.quaternion)) > this.EPS)
        ) {
          var l = this.calculateHMDQuaternion(),
            r = new THREE.Euler();
          return (
            r.setFromQuaternion(l, "YXZ"),
            this.el.setAttribute("position", {
              x: this.dolly.position.x,
              y: this.dolly.position.y,
              z: this.dolly.position.z,
            }),
            this.el.setAttribute("rotation", {
              x: s(r.x),
              y: s(r.y),
              z: s(r.z),
            }),
            this.lastPosition.copy(this.dolly.position),
            this.lastQuaternion.copy(this.dolly.quaternion),
            (this.zoomChanged = !1),
            !0
          );
        }
        return !1;
      },
      calculateHMDQuaternion: (function () {
        var t = new THREE.Quaternion();
        return function () {
          return t.copy(this.dolly.quaternion), t;
        };
      })(),
    });
  },
]);
