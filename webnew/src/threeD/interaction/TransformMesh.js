import {TransformControls} from 'three/examples/jsm/controls/TransformControls'
import $hub from 'hub-js';

export class TransformMesh {
    constructor(app) {
        this.app = app
        this.cube = null
        this.control = null
        this.boxHelper = null
        this.hub = null
    }

    addEvent() {

        const self = this
        this.control = new TransformControls(this.app.camera, this.app.renderer.domElement);

        this.app.scene.add(this.control);

        this.control.addEventListener('mouseDown', function () {
            self.app.controls.enabled = false
        });
        this.control.addEventListener('mouseUp', function () {
            self.app.controls.enabled = true
        });
        this.app.raycasterHelper.startRaycast()

        this.hub = $hub.on("getMesh", function (mesh) {
            self.control.attach(mesh[0].object)
        })
    }

    removeEvent() {
        this.hub.off()
        if (this.control) {
            this.app.scene.remove(this.control);
            this.app.scene.remove(this.boxHelper);
            this.control.dispose();
        }
    }
}
